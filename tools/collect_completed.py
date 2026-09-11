#!/usr/bin/env python3
"""
Collecte hors-ligne des derniers lancements par lanceur (Launch Library 2).

Pourquoi hors-ligne : le quota LL2 par IP est tres serre (limit <= 50 par requete,
rafales -> HTTP 429). Le navigateur ne peut pas charger 100 vols par lanceur ;
ce script collecte une fois (throttle, reprenable) et ecrit un JSON statique
versionne dans le depot, consomme ensuite par launches.html sans appel API.

Usage :
    python tools/collect_completed.py [--top 20] [--per-launcher 100]
                                      [--discover-pages 5] [--delay 3] [--dry-run]

Sortie : data/completed-by-launcher.json (checkpoint apres chaque lanceur :
relancer le script reprend ou il s'est arrete).
"""

import argparse
import json
import os
import re
import sys
import time
import urllib.error
import urllib.request
from collections import Counter
from datetime import datetime, timezone

BASE = "https://ll.thespacedevs.com/2.2.0"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "data", "completed-by-launcher.json")
HEADERS = {"Accept": "application/json", "User-Agent": "space-program-collector/1.0"}

DELAY = [3.0]  # secondes entre deux requetes (politesse envers le quota LL2)


def get_json(url, retries=6):
    """GET JSON, attente adaptative sur 429 (respecte 'Expected available in N seconds')."""
    attempt = 0
    while True:
        attempt += 1
        try:
            req = urllib.request.Request(url, headers=HEADERS)
            with urllib.request.urlopen(req, timeout=45) as resp:
                data = json.load(resp)
            time.sleep(DELAY[0])
            return data
        except urllib.error.HTTPError as e:
            body = ""
            try:
                body = e.read().decode("utf-8", "replace")
            except Exception:
                pass
            if e.code == 429:
                m = re.search(r"available in (\d+) seconds", body)
                wait = min((int(m.group(1)) + 5) if m else 120, 900)
                print(f"    429 quota -> attente {wait}s", flush=True)
                time.sleep(wait)
                continue
            if 500 <= e.code < 600 and attempt <= retries:
                time.sleep(min(60, 5 * attempt))
                continue
            raise
        except Exception:
            if attempt <= retries:
                time.sleep(min(60, 5 * attempt))
                continue
            raise


def map_launch(l):
    rk = (l.get("rocket") or {}).get("configuration") or {}
    return {
        "id": l.get("id"),
        "name": l.get("name"),
        "net": l.get("net"),
        "status": (l.get("status") or {}).get("abbrev"),
        "statusName": (l.get("status") or {}).get("name"),
        "provider": (l.get("launch_service_provider") or {}).get("name"),
        "rocket": rk.get("full_name") or rk.get("name"),
        "mission": (l.get("mission") or {}).get("name"),
        "missionType": (l.get("mission") or {}).get("type"),
        "pad": (l.get("pad") or {}).get("name"),
        "location": ((l.get("pad") or {}).get("location") or {}).get("name"),
    }


