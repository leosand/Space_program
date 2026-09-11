#!/usr/bin/env python3
"""
Archivage + suppression automatique du contenu obsolete du site (serveur Hostinger).

Principe : le serveur ne doit contenir QUE le contenu courant du depot.
- manifeste = jeu de fichiers deployables calcule depuis le depot (source unique)
- tout fichier distant hors manifeste est d'abord **archive localement** (copie
  datee dans un dossier prive), puis **supprime** du serveur
- le `.htaccess` est protege ; les dossiers utilises par le manifeste sont conserves
- retention : N derniers lots d'archive et N derniers instantanes de donnees

Les chemins locaux ne sont jamais codes en dur (regle projet : rien de prive dans
un depot public) ; ils passent par l'environnement ou les options :
    SPACE_PROGRAM_FTP_CREDS  fichier de credentials FTP (vault prive)
    SPACE_PROGRAM_ARCHIVE    dossier d'archivage local (hors depot)

Usage :
    python tools/prune_server.py                 # simulation (dry-run)
    python tools/prune_server.py --apply         # archive + supprime
    python tools/prune_server.py --apply --keep 8
"""

import argparse
import gzip
import hashlib
import os
import re
import shutil
import sys
from datetime import datetime, timezone

BASE_REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEFAULT_CREDS = os.environ.get("SPACE_PROGRAM_FTP_CREDS", "")
DEFAULT_ARCHIVE = os.environ.get(
    "SPACE_PROGRAM_ARCHIVE",
    os.path.join(os.path.expanduser("~"), ".space-program", "archive"),
)
ARCHIVE = None  # resolu depuis --archive / SPACE_PROGRAM_ARCHIVE

JS_FILES = ["api.js", "app.js", "bookmarks.js", "export.js", "notifications.js", "toast.js"]
PROTECTED = {".htaccess"}


def log(msg):
    line = f"{datetime.now(timezone.utc).isoformat(timespec='seconds')} {msg}"
    print(line, flush=True)
    if ARCHIVE:
        os.makedirs(ARCHIVE, exist_ok=True)
        with open(os.path.join(ARCHIVE, "prune.log"), "a", encoding="utf-8") as f:
            f.write(line + "\n")


def load_creds(path):
    creds = {}
    with open(path, encoding="utf-8", errors="replace") as f:
        for line in f:
            m = re.match(r"^\s*(HOST|USER|PORT|PASS|REMOTE_ROOT)\s*:\s*(.*)$", line.strip())
            if m:
                creds[m.group(1)] = m.group(2).strip()
    return creds


def manifest(repo):
    """Jeu de fichiers deployables (chemins relatifs, separateur '/')."""
    files = [f for f in sorted(os.listdir(repo)) if f.endswith(".html")]
    files += ["css/styles.css", "css/fonts.css", "favicon.svg"]
    files += ["js/" + f for f in JS_FILES]
    files += ["js/vendor/chart.umd.min.js"]
    for sub in ("fonts", "data"):
        d = os.path.join(repo, sub)
        if os.path.isdir(d):
            files += [f"{sub}/" + f for f in sorted(os.listdir(d))]
    return [f for f in files if os.path.exists(os.path.join(repo, f))]


def remote_files(ftp):
    out = []

    def walk(d=""):
        for name, facts in ftp.mlsd(d):
            if name in (".", ".."):
                continue
            p = f"{d}/{name}" if d else name
            if facts.get("type") == "dir":
                walk(p)
            else:
                out.append(p)

    walk()
    return out


def remote_dirs(ftp):
    out = []

    def walk(d=""):
        for name, facts in ftp.mlsd(d):
            if name in (".", ".."):
                continue
            p = f"{d}/{name}" if d else name
            if facts.get("type") == "dir":
                out.append(p)
                walk(p)

    walk()
    return out


def prune_local_archive(keep):
    if not os.path.isdir(ARCHIVE):
        return
    lots = sorted([d for d in os.listdir(ARCHIVE) if d.startswith("remote-")], reverse=True)
    for old in lots[keep:]:
        shutil.rmtree(os.path.join(ARCHIVE, old), ignore_errors=True)
        log(f"retention: lot local supprime {old}")


