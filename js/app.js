/**
 * SPACE PROGRAM — Security, DOM Helpers & Clean Renderers
 * Zero innerHTML with unescaped remote content. Pure safe DOM manipulation.
 */

// ============================================
// ESCAPING & SAFE URL HELPERS
// ============================================

function escapeHTML(str) {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function sanitizeUrl(raw) {
    if (!raw) return null;
    const trimmed = String(raw).trim();
    if (/^https?:\/\//i.test(trimmed)) {
        return escapeHTML(trimmed);
    }
    return null;
}

// ============================================
// SAFE DOM RENDERERS
// ============================================

function renderLaunchCardSafe(launch) {
    const card = document.createElement('article');
    card.className = 'card launch-card';
    card.setAttribute('role', 'article');
    card.setAttribute('itemscope', '');
    card.setAttribute('itemtype', 'https://schema.org/Event');

    const statusClass = launch.status === 'Success' ? 'success' :
        (launch.status === 'Failure' ? 'failure' : 'upcoming');
    const launchDate = spaceAPI.formatDateTime(launch.net);

    // Stale archive indicator if fallback
    if (launch.isFallback) {
        const staleBanner = document.createElement('div');
        staleBanner.className = 'stale-banner';
        staleBanner.textContent = 'Archive telemetry · Live sync unavailable';
        card.appendChild(staleBanner);
    }

    // Header
    const header = document.createElement('div');
    header.className = 'launch-header';

    const title = document.createElement('h3');
    title.setAttribute('itemprop', 'name');
    title.textContent = launch.name || 'Unnamed Mission';

    const badge = document.createElement('span');
    badge.className = `card-badge ${statusClass}`;
    badge.textContent = launch.statusName || launch.status || 'TBD';

    header.appendChild(title);
    header.appendChild(badge);
    card.appendChild(header);

    // Info rows
    const info = document.createElement('div');
    info.className = 'launch-info';

    info.appendChild(createInfoRow('calendar', launchDate, 'startDate', true));
    info.appendChild(createInfoRow('provider', launch.provider || 'Unknown Provider', 'organizer'));
    info.appendChild(createInfoRow('rocket', launch.rocket || 'Launch Vehicle'));
    info.appendChild(createInfoRow('location', launch.location || 'Unknown Location', 'location'));

    card.appendChild(info);

    // Description / mission type
    const desc = document.createElement('div');
    desc.className = 'launch-description';

    const typeSpan = document.createElement('span');
    typeSpan.textContent = `${launch.missionType || 'Orbital'} · ${launch.pad || 'Pad'}`;
    desc.appendChild(typeSpan);

    card.appendChild(desc);
    return card;
}

function createInfoRow(type, text, itemprop, isTime) {
    const row = document.createElement('div');
    row.className = 'info-row';

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '15');
    svg.setAttribute('height', '15');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2');
    svg.setAttribute('aria-hidden', 'true');

    if (type === 'calendar') {
        svg.innerHTML = '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>';
    } else if (type === 'provider') {
        svg.innerHTML = '<path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16"/><path d="M1 21h22"/>';
    } else if (type === 'rocket') {
        svg.innerHTML = '<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>';
    } else {
        svg.innerHTML = '<circle cx="12" cy="10" r="3"/><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>';
    }

    row.appendChild(svg);

    const span = document.createElement(isTime ? 'time' : 'span');
    span.textContent = text;
    if (itemprop) span.setAttribute('itemprop', itemprop);
    row.appendChild(span);

    return row;
}

function renderNewsCardSafe(news) {
    const card = document.createElement('article');
    card.className = 'card news-card';
    card.setAttribute('role', 'article');
    card.setAttribute('itemscope', '');
    card.setAttribute('itemtype', 'https://schema.org/NewsArticle');

    const safeImg = sanitizeUrl(news.imageUrl);
    if (safeImg) {
        const img = document.createElement('img');
        img.className = 'card-image';
        img.loading = 'lazy';
        img.alt = '';
        img.src = safeImg;
        card.appendChild(img);
    }

    const content = document.createElement('div');
    content.className = 'card-content';

    const meta = document.createElement('div');
    meta.className = 'card-meta';

    const badge = document.createElement('span');
    badge.className = 'card-badge';
    badge.textContent = news.source || 'Space News';
    meta.appendChild(badge);

    const time = document.createElement('time');
    time.setAttribute('itemprop', 'datePublished');
    time.setAttribute('datetime', news.publishedAt || '');
    time.textContent = spaceAPI.getTimeAgo(news.publishedAt);
    meta.appendChild(time);
    content.appendChild(meta);

    const title = document.createElement('h3');
    title.setAttribute('itemprop', 'headline');
    title.textContent = news.title || 'Untitled';
    content.appendChild(title);

    if (news.summary) {
        const p = document.createElement('p');
        p.setAttribute('itemprop', 'description');
        p.textContent = news.summary;
        content.appendChild(p);
    }

    const safeUrl = sanitizeUrl(news.url);
    if (safeUrl) {
        const a = document.createElement('a');
        a.className = 'read-more';
        a.href = safeUrl;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.textContent = 'Read Full Dispatch →';
        content.appendChild(a);
    }

    card.appendChild(content);
    return card;
}

function renderVehicleCardSafe(vehicle) {
    const card = document.createElement('article');
    card.className = 'card';
    card.setAttribute('role', 'article');
    card.setAttribute('itemscope', '');
    card.setAttribute('itemtype', 'https://schema.org/Product');

    const statusClass = vehicle.status === 'Active' ? 'success' :
        (vehicle.status === 'Development' ? 'upcoming' : '');

    const header = document.createElement('div');
    header.className = 'launch-header';

    const title = document.createElement('h3');
    title.setAttribute('itemprop', 'name');
    title.textContent = vehicle.name;

    const badge = document.createElement('span');
    badge.className = `card-badge ${statusClass}`;
    badge.textContent = vehicle.status;

    header.appendChild(title);
    header.appendChild(badge);
    card.appendChild(header);

    const info = document.createElement('div');
    info.className = 'launch-info';
    info.appendChild(createInfoRow('provider', `${vehicle.provider} (${vehicle.country})`, 'manufacturer'));
    info.appendChild(createInfoRow('rocket', `${vehicle.successRate}% Success Rate · ${vehicle.totalLaunches} launches`));
    info.appendChild(createInfoRow('calendar', `${spaceAPI.formatCurrency(vehicle.costPerLaunch)} / flight`));
    card.appendChild(info);

    const desc = document.createElement('div');
    desc.className = 'launch-description';
    desc.textContent = `LEO: ${vehicle.payloadLEO ? vehicle.payloadLEO.toLocaleString() + ' kg' : 'N/A'} · H: ${vehicle.height}m · ${vehicle.reusable ? 'Reusable' : 'Expendable'}`;
    card.appendChild(desc);

    return card;
}

// Backward-compat wrappers returning outerHTML
function renderLaunchCard(l) { return renderLaunchCardSafe(l).outerHTML; }
function renderNewsCard(n) { return renderNewsCardSafe(n).outerHTML; }
function renderVehicleCard(v) { return renderVehicleCardSafe(v).outerHTML; }

// ============================================
// NAVIGATION & ACCESSIBILITY
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initNav();
});

function initNav() {
    const toggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.nav-menu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
        const isOpen = menu.classList.toggle('active');
        toggle.setAttribute('aria-expanded', String(isOpen));
    });
}
