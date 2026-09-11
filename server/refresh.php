<?php
/**
 * Space Program — tache serveur : rafraichit les donnees par lanceur, archive,
 * publie sur GitHub puis supprime le contenu obsolete de public_html.
 *
 * Principe : le serveur ne doit contenir que le contenu courant (manifeste du depot).
 * Tout fichier hors manifeste est archive dans un dossier prive AVANT suppression,
 * et la suppression n'a lieu qu'apres publication sur GitHub (ordre impose).
 *
 * Configuration PRIVEE (jamais dans le depot) : tasks/private/config.php
 *   <?php return [
 *     'token' => '<secret>',                      // obligatoire (garde d'acces)
 *     'll2_limit' => 50,                          // taille de page LL2 (quota)
 *     'keep' => 12,                               // lots d'archives conserves
 *     'github_token' => '',                       // PAT fine-grained (contents:write) — optionnel
 *     'github_repo' => 'leosand/Space_program',
 *     'github_branch' => 'master',
 *     'require_github_commit' => true,            // ne pas supprimer sans commit publie
 *   ];
 *
 * Appel : https://<domaine>/tasks/refresh.php?token=<secret>&mode=...
 *   mode=status   : etat (fichiers, dernier rafraichissement)
 *   mode=dry-run  : simulation (aucune ecriture/suppression)
 *   mode=refresh  : rafraichit data/completed-by-launcher.json (archive l'ancien)
 *   mode=prune    : archive + supprime les fichiers hors manifeste
 *   mode=cron     : refresh + commit GitHub (si configure) + prune   [a planifier]
 */

declare(strict_types=1);

$PRIV = __DIR__ . '/private';
$CFG  = $PRIV . '/config.php';
$SITE = dirname(__DIR__);
$DATA = $SITE . '/data/completed-by-launcher.json';

header('Content-Type: text/plain; charset=utf-8');

$cfgFile = is_file($CFG) ? require $CFG : [];
$token   = isset($_GET['token']) ? (string)$_GET['token'] : '';
if (!is_array($cfgFile) || !isset($cfgFile['token']) || !hash_equals((string)$cfgFile['token'], $token)) {
    http_response_code(403);
    exit("forbidden\n");
}

$mode    = isset($_GET['mode']) ? (string)$_GET['mode'] : 'status';
$dry     = ($mode === 'dry-run');
$GITHUB  = (string)($cfgFile['github_token'] ?? '');
$REPO    = (string)($cfgFile['github_repo'] ?? '');
$BRANCH  = (string)($cfgFile['github_branch'] ?? 'master');
$KEEP    = max(1, (int)($cfgFile['keep'] ?? 12));
$REQ_COMMIT = (bool)($cfgFile['require_github_commit'] ?? true);

$lines = [];
function emit(array &$lines, string $msg): void {
    $lines[] = $msg;
}
function logLine(string $priv, string $msg): void {
    $f = $priv . '/log.txt';
    if (is_file($f) && filesize($f) > 512 * 1024) { @rename($f, $f . '.1'); }
    @file_put_contents($f, date('c') . ' ' . $msg . "\n", FILE_APPEND);
}
function httpGet(string $url, int $timeoutSec = 45): array {
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_TIMEOUT        => $timeoutSec,
        CURLOPT_HTTPHEADER     => ['Accept: application/json', 'User-Agent: space-program-task/1.0'],
    ]);
    $body = curl_exec($ch);
    $code = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return [$code, is_string($body) ? $body : null];
}
function ll2Json(array &$linesOut, string $priv, string $url, int $tries = 4): ?array {
    for ($i = 0; $i < $tries; $i++) {
        [$code, $body] = httpGet($url);
        if ($code === 200 && $body !== null) {
            return json_decode($body, true) ?: null;
        }
        if ($code === 429) {
            $wait = 120;
            if ($body !== null && preg_match('/available in (\d+) seconds/', $body, $m)) {
                $wait = min((int)$m[1] + 5, 900);
            }
            emit($linesOut, "    429 quota -> attente {$wait}s");
            sleep($wait);
            continue;
        }
        sleep(5);
    }
    return null;
}
function archiveFile(string $priv, string $relative, string $content, string $lot): void {
    $dest = $priv . '/archive/' . $lot . '/' . $relative;
    @mkdir(dirname($dest), 0775, true);
    @file_put_contents($dest, $content);
}
function retention(string $priv, int $keep): void {
    $base = $priv . '/archive';
    if (!is_dir($base)) { return; }
    $lots = array_values(array_filter(scandir($base), fn($d) => str_starts_with($d, 'remote-') || str_starts_with($d, 'data-')));
    rsort($lots);
    foreach (array_slice($lots, $keep) as $old) {
        $path = $base . '/' . $old;
        if (is_file($path)) { @unlink($path); }
        elseif (is_dir($path)) { foreach (glob($path . '/*') ?: [] as $f) { is_dir($f) ? @rmdir($f) : @unlink($f); } @rmdir($path); }
    }
}

