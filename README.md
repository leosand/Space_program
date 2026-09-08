# 🚀 Space Program — Telemetry & Launch Analytics

[![Live Status](https://img.shields.io/badge/Telemetry-Active-06b6d4?style=flat-square&logo=spacex&logoColor=white)](https://leosand.github.io/Space_program/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![WCAG 2.1 AA](https://img.shields.io/badge/Accessibility-WCAG%202.1%20AA-emerald?style=flat-square)](https://www.w3.org/WAI/WCAG21/quickref/)
[![Data: LL2](https://img.shields.io/badge/Data-Launch%20Library%202-purple?style=flat-square)](https://thespacedevs.com/llapi)

> **Plateforme de tél métrie spatiale open-source** — Manifeste orbital en temps réel, analyses statistiques, comparaison de lanceurs, et veille stratégique sur l'industrie spatiale.

**🔗 Démo en ligne** : [https://leosand.github.io/Space_program/](https://leosand.github.io/Space_program/)

---

## 📑 Table des matières

1. [Vue d'ensemble](#-vue-densemble)
2. [Fonctionnalité·�](#-fonctionnalit-s)
3. [Architecture technique](#-architecture-technique)
4. [Structure du dépôt](#-structure-du-d-p-t)
5. [Installation locale](#-installation-locale)
6. [APIs et sources de données](#-apis-et-sources-de-donn-es)
7. [Guide de contribution](#-guide-de-contribution)
8. [S curité·§ et confidentialité·§](#-s-curit-et-confidentialit-)
9. [Roadmap](#-roadmap)
10. [Licence](#-licence)

---

## 🌍 Vue d'ensemble

**Space Program** est une plateforme web statique de référence pour la visualisation de données spatiales ouvertes. Conç·§ue avec une approche **security-first** et **accessibilité·§ WCAG 2.1 AA**, elle agrè·§ge des données provenant de multiples APIs publiques (LL2, SNAPI, NASA) sans aucun tracking utilisateur ni dépendance commerciale.

### Cas d'usage

- **Enthusiastes spatiaux** : Suivi des lancements en direct, comparaison de lanceurs
- **Journalistes & chercheurs** : Export CSV, analyses statistiques, veille stratégique
- **Dé·§veloppeurs** : Code open-source, architecture de référence, APIs documenté·§es

---

## ✨ Fonctionnalité·§s

### Pages principales

| Page | URL | Description |
|------|-----|-------------|
| **Dashboard** | `/` | Tél métrie en direct, KPIs, prochain lancement |
| **Launches** | `/launches.html` | Manifeste orbital avec filtres, recherche, export CSV |
| **Launch Details** | `/launch.html?id=xxx` | Fiche technique, countdown, favori, notification |
| **Statistics** | `/statistics.html` | Graphiques (cadence annuelle, répartition par fournisseur) |
| **Compare** | `/compare.html` | Radar de performance, tableau comparatif |
| **News** | `/news.html` | Dispatches multi-sources (SNAPI, RSS, NASA APOD) |
| **Bookmarks** | `/bookmarks.html` | Favoris utilisateur (localStorage) |
| **Contact** | `/contact.html` | Attribution, liens GitHub, signalement bugs |

### Fonctionnalité·§s interactives

- 🔖 **Favoris** : Sauvegarde locale des lancements suivis
- 📥 **Export CSV** : Téléchargement des manifests filtré·§s
- 🔔 **Notifications** : Alertes navigateur pour lancements
- 🔗 **Partage** : Copie de lien vers fiche de lancement
- ♿ **Accessibilité·§** : Navigation clavier, ARIA, contrastes AA

---

## 🏗 Architecture technique

### Stack technologique

```
Frontend : HTML5 s mantique + CSS3 (design tokens) + Vanilla JS ES2021
APIs     : Launch Library 2, Spaceflight News API v4, NASA Open API
Charts   : Chart.js 4.4.1 (SRI, crossorigin="anonymous")
Hé·§bergement : GitHub Pages (statique, CDN)
```

### Principes de conception

1. **Security-first** : Zé·§ro `innerHTML` non échappé·§, validation URLs `https?://`, renderers DOM natifs
2. **Performance** : Cache 5 min, timeout 8s, fallbacks archive, lazy-loading
3. **Accessibilité·§** : WCAG 2.1 AA, ARIA, `prefers-reduced-motion`, navigation clavier
4. **Zero tracking** : Aucune collecte de données personnelles, localStorage uniquement

### Diagramme de flux

```
┌─────────────────────────────────────────────────────────────┐
│                    Browser (Static Site)                    │
├─────────────────────────────────────────────────────────────┤
│  launches.html  │  statistics.html  │  compare.html         │
│       ↓         │         ↓         │         ↓             │
│  renderLaunchCardSafe()  │  spaceAPI.getLaunchStatistics() │
│       ↓         │         ↓         │         ↓             │
│  spaceAPI.getUpcomingLaunches() / getPastLaunches()        │
│       ↓         │         ↓         │         ↓             │
│  Launch Library 2 (LL2) API  │  Fallback curated data      │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Structure du dépôt

```
Space_program/
├── index.html              # Dashboard tél métrie
├── launches.html           # Manifeste orbital + filtres
├── launch.html             # Détails d'un lancement (id param)
├── statistics.html         # KPIs + graphiques Chart.js
├── compare.html            # Radar + tableau comparatif
├── news.html               # Dispatches multi-sources + APOD
├── bookmarks.html          # Favoris utilisateur
├── contact.html            # Attribution + liens
├── privacy.html / terms.html
├── css/
│   └── styles.css          # Design system v3.0 (glassmorphism)
├── js/
│   ├── api.js              # Fetchers + cache + fallbacks
│   ├── app.js              # Renderers DOM sécuritaires
│   ├── bookmarks.js        # Gestion favoris (localStorage)
│   ├── export.js           # Export CSV
│   ├── notifications.js    # Notifications navigateur
│   └── toast.js            # Toasts non-bloquants
├── .github/
│   └── workflows/
│       └── ci.yml          # CI HTML/JS lint
├── README.md               # Ce fichier
├── LICENSE                 # MIT License
├── CONTRIBUTING.md         # Guide de contribution
└── SECURITY.md             # Politique de sécurité
```

---

## 🛠 Installation locale

### Prérequis

- Navigateur moderne (Chrome 90+, Firefox 88+, Safari 14+)
- Serveur web statique optionnel (pour tests locaux)

### Démarrage rapide

```bash
# Cloner le dépôt
git clone https://github.com/leosand/Space_program.git
cd Space_program

# Option 1 : Ouvrir directement dans le navigateur
open index.html  # macOS
start index.html # Windows

# Option 2 : Servir avec Python
python3 -m http.server 8080
# Puis ouvrir http://localhost:8080

# Option 3 : Servir avec Node.js
npx serve .
```

### Tests

```bash
# Linting HTML
htmlhint *.html

# Linting JavaScript
npx eslint js/*.js --no-eslintrc --env browser,es2021
```

---

## 📡 APIs et sources de données

### APIs principales

| API | Fournisseur | Endpoint | Usage |
|-----|-------------|----------|-------|
| **Launch Library 2** | TheSpaceDevs | `https://ll.thespacedevs.com/2.2.0` | Lancements (upcoming/past) |
| **Spaceflight News API v4** | Spaceflight News | `https://api.spaceflightnewsapi.net/v4/articles` | Articles d'actualité·§ |
| **NASA Open API** | NASA | `https://api.nasa.gov/planetary/apod` | Astronomy Picture of the Day |

### Flux RSS agréé·§gé·§s

- NASA Breaking News
- ESA News
- Space.com
- Universe Today
- Spaceflight Now
- NASA JPL News

### Fallbacks

En cas d'indisponibilité·§ des APIs, des données curatoriales statiques sont utilisées avec un badge explicite **"Archive telemetry"**.

---

## 🤝 Guide de contribution

### Comment contribuer

1. **Fork** le dépôt
2. **Cré·§er une branche** (`git checkout -b feat/ma-fonctionnalité·§`)
3. **Coder** en suivant les standards (ESLint, HTMLHint)
4. **Tester** localement (navigation, accessibilité·§, performance)
5. **Push** et **Pull Request** vers `master`

### Standards de code

- **JavaScript** : ES2021, pas de `any`, fonctions pures, renderers DOM sécuritaires
- **HTML** : S mantique (main, section, article, nav), ARIA, contrastes AA
- **CSS** : Variables CSS, design tokens, glassmorphism
- **S curité·§** : Zé·§ro `innerHTML` non échappé·§, validation URLs, pas de secrets

### Issues et PRs

- Utiliser les **labels** : `bug`, `enhancement`, `documentation`, `good first issue`
- Décrire clairement le **problè·§me** et la **solution**
- Inclure des **captures d'é·§cran** si pertinent

---

## 🔒 Sécurité et confidentialité·§

### Mesures de sécurité

- ✅ **XSS** : Renderers DOM natifs (`createElement`, `textContent`)
- ✅ **URLs** : Validation stricte `https?://`
- ✅ **CORS** : APIs publiques avec fallbacks
- ✅ **LocalStorage** : Uniquement pour les favoris (pas de tracking)

### Confidentialité·§

- ❌ **Aucun cookie** de tracking
- ❌ **Aucune analytique** (Google Analytics, etc.)
- ❌ **Aucune collecte** de données personnelles
- ✅ **Transparent** : Code open-source, auditables

### Signaler une vulné·§rabilité·§

Voir [SECURITY.md](SECURITY.md) pour la procédure de divulgation responsable.

---

## 🗺 Roadmap

### v1.0 (actuelle) ✅

- [x] Manifeste orbital (LL2)
- [x] Statistiques et graphiques
- [x] Comparaison de lanceurs
- [x] Favoris et export CSV
- [x] Notifications navigateur
- [x] Accessibilité·§ WCAG 2.1 AA

### v1.1 (Q1 2027)

- [ ] PWA (service worker, offline mode)
- [ ] API proxy (contourner CORS)
- [ ] Webhooks de notifications
- [ ] Support multi-langues (FR-CA/EN)

### v2.0 (2027+)

- [ ] Migration Next.js 15 (ISR 300s)
- [ ] TypeScript strict + validation zod
- [ ] Backend léger (Supabase/PlanetScale)
- [ ] Analytics privacy-friendly (Countly)

---

## 📄 Licence

**MIT License** — Voir [LICENSE](LICENSE) pour les détails.

```text
Copyright © 2026 Léonel Sandjong

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 📬 Contact

- **Maintainer** : Léonel Sandjong ([@leosand](https://github.com/leosand))
- **Email** : [contact@example.com](mailto:contact@example.com)
- **Issues** : [GitHub Issues](https://github.com/leosand/Space_program/issues)

---

**🚀 Happy launching!**
