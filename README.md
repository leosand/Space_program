# 🚀 Space Program — Telemetrie et analyses de lancements

[![Site en ligne](https://img.shields.io/badge/Telemetrie-Active-06b6d4?style=flat-square&logo=spacex&logoColor=white)](https://leosand.github.io/Space_program/)
[![Licence MIT](https://img.shields.io/badge/Licence-MIT-blue.svg?style=flat-square)](LICENSE)
[![Accessibilite WCAG 2.1 AA](https://img.shields.io/badge/Accessibilite-WCAG%202.1%20AA-emerald?style=flat-square)](https://www.w3.org/WAI/WCAG21/quickref/)
[![Donnees LL2](https://img.shields.io/badge/Donnees-Launch%20Library%202-purple?style=flat-square)](https://thespacedevs.com/llapi)

> Plateforme open source de telemetrie spatiale : manifeste orbital, statistiques de lancements, comparaison de lanceurs et veille d'actualite spatiale fondes sur des donnees publiques.

**Demo :** [leosand.github.io/Space_program](https://leosand.github.io/Space_program/)

## Sommaire

- [Apercu](#apercu)
- [Fonctionnalites](#fonctionnalites)
- [Architecture](#architecture)
- [Structure du depot](#structure-du-depot)
- [Demarrage local](#demarrage-local)
- [Sources de donnees](#sources-de-donnees)
- [Contribution](#contribution)
- [Securite et confidentialite](#securite-et-confidentialite)
- [Feuille de route](#feuille-de-route)
- [Licence](#licence)

## Apercu

Space Program est un site statique deploye sur GitHub Pages. Il rend accessibles des donnees spatiales ouvertes sans compte utilisateur, sans pisteur publicitaire et sans base de donnees applicative.

Le projet s'adresse aux passionnes d'espace, aux journalistes, aux chercheurs et aux developpeurs qui souhaitent suivre les missions orbitales, analyser les cadences de lancement ou reutiliser une architecture frontend legere.

## Fonctionnalites

| Page | URL | Role |
|---|---|---|
| Tableau de bord | `/` | Indicateurs de telemetrie et apercu des missions |
| Lancements | `/launches.html` | Manifeste, recherche, filtres par fournisseur et export CSV |
| Detail d'un lancement | `/launch.html?id=<id>` | Informations de mission, compte a rebours, partage et favori |
| Statistiques | `/statistics.html` | Cadence annuelle et distribution par fournisseur |
| Comparaison | `/compare.html` | Radar et tableau de specifications de lanceurs |
| Actualites | `/news.html` | Flux SNAPI, RSS publics et NASA APOD |
| Favoris | `/bookmarks.html` | Lancements sauvegardes localement dans le navigateur |
| Contact | `/contact.html` | Attribution, contact et signalement de problemes |

### Interactions utilisateur

- **Favoris locaux :** les identifiants de lancement sont conserves dans `localStorage`.
- **Export CSV :** les donnees du manifeste actif peuvent etre exportees pour analyse.
- **Notifications navigateur :** l'autorisation est toujours demandee par action explicite.
- **Partage :** les pages de lancement fournissent un lien direct reproductible.
- **Accessibilite :** navigation au clavier, libelles ARIA, contraste renforce et prise en charge de `prefers-reduced-motion`.

## Architecture

### Stack

| Couche | Technologie |
|---|---|
| Interface | HTML5 semantique, CSS3 et JavaScript ES2021 sans framework |
| Visualisation | Chart.js 4.4.1 charge depuis CDN |
| Donnees | Launch Library 2, Spaceflight News API v4, NASA APOD et flux RSS publics |
| Hebergement | GitHub Pages |
| Automatisation | GitHub Actions, HTMLHint et ESLint |

### Flux de donnees

```text
Navigateur
  ├─ Pages HTML (tableau de bord, manifeste, actualites, comparaison)
  ├─ js/api.js : appels HTTP, cache memoire de 5 minutes, delai maximal de 8 secondes
  ├─ js/app.js : rendu DOM securise et interactions partagees
  └─ APIs publiques
       ├─ Launch Library 2 : lancements a venir et passes
       ├─ Spaceflight News API : articles spatiaux
       ├─ NASA APOD : image astronomique du jour
       └─ RSS publics : NASA, ESA et medias spatiaux

En cas d'echec reseau, les pages de lancements utilisent des donnees d'archive expressement identifiees.
```

### Principes de conception

1. **Securite d'abord :** donnees externes rendues avec `document.createElement` et `textContent`; validation des liens `http` et `https`.
2. **Resilience :** cache memoire, delais d'expiration et jeux de donnees de secours pour les vues de lancement.
3. **Performance :** site statique, images en chargement differe et dependances limitees.
4. **Accessibilite :** HTML semantique, etats ARIA, navigation au clavier et reduction de mouvement.
5. **Confidentialite :** aucun compte, cookie marketing ou outil d'analytique tiers.

## Structure du depot

```text
Space_program/
├── index.html              # Tableau de bord
├── launches.html           # Manifeste orbital : sections par provider, filtres et export CSV
├── launch.html             # Vue detaillee d'une mission
├── statistics.html         # Indicateurs et graphiques
├── compare.html            # Comparateur de lanceurs
├── news.html               # Veille spatiale et APOD
├── bookmarks.html          # Favoris locaux
├── contact.html            # Attribution et contact
├── privacy.html            # Politique de confidentialite
├── terms.html              # Conditions d'utilisation
├── css/
│   └── styles.css          # Design system et styles responsives
├── js/
│   ├── api.js              # Sources, cache, appels reseau et donnees de secours
│   ├── app.js              # Renderers DOM, menu et etat de telemetrie
│   ├── bookmarks.js        # Persistance des favoris dans localStorage
│   ├── export.js           # Generation CSV cote client
│   ├── notifications.js    # Notifications navigateur
│   └── toast.js            # Messages non bloquants
├── docs/
│   └── DEPLOYMENT.md      # Deploiement FTP afroconstellation.com (cache, V&V)
├── .github/workflows/ci.yml # Verifications CI
├── CONTRIBUTING.md
├── SECURITY.md
├── CHANGELOG.md
└── LICENSE
```

## Demarrage local

### Prerequis

- Un navigateur recent : Chrome 90+, Firefox 88+ ou Safari 14+
- Python 3 ou Node.js (facultatif, recommande pour un serveur local)

### Installation

```bash
git clone https://github.com/leosand/Space_program.git
cd Space_program

# Avec Python
python3 -m http.server 8080

# Ou avec Node.js
npx serve .
```

Ouvrez ensuite [http://localhost:8080](http://localhost:8080).

### Verifications locales

```bash
# Verification HTML
npx htmlhint *.html

# Verification JavaScript (configuration temporaire CI)
npx eslint js/*.js --no-eslintrc --env browser,es2021 --rule 'no-undef: off'
```

## Sources de donnees

| Source | Usage | Documentation |
|---|---|---|
| Launch Library 2 | Lancements a venir et passes | [TheSpaceDevs LL2](https://thespacedevs.com/llapi) |
| Spaceflight News API v4 | Articles et actualites spatiales | [SNAPI](https://spaceflightnewsapi.net/) |
| NASA APOD | Image astronomique du jour | [NASA APIs](https://api.nasa.gov/) |
| Flux RSS publics | Complement de veille | NASA, ESA et medias spatiaux |

Les APIs sont appelees directement depuis le navigateur. Leur disponibilite, leurs limites de debit et leur politique CORS peuvent donc influencer le rendu. Le site indique les donnees de secours lorsqu'elles sont utilisees.

## Contribution

Les contributions sont les bienvenues. Consultez [CONTRIBUTING.md](CONTRIBUTING.md) pour le processus detaille.

### Regles essentielles

1. Creez une branche descriptive : `feat/`, `fix/` ou `docs/`.
2. Ne transmettez jamais de secret, cle d'API privee ou donnee personnelle dans le depot.
3. N'introduisez pas de rendu de contenu externe avec `innerHTML`.
4. Verifiez la navigation clavier, le rendu mobile et les etats d'erreur avant une pull request.
5. Executez les verifications HTML et JavaScript indiquees ci-dessus.

## Securite et confidentialite

- Les donnees de tiers sont rendues avec des API DOM sures lorsque le contenu est externe.
- Les liens issus des flux sont limites aux schemas `http` et `https`.
- Les favoris sont stockes localement dans le navigateur et ne sont jamais envoyes au projet.
- Le site ne comporte aucun outil publicitaire, cookie de suivi ou compte utilisateur.

Pour signaler une vulnerabilite, consultez [SECURITY.md](SECURITY.md). Pour le detail des pratiques de donnees, consultez [privacy.html](privacy.html).

## Deploiement

Le site est deploye sur https://afroconstellation.com (Hostinger, FTP). La
procedure complete (jeu de fichiers, .htaccess, cache-bust `?v=`, V&V post-
deploiement, notes sur le quota de l'API Launch Library 2) est documentee dans
[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md). Les metas canonical / OpenGraph /
JSON-LD ciblent ce domaine de production.

## Feuille de route

### En cours ou prioritaire

- [ ] Mettre en place des tests automatises de rendu et des tests E2E Playwright
- [ ] Ajouter Lighthouse CI et des budgets de performance
- [ ] Ajouter un manifest PWA et une strategie hors ligne documentee
- [ ] Ajouter les traductions FR-CA et EN avec contenu localise

### Evolutions envisagees

- [ ] Passer a TypeScript strict et ajouter une validation de schema pour les reponses API
- [ ] Migrer vers Next.js avec rendu statique ou ISR si les besoins de contenu l'exigent
- [ ] Ajouter un proxy API cote serveur uniquement si les limites CORS ou les cles de service le justifient

## Licence

Ce projet est distribue sous [licence MIT](LICENSE).

## Contact

- Mainteneur : [Leonel Sandjong](https://github.com/leosand)
- Problemes et demandes : [GitHub Issues](https://github.com/leosand/Space_program/issues)

---

Construit avec des donnees ouvertes pour rendre l'exploration spatiale plus lisible. 🚀
