# Deployment — afroconstellation.com (Hostinger, FTP)

Procedure utilisee le 2026-09-09 pour deployer ce depot sur le domaine
`afroconstellation.com` (hebergement partage Hostinger).

## Cible

- Domaine : `https://afroconstellation.com` (statique, aucun PHP requis)
- FTP : `<HOTE_FTP>` / compte `<COMPTE_HOSTINGER>` / racine `public_html`
- Identifiants : fichier de credentials du vault prive (hors repo, jamais committe ; regle 11 AGENTS.md)

## Jeu de fichiers deployes

Depuis la racine du depot `master` :

- les 10 pages : `index.html`, `launches.html`, `launch.html`, `statistics.html`,
  `compare.html`, `news.html`, `bookmarks.html`, `contact.html`, `privacy.html`, `terms.html`
- `css/styles.css`, `css/fonts.css`, `favicon.svg`, `fonts/*.woff2` (polices auto-hebergees)
- `tasks/refresh.php` (+ `tasks/private/manifest.json` regenere a chaque deploiement)
- `js/api.js`, `js/app.js`, `js/bookmarks.js`, `js/export.js`, `js/notifications.js`, `js/toast.js`, `js/vendor/chart.umd.min.js` (Chart.js auto-heberge)

Exclus : `.github/`, `.harness/`, `*.md`, `LICENSE`, `js/charts.js` (non reference
par les pages).

## Etapes

1. Upload binaire (FTP, mode `TYPE I`) de chaque fichier du jeu vers `public_html`
   (creer `css/` et `js/` si absents) ; verifier que `SIZE` distant == taille locale.
2. Uploader `.htaccess` (contenu ci-dessous) — il n'est **pas** versionne dans le depot.
3. **Cache-busting** : apres toute modification de `css/` ou `js/`, incrementer le
   parametre `?v=` sur les references dans les pages HTML (ex. `styles.css?v=3`,
   `js/api.js?v=3`). Sans cela, navigateurs et CDN Hostinger (hcdn) peuvent servir
   l'ancienne version jusqu'a expiration du cache css/js (10 min).
4. **Cache CDN (hcdn)** : apres un upload, l'edge hcdn peut encore servir
   l'ancienne copie pendant quelques minutes (en-tete `Age`). Purger en
   re-uploadant le fichier ou en attendant l'expiration ; le HTML est servi
   `max-age=0` pour limiter ce cas.
5. **Metas** : canonical / OpenGraph / JSON-LD pointent vers `https://afroconstellation.com`
   (decision du 2026-09-09, integree au source). `og-image.png` est absent du depot :
   ajouter ce fichier a la racine pour un partage social correct.
5. **V&V post-deploiement** :
   - `GET /` et chaque page -> 200 ;
   - `GET /css/styles.css?v=N` et `js/*.js?v=N` -> 200 ;
   - contenu du CSS servi contient les dernieres regles (grep) ;
   - chargement navigateur : 0 erreur console, sections provider presentes sur
     launches.html, aucun badge « Archive telemetry » quand l'API LL2 repond.

## Donnees live (quota API)

- Sources : Launch Library 2 (`ll.thespacedevs.com`), Spaceflight News API, NASA APOD,
  flux RSS (voir `js/api.js`).
- Le quota LL2 par IP est serre : requetes > 50 vols ou rafales paralleles -> HTTP 429.
  L'application charge donc par buckets canoniques, de maniere sequentielle, avec
  1 retry (2,5 s) et un garde-fou de 4 min ; le fallback affiche des badges
  « Archive telemetry » quand l'API est indisponible.
- V&V de fraicheur : attendre ~3 min sans appel LL2 puis verifier que les badges
  affichent les vrais statuts (« Go for Launch »...).

## .htaccess (contenu)

Le fichier inclut la redirection `301 /index.html -> /` (URL canonique unique) et le cache des polices (`font/woff2`, 1 mois).

```
# Space Program - static multi-page site (Hostinger shared)
<IfModule mod_expires.c>
ExpiresActive On
ExpiresByType text/css "access plus 10 minutes"
ExpiresByType application/javascript "access plus 10 minutes"
ExpiresByType text/html "access plus 0 seconds"
</IfModule>
```

## Cache (politique)

| Type | Cache | Regle |
|---|---|---|
| CSS / JS / polices / SVG | **1 an** | Tout changement d'asset **doit** incrementer `?v=` dans les pages (sinon les clients gardent l'ancienne version 1 an) |
| `fonts/*.woff2` | 1 an | Noms de fichiers haches par Google (immuables) |
| HTML | **0 s** (revalidation) | Le shell de page est toujours frais |
| `data/*.json` | **0 s** | Les donnees statiques sont revalidees |

## Fraicheur des donnees a venir (automatique)

`launches.html` resynchronise **automatiquement** les vols a venir : toutes les 10 min,
au retour sur l'onglet et au retour de connexion. L'etat est affiche sous la recherche
(`#sync-status`) : heure de synchro, prochain rafraichissement, nombre de vols charges,
et mention « donnees d'archive » si l'API LL2 est momentanement limitee (429).

Le jeu `data/completed-by-launcher.json` (onglet Completed) est **statique** : le
rafraichir periodiquement avec `tools/collect_completed.py` puis re-uploader.

## Donnees par lanceur (onglet Completed)

