# Changelog

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
