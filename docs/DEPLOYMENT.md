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

## Archive / rollback

L'ancien contenu d'afroconstellation.com (SPA React + API PHP) est archive dans le
repo prive `leosand/afro-constellation` (source de verite, deploiement prod v0.0.30/v0.0.31
du 2026-08-09). Rollback : rebuild local puis re-upload FTP depuis ce repo.
