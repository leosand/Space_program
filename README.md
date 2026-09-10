# 🚀 Space Program — Launch telemetry and analytics

[![Site online](https://img.shields.io/badge/Telemetry-Active-06b6d4?style=flat-square&logo=spacex&logoColor=white)](https://leosand.github.io/Space_program/)
[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![WCAG 2.1 AA accessibility](https://img.shields.io/badge/Accessibility-WCAG%202.1%20AA-emerald?style=flat-square)](https://www.w3.org/WAI/WCAG21/quickref/)
[![LL2 data](https://img.shields.io/badge/Data-Launch%20Library%202-purple?style=flat-square)](https://thespacedevs.com/llapi)

> Open-source space telemetry platform: orbital manifest, launch statistics, launcher comparison and space news monitoring built on public data.

**Demo:** [leosand.github.io/Space_program](https://leosand.github.io/Space_program/)

## Table of contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Repository structure](#repository-structure)
- [Local setup](#local-setup)
- [Data sources](#data-sources)
- [Contributing](#contributing)
- [Security and privacy](#security-and-privacy)
- [Roadmap](#roadmap)
- [License](#license)

## Overview

Space Program is a static site deployed on GitHub Pages. It makes open space data accessible with no user account, no advertising tracker and no application database.

The project is aimed at space enthusiasts, journalists, researchers and developers who want to follow orbital missions, analyze launch cadence or reuse a lightweight frontend architecture.

## Features

| Page | URL | Role |
|---|---|---|
| Dashboard | `/` | Telemetry indicators and mission overview |
| Launches | `/launches.html` | Manifest, search, provider filters and CSV export |
| Launch detail | `/launch.html?id=<id>` | Mission information, countdown, sharing and bookmark |
| Statistics | `/statistics.html` | Annual cadence and distribution by provider |
| Comparison | `/compare.html` | Radar and specification table for launchers |
| News | `/news.html` | SNAPI feed, public RSS and NASA APOD |
| Bookmarks | `/bookmarks.html` | Launches saved locally in the browser |
| Contact | `/contact.html` | Attribution, contact and issue reporting |

### User interactions

- **Local bookmarks:** launch identifiers are kept in `localStorage`.
- **CSV export:** the data of the active manifest can be exported for analysis.
- **Browser notifications:** permission is always requested through an explicit action.
- **Sharing:** launch pages provide a reproducible direct link.
- **Accessibility:** keyboard navigation, ARIA labels, enhanced contrast and `prefers-reduced-motion` support.

## Architecture

### Stack

| Layer | Technology |
|---|---|
| Interface | Semantic HTML5, CSS3 and ES2021 JavaScript without a framework |
| Visualization | Chart.js 4.4.1 loaded from CDN |
| Data | Launch Library 2, Spaceflight News API v4, NASA APOD and public RSS feeds |
| Hosting | GitHub Pages |
| Automation | GitHub Actions, HTMLHint and ESLint |

### Data flow

```text
Browser
  ├─ HTML pages (dashboard, manifest, news, comparison)
  ├─ js/api.js: HTTP calls, 5-minute in-memory cache, 8-second timeout
  ├─ js/app.js: safe DOM rendering and shared interactions
  └─ Public APIs
       ├─ Launch Library 2: upcoming and past launches
       ├─ Spaceflight News API: space articles
       ├─ NASA APOD: astronomy picture of the day
       └─ Public RSS: NASA, ESA and space media

On network failure, launch pages fall back to archive data that is explicitly labelled.
```

### Design principles

1. **Security first:** external data rendered with `document.createElement` and `textContent`; `http` and `https` link validation.
2. **Resilience:** in-memory cache, timeouts and fallback datasets for the launch views.
3. **Performance:** static site, lazy-loaded images and limited dependencies.
4. **Accessibility:** semantic HTML, ARIA states, keyboard navigation and reduced motion.
5. **Privacy:** no account, no marketing cookie and no third-party analytics tool.

## Repository structure

```text
Space_program/
├── index.html              # Dashboard
├── launches.html           # Orbital manifest: sections by provider, filters and CSV export
├── launch.html             # Detailed mission view
├── statistics.html         # Indicators and charts
├── compare.html            # Launcher comparator
├── news.html               # Space monitoring and APOD
├── bookmarks.html          # Local bookmarks
├── contact.html            # Attribution and contact
├── privacy.html            # Privacy policy
├── terms.html              # Terms of use
├── css/
│   └── styles.css          # Design system and responsive styles
├── js/
│   ├── api.js              # Sources, cache, network calls and fallback data
│   ├── app.js              # DOM renderers, menu and telemetry state
│   ├── bookmarks.js        # Bookmark persistence in localStorage
│   ├── export.js           # Client-side CSV generation
│   ├── notifications.js    # Browser notifications
│   └── toast.js            # Non-blocking messages
├── docs/
│   └── DEPLOYMENT.md      # FTP deployment to afroconstellation.com (cache, verification)
├── .github/workflows/ci.yml # CI checks
├── CONTRIBUTING.md
├── SECURITY.md
├── CHANGELOG.md
└── LICENSE
```

## Local setup

### Prerequisites

- A recent browser: Chrome 90+, Firefox 88+ or Safari 14+
- Python 3 or Node.js (optional, recommended for a local server)

### Installation

```bash
git clone https://github.com/leosand/Space_program.git
cd Space_program

# With Python
python3 -m http.server 8080

# Or with Node.js
npx serve .
```

Then open [http://localhost:8080](http://localhost:8080).

### Local checks

```bash
# HTML check
npx htmlhint *.html

# JavaScript check (temporary CI configuration)
npx eslint js/*.js --no-eslintrc --env browser,es2021 --rule 'no-undef: off'
```

## Data sources

| Source | Usage | Documentation |
|---|---|---|
| Launch Library 2 | Upcoming and past launches | [TheSpaceDevs LL2](https://thespacedevs.com/llapi) |
| Spaceflight News API v4 | Space articles and news | [SNAPI](https://spaceflightnewsapi.net/) |
| NASA APOD | Astronomy picture of the day | [NASA APIs](https://api.nasa.gov/) |
| Public RSS feeds | Monitoring supplement | NASA, ESA and space media |

The APIs are called directly from the browser. Their availability, rate limits and CORS policy can therefore affect rendering. The site indicates when fallback data is used.

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for the detailed process.

### Key rules

1. Create a descriptive branch: `feat/`, `fix/` or `docs/`.
2. Never commit a secret, private API key or personal data to the repository.
3. Do not introduce rendering of external content with `innerHTML`.
4. Check keyboard navigation, mobile rendering and error states before a pull request.
5. Run the HTML and JavaScript checks listed above.

## Security and privacy

- Third-party data is rendered with safe DOM APIs when the content is external.
- Links from feeds are restricted to the `http` and `https` schemes.
- Bookmarks are stored locally in the browser and are never sent to the project.
- The site has no advertising tool, tracking cookie or user account.

To report a vulnerability, see [SECURITY.md](SECURITY.md). For details of data practices, see [privacy.html](privacy.html).

## Deployment

The site is deployed at https://afroconstellation.com (Hostinger, FTP). The
complete procedure (file set, .htaccess, `?v=` cache-bust, post-deployment
verification, notes on the Launch Library 2 API quota) is documented in
[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md). The canonical / OpenGraph /
JSON-LD metas target this production domain.

## Roadmap

### In progress or prioritized

- [ ] Set up automated rendering tests and Playwright E2E tests
- [ ] Add Lighthouse CI and performance budgets
- [ ] Add a PWA manifest and a documented offline strategy
- [ ] Add FR-CA and EN translations with localized content

### Planned evolutions

- [ ] Move to strict TypeScript and add schema validation for API responses
- [ ] Migrate to Next.js with static rendering or ISR if content needs require it
- [ ] Add a server-side API proxy only if CORS limits or service keys justify it

## License

This project is distributed under the [MIT license](LICENSE).

## Contact

- Maintainer: [Leonel Sandjong](https://github.com/leosand)
- Issues and requests: [GitHub Issues](https://github.com/leosand/Space_program/issues)

---

Built with open data to make space exploration more legible. 🚀