def discover(pages):
    """Tally des lanceurs sur les N pages de lancements recents."""
    counts, meta = Counter(), {}
    for page in range(pages):
        url = f"{BASE}/launch/previous/?limit=100&offset={page * 100}&mode=detailed"
        data = get_json(url)
        results = data.get("results") or []
        if not results:
            break
        for l in results:
            rk = (l.get("rocket") or {}).get("configuration") or {}
            rid = rk.get("id")
            if rid is None:
                continue
            counts[rid] += 1
            if rid not in meta:
                meta[rid] = {
                    "id": rid,
                    "name": rk.get("name"),
                    "full_name": rk.get("full_name") or rk.get("name"),
                    "provider": (l.get("launch_service_provider") or {}).get("name"),
                }
        print(f"  decouverte page {page + 1}/{pages} : {len(results)} vols", flush=True)
    return counts, meta


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--top", type=int, default=20, help="nombre de lanceurs a collecter")
    ap.add_argument("--per-launcher", type=int, default=100)
    ap.add_argument("--discover-pages", type=int, default=5, help="pages de 100 vols pour classer les lanceurs")
    ap.add_argument("--delay", type=float, default=3.0, help="delai entre requetes (s)")
    ap.add_argument("--out", default=OUT)
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()
    DELAY[0] = args.delay

    state = {"generated_at": None, "source": "Launch Library 2", "sample": {}, "launchers": {}}
    if os.path.exists(args.out):
        with open(args.out, encoding="utf-8") as f:
            state = json.load(f)
        done = [k for k, v in state["launchers"].items() if v.get("complete")]
        print(f"reprise : {len(done)} lanceur(s) deja complets", flush=True)

    prev_launchers = json.dumps(state["launchers"], sort_keys=True, ensure_ascii=False)
    prev_generated = state.get("generated_at")

    print("decouverte des lanceurs (historique recent)...", flush=True)
    counts, meta = discover(args.discover_pages)
    ranked = sorted(counts.items(), key=lambda kv: -kv[1])[: args.top]
    launchers = [{**meta[rid], "recent_count": n} for rid, n in ranked]
    for l in launchers:
        print(f"  - {l['full_name']} (id {l['id']}, {l['recent_count']} vols recents, {l['provider']})", flush=True)
    if args.dry_run:
        return

    per = max(1, min(args.per_launcher, 100))
    os.makedirs(os.path.dirname(args.out), exist_ok=True)
    state["sample"] = {"pages": args.discover_pages, "launchers_ranked": [
        {"id": l["id"], "full_name": l["full_name"], "recent_count": l["recent_count"]} for l in launchers]}

    for l in launchers:
        cur = state["launchers"].get(l["full_name"])
        if cur and cur.get("complete"):
            print(f"= {l['full_name']} : deja collecte", flush=True)
            continue
        launches, offset, complete, available = [], 0, False, None
        while len(launches) < per:
            limit = min(50, per - len(launches))
            url = (f"{BASE}/launch/previous/?rocket__configuration__id={l['id']}"
                   f"&limit={limit}&offset={offset}&mode=detailed")
            data = get_json(url)
            available = data.get("count")
            results = data.get("results") or []
            launches.extend(map_launch(x) for x in results)
            offset += len(results)
            if len(results) < limit or (available is not None and offset >= available):
                complete = True
                break
            if len(launches) >= per:
                # on a les N derniers vols demandes (la collecte des 100 les plus
                # recents suffit ; le re-run ne doit pas les recollecter)
                complete = True
                break
        state["launchers"][l["full_name"]] = {
            **l, "available": available, "collected": len(launches),
            "complete": complete, "launches": launches,
        }
        state["generated_at"] = datetime.now(timezone.utc).isoformat(timespec="seconds")
        with open(args.out, "w", encoding="utf-8") as f:
            json.dump(state, f, ensure_ascii=False, indent=1)
        print(f"+ {l['full_name']} : {len(launches)} vols collectes (sur {available}) -> checkpoint", flush=True)

    # Si aucune donnee n'a change, on restaure l'horodatage precedent : le fichier
    # reste bit-identique -> le runner ne cree pas de commit quotidien inutile.
    if json.dumps(state["launchers"], sort_keys=True, ensure_ascii=False) == prev_launchers and prev_generated:
        state["generated_at"] = prev_generated
        with open(args.out, "w", encoding="utf-8") as f:
            json.dump(state, f, ensure_ascii=False, indent=1)
        print("donnees inchangees : horodatage conserve", flush=True)

    ok = sum(1 for v in state["launchers"].values() if v.get("complete"))
    print(f"termine : {ok}/{len(launchers)} lanceurs complets -> {args.out}", flush=True)


if __name__ == "__main__":
    sys.exit(main())