// ---------------------------------------------------------------- refresh LL2
function refresh(array &$linesOut, string $priv, string $dataFile, string $site, int $per, bool $dry): int {
    $state = is_file($dataFile) ? json_decode((string)file_get_contents($dataFile), true) : null;
    if (!is_array($state) || empty($state['launchers'])) {
        emit($linesOut, 'refresh: aucune donnee locale exploitable (lanceurs inconnus)');
        return 1;
    }
    $before = json_encode($state['launchers'], JSON_UNESCAPED_UNICODE);
    $beforeTs = $state['generated_at'] ?? null;
    $updated = 0;
    foreach ($state['launchers'] as $name => $info) {
        $id = $info['id'] ?? null;
        if (!$id) { continue; }
        $launches = [];
        $offset = 0; $complete = false; $available = null;
        while (count($launches) < $per) {
            $limit = min(50, $per - count($launches));
            $url = "https://ll.thespacedevs.com/2.2.0/launch/previous/?rocket__configuration__id={$id}"
                 . "&limit={$limit}&offset={$offset}&mode=detailed";
            $data = ll2Json($linesOut, $priv, $url);
            if ($data === null) { break; }
            $available = $data['count'] ?? $available;
            $results = $data['results'] ?? [];
            foreach ($results as $l) {
                $rk = $l['rocket']['configuration'] ?? [];
                $launches[] = [
                    'id' => $l['id'] ?? null,
                    'name' => $l['name'] ?? null,
                    'net' => $l['net'] ?? null,
                    'status' => $l['status']['abbrev'] ?? null,
                    'statusName' => $l['status']['name'] ?? null,
                    'provider' => $l['launch_service_provider']['name'] ?? null,
                    'rocket' => $rk['full_name'] ?? ($rk['name'] ?? null),
                    'mission' => $l['mission']['name'] ?? null,
                    'missionType' => $l['mission']['type'] ?? null,
                    'pad' => $l['pad']['name'] ?? null,
                    'location' => $l['pad']['location']['name'] ?? null,
                ];
                if (count($launches) >= $per) { break; }
            }
            $offset += count($results);
            if (count($results) < $limit || ($available !== null && $offset >= $available)) { $complete = true; break; }
            if (count($launches) >= $per) { $complete = true; break; }
            sleep(4); // politesse quota LL2
        }
        if ($launches) {
            $state['launchers'][$name]['launches'] = $launches;
            $state['launchers'][$name]['collected'] = count($launches);
            $state['launchers'][$name]['available'] = $available;
            $state['launchers'][$name]['complete'] = $complete;
            $updated++;
            emit($linesOut, "  {$name}: " . count($launches) . " vols (sur {$available})");
        }
    }
    $after = json_encode($state['launchers'], JSON_UNESCAPED_UNICODE);
    if ($after === $before) {
        $state['generated_at'] = $beforeTs;
        emit($linesOut, 'refresh: donnees inchangees (horodatage conserve)');
    } else {
        $state['generated_at'] = gmdate('c');
    }
    if ($dry) { emit($linesOut, 'dry-run: aucune ecriture'); return 0; }
    // archive de l'ancien fichier puis ecriture atomique
    if (is_file($dataFile)) {
        $lot = 'data-' . gmdate('Ymd-His');
        @mkdir($priv . '/archive/' . $lot, 0775, true);
        @file_put_contents($priv . '/archive/' . $lot . '/completed-by-launcher.json.gz', gzencode((string)file_get_contents($dataFile), 6));
    }
    $tmp = $dataFile . '.tmp';
    if (@file_put_contents($tmp, json_encode($state, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT)) === false) {
        emit($linesOut, 'refresh: ECHEC ecriture'); return 1;
    }
    @rename($tmp, $dataFile);
    emit($linesOut, "refresh: {$updated} lanceur(s) mis a jour");
    return 0;
}

