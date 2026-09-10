# Changelog

## [v0.3.0] - 2026-09-10

### Added
- launches.html : onglet **Completed** groupe par **lanceur** (derniers vols connus de chaque lanceur, liste compacte defilante, compteur `N derniers · M vols connus`), alimente par un jeu de donnees statique ; repli automatique sur l'API si le fichier est absent
- tools/collect_completed.py : collecte **hors-ligne** des derniers vols par lanceur (throttlee, reprenable, attente adaptative sur HTTP 429 LL2) ; ecrit data/completed-by-launcher.json (checkpoint apres chaque lanceur)
- data/ : jeu de donnees versionne (100 derniers vols par lanceur)

### Changed
- docs/DEPLOYMENT.md : section « Donnees par lanceur » (rafraichissement + upload de data/)

## [v0.2.2] - 2026-09-10

### Fixed
- launches.html : le loader « Syncing orbital telemetry… » restait affiche au-dessus des sections (le conteneur n'etait pas vide a chaque rendu)
- Cache navigateur/CDN : les assets etaient encore servis en ancienne version (max-age long pose avant l'introduction du cache-bust) -> bump global `?v=3` et HTML non cacheable cote serveur

### Changed
- compare.html : selects de vehicules en pleine largeur (champs de formulaire propres, theme sombre)
- docs/DEPLOYMENT.md : .htaccess HTML `access plus 0 seconds` + note purge hcdn

## [v0.2.1] - 2026-09-09

### Fixed
- news.html : les boutons de filtres par source (SNAPI v4, NASA/JPL, ESA, SpaceX, RSS, All) repondent des l'arrivee sur la page ; les handlers etaient attaches seulement apres le chargement des flux externes (boutons inertes plusieurs secondes, jamais cables si un flux trainait)
- news.html : garde sur le bouton « load more » absent

## [v0.2.0] - 2026-09-09

### Added
- launches.html : onglet Upcoming organise en sections par provider (les 10 prochains vols connus de chaque provider, compteur `next N · X scheduled`)
- Filtres provider alignes sur les noms reels de l'API (alias CASC, ULA)
- Resilience donnees (js/api.js) : cache localStorage inter-pages (10 min), buckets canoniques `upcoming_all`/`past_all`, appels LL2 sequentiels + 1 retry sur 429, garde-fou anti-saturation (4 min), plus de fausses entrees quand l'API repond vide
- docs/DEPLOYMENT.md : procedure de deploiement vers afroconstellation.com (FTP Hostinger, .htaccess, cache-bust `?v=`)

### Changed
- Metas canonical / OpenGraph / JSON-LD des pages vers https://afroconstellation.com (domaine de production)
- Logo : retrait de la mention de version `v0.1` (chip `LIVE`)
- Contact : `contact@example.com` retire de privacy.html / terms.html, remplace par le lien vers le depot
- Style des `select` natifs (theme sombre via `color-scheme: dark`)
- `.htaccess` de deploiement : cache css/js 10 min, html 5 min (non versionne, voir docs/DEPLOYMENT.md)

### Fixed
- compare.html : tableau de specifications et radar inoperants (parenthese manquante dans `forEach`)
- statistics.html : stat-cards sans fond/bordure (classe `card` manquante)
- js/toast.js : SyntaxError (accolade superflue)
- js/app.js : classes de badge `.danger`/`.warning` inconnues du CSS, `.card-header`/`.card-title`/`.text-muted` absents du CSS, menu telemetrie ciblait `#telemetry-status` (span de texte) au lieu de `#live-dot` (texte du bandeau affiche casse), gardes `window.Bookmarks`
- index.html : ReferenceError `Bookmarks is not defined` sur la page d'accueil
- `.pulse-dot.offline` ajoute au CSS

## [v0.1.0] - 2026-09-01