L'onglet Completed de `launches.html` affiche les derniers vols connus de chaque
lanceur depuis `data/completed-by-launcher.json` (statique, aucune requete API au
chargement — le quota LL2 interdit 100 vols/lanceur cote navigateur).

Rafraichir les donnees (hors-ligne, throttled, reprenable) :

```bash
python tools/collect_completed.py --top 20 --per-launcher 100   # checkpoints
```

Puis uploader le fichier produit vers `public_html/data/completed-by-launcher.json`
(le dossier `data/` doit exister sur le serveur). Le script reprend ou il s'est
arrete si on le relance (les lanceurs deja complets sont ignores).

## Archivage / suppression automatique du contenu obsolete

Le serveur ne doit contenir **que** le contenu courant du depot. `tools/prune_server.py`
compare le contenu distant au **manifeste** (fichiers deployables calcules depuis le
depot) et, pour tout fichier hors manifeste :

1. il l'**archive localement** (copie datee, hors depot) ;
2. il le **supprime** du serveur ;
3. il supprime les dossiers devenus vides (jamais ceux utilises par le manifeste).

Garde-fous : `.htaccess` protege, abandon si le manifeste parait incomplet
(< 10 fichiers) ou si plus de `--max-delete` fichiers seraient supprimes,
`--apply` obligatoire pour agir (simulation par defaut).

Chemins (jamais codes en dur dans le depot) :

```bash
export SPACE_PROGRAM_FTP_CREDS=/chemin/vers/credentials-ftp.txt   # vault prive
export SPACE_PROGRAM_ARCHIVE=/chemin/vers/archive                 # hors depot
python tools/prune_server.py                 # simulation
python tools/prune_server.py --apply --snapshot-data --keep 12
```

Retention : `--keep N` conserve les N derniers lots d'archives distantes et les N
derniers instantanes (`--snapshot-data` gz des jeux de donnees, dedupliques par hash).

**Automatisation** : tache planifiee Windows `SpaceProgram-Content-Prune-Weekly`
(harness, script `scripts/space-program-archive.ps1`) — hebdomadaire, met a jour un
clone de travail, execute le pruner puis journalise dans
`.harness/backups/space-program-data/archive-task.log`. Option `-RefreshData` pour
enchainer la collecte LL2 des donnees par lanceur.

## Tache serveur (rafraichissement + publication + menage)

Le rafraichissement et le menage tournent **sur le serveur** (PHP 8.3), pas sur un poste :

- `server/refresh.php` deploye en `tasks/refresh.php`, protege par un **token** (`?token=`) ;
  sans token -> 403. La configuration vit dans `tasks/private/config.php` (dossier
  `.htaccess` `Require all denied`, jamais dans le depot ; modele : `server/private/config.example.php`).
- Modes : `status` | `dry-run` | `prune-dry` | `refresh-dry` | `refresh` | `prune` | `cron`.
- `cron` execute dans cet ordre : **1) refresh LL2** -> **2) commit GitHub** (API Contents,
  PAT fine-grained) -> **3) archivage + suppression** des fichiers hors manifeste.
  Si `require_github_commit` est vrai et que la publication echoue, **le menage est annule**
  (on ne supprime jamais avant d'avoir publie).
- Le manifeste (`tasks/private/manifest.json`) est genere depuis le depot et **uploadé a
  chaque deploiement** : c'est lui qui definit ce qui doit rester en ligne.
- Journal : `tasks/private/log.txt` (rotation a 512 Ko), archives : `tasks/private/archive/`.

### Declenchement quotidien — etapes bornees (obligatoire en HTTP)

**Constat verifie (2026-09-11)** : l'hebergement est servi par **LiteSpeed** derriere un
edge qui **bloque les requetes HTTP longues** (reponse `307` sans que le PHP soit execute ;
`fastcgi_finish_request` et `exec` indisponibles : `?mode=diag`). Un mode monolithique
(`cron`) ne peut donc pas tourner en HTTP.

La tache est decoupee en **appels courts et reprenables** :

| Mode | Role | Duree |
|---|---|---|
| `reset` | (re)initialise le cycle (liste des lanceurs) | instantane |
| `step` | rafraichit **1 page LL2** (1 lanceur) ; etat sauvegarde dans `state.json` | ~1 s (ou `STEP WAIT n` sur 429) |
| `finish` | **commit GitHub** puis **archivage + suppression** des fichiers hors manifeste | quelques secondes |

Un orchestrateur (GitHub Actions `.github/workflows/daily-server-task.yml`, ou tout autre
planificateur) enchaine : `reset` -> `step` en boucle (en respectant `STEP WAIT`) -> `finish`.
Le **travail s'execute sur le serveur** ; l'orchestrateur ne fait que l'appeler.

Le mode `cron` (monolithique) reste disponible **uniquement en CLI** — p.ex. tache cron
hPanel : `php /home/<UTILISATEUR>/domains/afroconstellation.com/public_html/tasks/refresh.php --cron`
(la CLI n'a pas la limite HTTP).

## Archive / rollback

L'ancien contenu d'afroconstellation.com (SPA React + API PHP) est archive dans le
repo prive `leosand/afro-constellation` (source de verite, deploiement prod v0.0.30/v0.0.31
du 2026-08-09). Rollback : rebuild local puis re-upload FTP depuis ce repo.