// -------------------------------------------------------------------- access
function remoteFiles(string $dir, string $prefix = ''): array {
    $out = [];
    foreach (scandir($dir) ?: [] as $f) {
        if ($f === '.' || $f === '..') { continue; }
        $p = $dir . '/' . $f;
        $rel = $prefix === '' ? $f : $prefix . '/' . $f;
        if (is_dir($p)) { $out = array_merge($out, remoteFiles($p, $rel)); }
        else { $out[] = $rel; }
    }
    return $out;
}

// --------------------------------------------------------------------- prune
function prune(array &$linesOut, string $priv, string $site, bool $dry, int $keep): int {
    $manifestFile = $priv . '/manifest.json';
    if (!is_file($manifestFile)) { emit($linesOut, 'prune: manifeste absent -> refus de supprimer'); return 1; }
    $manifest = json_decode((string)file_get_contents($manifestFile), true) ?: [];
    if (count($manifest) < 10) { emit($linesOut, 'prune: manifeste suspicieusement petit -> refus'); return 1; }
    $keepSet = array_flip($manifest);
    $protected = ['.htaccess'];
    $files = remoteFiles($site);
    $orphans = [];
    foreach ($files as $rel) {
        if (str_starts_with($rel, 'tasks/')) { continue; }          // zone technique
        if (in_array($rel, $protected, true)) { continue; }
        if (!isset($keepSet[$rel])) { $orphans[] = $rel; }
    }
    emit($linesOut, 'prune: ' . count($files) . ' fichiers | manifeste ' . count($manifest) . ' | orphelins ' . count($orphans));
    if (!$orphans) { emit($linesOut, 'prune: serveur deja propre'); return 0; }
    if (count($orphans) > 40) { emit($linesOut, 'prune: > 40 orphelins -> refus (verification manuelle)'); return 1; }
    if ($dry) { foreach ($orphans as $o) { emit($linesOut, "  [simulation] { $o }"); } return 0; }
    $lot = 'remote-' . gmdate('Ymd-His');
    $deleted = 0;
    foreach ($orphans as $rel) {
        $src = $site . '/' . $rel;
        archiveFile($priv, $rel, (string)file_get_contents($src), $lot);
        if (@unlink($src)) { $deleted++; emit($linesOut, "  archive+supprime: {$rel}"); }
    }
    // dossiers devenus vides (hors dossiers utilises)
    $usedDirs = [];
    foreach ($manifest as $m) { $d = dirname($m); while ($d && $d !== '.') { $usedDirs[$d] = true; $d = dirname($d); } }
    $dirs = array_filter(glob($site . '/*', GLOB_ONLYDIR) ?: [], fn($d) => basename($d) !== 'tasks');
    foreach ($dirs as $d) {
        if (isset($usedDirs[basename($d)])) { continue; }
        if (!(scandir($d, SCANDIR_SORT_NONE) ?: []) || count(scandir($d)) <= 2) { @rmdir($d); emit($linesOut, '  dossier vide supprime: ' . basename($d)); }
    }
    emit($linesOut, "prune: {$deleted} fichier(s) archive(s)+supprime(s) (lot {$lot})");
    retention($priv, $keep);
    return 0;
}

