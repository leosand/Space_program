# 🚀 Space Program — Telemetry & Launch Analytics

A precision-engineered, minimal space launch telemetry platform aggregating orbital manifests, vehicle performance metrics, and space exploration dispatches worldwide.

[![Live Status](https://img.shields.io/badge/Telemetry-Active-06b6d4?style=flat-square&logo=spacex&logoColor=white)](https://leosand.github.io/Space_program/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![WCAG 2.1 AA](https://img.shields.io/badge/Accessibility-WCAG%202.1%20AA-emerald?style=flat-square)](https://www.w3.org/WAI/WCAG21/quickref/)
[![Data: LL2](https://img.shields.io/badge/Data-Launch%20Library%202-purple?style=flat-square)](https://thespacedevs.com/llapi)

---

## Architecture Overview

Space Program is built with a **telemetry-first, precision dark mode design system** inspired by HeroUI V3 and Swiss typography. It consumes free public space APIs directly with zero commercial tracking, strict XSS neutralization, and subresource integrity (SRI).

### Data Sources
- **Orbital Manifest**: [Launch Library 2](https://thespacedevs.com/llapi) (TheSpaceDevs) for live upcoming and past launches.
- **Space Dispatches**: [Spaceflight News API (SNAPI v4)](https://spaceflightnewsapi.net/) for breaking news and mission coverage.
- **Astronomy Imagery**: [NASA Open API](https://api.nasa.gov/) (APOD).
- **Vehicle Telemetry**: Curated technical specs (LEO/GTO payload, thrust, stages, reusability, flight heritage) across 20 primary orbital launchers.

---

## Repository Structure

```text
Space_program/
├── index.html          # Mission control dashboard & live telemetry status
├── launches.html       # Orbital manifest & searchable mission feed
├── compare.html        # Side-by-side vehicle radar & specifications comparison
├── statistics.html     # Annual flight cadence & provider market share charts
├── news.html           # Aggregated space industry dispatches
├── contact.html        # Community contact & data attribution
├── privacy.html        # Privacy policy (zero tracking)
├── terms.html          # Terms of service
├── css/
│   └── styles.css      # v3.0 precision design tokens, glassmorphism & WCAG AA
└── js/
    ├── api.js          # Telemetry caching layer & multi-source fetchers
    ├── app.js          # Safe DOM renderers (zero innerHTML injection)
    └── charts.js       # Chart.js radar, bar, and doughnut visualizers
```

---

## Security & Compliance Highlights

- **Zero Unescaped `innerHTML`**: All external feeds and API responses are rendered through native DOM nodes (`document.createElement`, `textContent`, `setAttribute`).
- **URL Sanitization**: Strict `https?://` allowlists on article links and images to prevent script execution vectors.
- **Archive Transparency**: Stale fallback telemetry is explicitly badged (`Archive telemetry · Live sync unavailable`) whenever remote rate limits or network failures occur.
- **Factual Schema.org**: JSON-LD semantic markup strictly reflects real platform entities with author attribution to [Léonel Sandjong](https://github.com/leosand).
- **WCAG 2.1 AA**: Minimum contrast ratios >= 5.2:1, native focus rings, and full `prefers-reduced-motion` suppression.

---

## Quickstart

Run locally with any static web server:

```bash
# Clone the repository
git clone https://github.com/leosand/Space_program.git
cd Space_program

# Serve via Python 3
python3 -m http.server 8080

# Or serve via Node.js
npx serve .
```

Navigate to `http://localhost:8080`.

---

## Roadmap

- [x] Neutralize XSS vectors and enforce safe DOM rendering.
- [x] Refactor UI to high-precision telemetry dark mode with HeroUI V3 glass aesthetics.
- [x] Subresource integrity (SRI) on Chart.js CDN assets.
- [ ] Next.js 15 App Router migration with Server-Side Incremental Static Regeneration (ISR 300s).
- [ ] TypeScript strict types & zod schema validation on LL2 payloads.
- [ ] Automated Lighthouse CI audit & Playwright end-to-end testing suite.

---

## License

Released under the [MIT License](LICENSE). Copyright &copy; 2026 Léonel Sandjong.