def snapshot_data(repo, keep):
    data = os.path.join(repo, "data")
    if not os.path.isdir(data):
        return
    snaps = os.path.join(ARCHIVE, "data-snapshots")
    os.makedirs(snaps, exist_ok=True)
    for f in sorted(os.listdir(data)):
        if not f.endswith(".json"):
            continue
        raw = open(os.path.join(data, f), "rb").read()
        h = hashlib.sha256(raw).hexdigest()[:12]
        target = os.path.join(snaps, f"{f}.{h}.gz")
        if os.path.exists(target):
            continue
        with gzip.open(target, "wb") as g:
            g.write(raw)
        log(f"snapshot donnees: {os.path.basename(target)} ({len(raw)} octets)")
    groups = {}
    for f in os.listdir(snaps):
        groups.setdefault(f.split(".json")[0], []).append(f)
    for _, items in groups.items():
        for old in sorted(items, reverse=True)[keep:]:
            os.remove(os.path.join(snaps, old))
            log(f"retention: instantane supprime {old}")


def main():
    global ARCHIVE
    ap = argparse.ArgumentParser()
    ap.add_argument("--apply", action="store_true", help="executer (sinon simulation)")
    ap.add_argument("--repo", default=BASE_REPO)
    ap.add_argument("--keep", type=int, default=12, help="lots d'archive conserves")
    ap.add_argument("--max-delete", type=int, default=40, help="garde-fou : nb max de fichiers supprimes")
    ap.add_argument("--snapshot-data", action="store_true", help="instantane gzip des donnees locales")
    ap.add_argument("--creds", default=DEFAULT_CREDS, help="credentials FTP (ou SPACE_PROGRAM_FTP_CREDS)")
    ap.add_argument("--archive", default=DEFAULT_ARCHIVE, help="dossier d'archivage (ou SPACE_PROGRAM_ARCHIVE)")
    args = ap.parse_args()
    ARCHIVE = args.archive

    if not args.creds or not os.path.exists(args.creds):
        log("ABANDON: credentials FTP introuvables (--creds ou SPACE_PROGRAM_FTP_CREDS)")
        return 2

    import ftplib

    man = manifest(args.repo)
    if len(man) < 10:
        log(f"ABANDON: manifeste suspicieusement petit ({len(man)} fichiers) — aucune suppression")
        return 2

    if args.snapshot_data:
        snapshot_data(args.repo, args.keep)

    creds = load_creds(args.creds)
    ftp = ftplib.FTP()
    ftp.connect(creds["HOST"], int(creds["PORT"]), timeout=90)
    ftp.login(creds["USER"], creds["PASS"])
    ftp.voidcmd("TYPE I")

    remotes = remote_files(ftp)
    man_set = set(man)
    orphans = [p for p in remotes if p not in man_set and p not in PROTECTED]
    log(f"scan: {len(remotes)} fichiers distants | manifeste {len(man)} | orphelins {len(orphans)}")

    if not orphans:
        log("aucun fichier obsolete : serveur deja propre")
        ftp.quit()
        prune_local_archive(args.keep)
        return 0

    if len(orphans) > args.max_delete:
        log(f"ABANDON: {len(orphans)} orphelins > garde-fou {args.max_delete} — verification manuelle requise")
        ftp.quit()
        return 3

    if not args.apply:
        for p in orphans:
            log(f"[simulation] a archiver+supprimer: {p}")
        ftp.quit()
        return 0

    lot = os.path.join(ARCHIVE, "remote-" + datetime.now(timezone.utc).strftime("%Y%m%d-%H%M%S"))
    os.makedirs(lot, exist_ok=True)
    deleted = 0
    for p in orphans:
        dest = os.path.join(lot, p.replace("/", os.sep))
        os.makedirs(os.path.dirname(dest), exist_ok=True)
        try:
            with open(dest, "wb") as fh:
                ftp.retrbinary("RETR " + p, fh.write)
            ftp.delete(p)
            deleted += 1
            log(f"archive+supprime: {p} -> {os.path.relpath(dest, ARCHIVE)}")
        except Exception as e:  # noqa: BLE001
            log(f"ECHEC sur {p}: {type(e).__name__}")

    used_dirs = {"/".join(m.split("/")[:-1]) for m in man if "/" in m}
    for d in sorted(remote_dirs(ftp), reverse=True):
        if d in used_dirs:
            continue
        try:
            if not [n for n, _ in ftp.mlsd(d) if n not in (".", "..")]:
                ftp.rmd(d)
                log(f"dossier vide supprime: {d}")
        except Exception:  # noqa: BLE001
            pass

    log(f"termine: {deleted} fichier(s) archive(s)+supprime(s), lot {os.path.basename(lot)}")
    ftp.quit()
    prune_local_archive(args.keep)
    return 0


if __name__ == "__main__":
    sys.exit(main())