// ------------------------------------------------------------------- github
function githubCommit(array &$linesOut, string $token, string $repo, string $branch, string $path, string $content): bool {
    $api = "https://api.github.com/repos/{$repo}/contents/{$path}";
    $hdr = ['Accept: application/vnd.github+json', 'Authorization: Bearer ' . $token, 'User-Agent: space-program-task/1.0'];
    $ch = curl_init($api . '?ref=' . urlencode($branch));
    curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER => true, CURLOPT_HTTPHEADER => $hdr, CURLOPT_TIMEOUT => 45]);
    $cur = curl_exec($ch); $code = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE); curl_close($ch);
    $sha = null;
    if ($code === 200) { $sha = json_decode((string)$cur, true)['sha'] ?? null; }
    $payload = ['message' => 'chore(data): refresh serveur ' . gmdate('Y-m-d H:i'), 'content' => base64_encode($content), 'branch' => $branch];
    if ($sha) { $payload['sha'] = $sha; }
    $ch = curl_init($api);
    curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER => true, CURLOPT_CUSTOMREQUEST => 'PUT',
        CURLOPT_HTTPHEADER => array_merge($hdr, ['Content-Type: application/json']),
        CURLOPT_POSTFIELDS => json_encode($payload), CURLOPT_TIMEOUT => 60]);
    $res = curl_exec($ch); $code = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE); curl_close($ch);
    if ($code >= 200 && $code < 300) { emit($linesOut, 'github: donnees publiees'); return true; }
    emit($linesOut, "github: ECHEC publication (HTTP {$code})");
    return false;
}

// --------------------------------------------------------------------- main
$status = 0;
emit($lines, 'Space Program task | mode=' . $mode . ' | ' . gmdate('c'));
switch ($mode) {
    case 'status':
        $files = remoteFiles($SITE);
        $gen = null;
        if (is_file($DATA)) {
            $d = json_decode((string)file_get_contents($DATA), true);
            $gen = $d['generated_at'] ?? null;
            $n = isset($d['launchers']) ? count($d['launchers']) : 0;
            $v = isset($d['launchers']) ? array_sum(array_column($d['launchers'], 'collected')) : 0;
            emit($lines, "donnees: {$n} lanceurs / {$v} vols | genere {$gen}");
        }
        emit($lines, 'fichiers servis: ' . count($files) . ' | manifeste: ' . (is_file($PRIV . '/manifest.json') ? 'present' : 'ABSENT'));
        emit($lines, 'github: ' . ($GITHUB ? 'configure' : 'non configure'));
        break;

    case 'dry-run':
        emit($lines, '--- refresh (simulation) ---');
        refresh($lines, $PRIV, $DATA, $SITE, (int)($cfgFile['ll2_limit'] ?? 50), true);
        emit($lines, '--- prune (simulation) ---');
        prune($lines, $PRIV, $SITE, true, $KEEP);
        break;

    case 'prune-dry':   // simulation d'elagage seule (test rapide, sans reseau)
        $status = prune($lines, $PRIV, $SITE, true, $KEEP);
        break;

    case 'refresh-dry': // simulation de rafraichissement seule (sans ecriture)
        $status = refresh($lines, $PRIV, $DATA, $SITE, (int)($cfgFile['ll2_limit'] ?? 50), true);
        break;

    case 'refresh':
        $status = refresh($lines, $PRIV, $DATA, $SITE, (int)($cfgFile['ll2_limit'] ?? 50), false);
        break;

    case 'prune':
        $status = prune($lines, $PRIV, $SITE, false, $KEEP);
        break;

    case 'cron':
        emit($lines, '--- 1/3 refresh ---');
        $r = refresh($lines, $PRIV, $DATA, $SITE, (int)($cfgFile['ll2_limit'] ?? 50), false);
        $committed = false;
        if ($GITHUB && $REPO) {
            emit($lines, '--- 2/3 commit GitHub ---');
            $content = is_file($DATA) ? (string)file_get_contents($DATA) : '';
            $committed = $content !== '' && githubCommit($lines, $GITHUB, $REPO, $BRANCH, 'data/completed-by-launcher.json', $content);
        } else {
            emit($lines, '--- 2/3 commit GitHub: ignore (pas de token) ---');
        }
        if ($REQ_COMMIT && !$committed) {
            emit($lines, '--- 3/3 prune ANNEELE: commit GitHub requis avant suppression ---');
            $status = $r === 0 ? 1 : $r;
            break;
        }
        emit($lines, '--- 3/3 prune ---');
        $p = prune($lines, $PRIV, $SITE, false, $KEEP);
        $status = max($r, $p);
        break;

    default:
        http_response_code(400);
        emit($lines, 'mode inconnu');
        $status = 2;
}

foreach ($lines as $l) { logLine($PRIV, $l); }
echo implode("\n", $lines) . "\n";
exit($status);
