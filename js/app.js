/**
 * SPACE PROGRAM - Main Application Module
 * Safe DOM rendering, navigation, and UI controllers
 */

function sanitizeUrl(url) {
    if (!url || typeof url !== 'string') return null;
    const trimmed = url.trim();
    if (!/^https?:\/\//i.test(trimmed)) return null;
    return trimmed;
}

function renderNewsCardSafe(article) {
    const card = document.createElement('article');
    card.className = 'card';
    card.style.display = 'flex';
    card.style.flexDirection = 'column';
    card.style.height = '100%';

    if (article.imageUrl) {
        const safeImgUrl = sanitizeUrl(article.imageUrl);
        if (safeImgUrl) {
            const img = document.createElement('img');
            img.src = safeImgUrl;
            img.alt = article.title || 'News image';
            img.loading = 'lazy';
            img.style.width = '100%';
            img.style.height = '160px';
            img.style.objectFit = 'cover';
            img.style.borderRadius = 'var(--radius-md) var(--radius-md) 0 0';
            card.appendChild(img);
        }
    }

    const content = document.createElement('div');
    content.style.padding = '1.25rem';
    content.style.flex = '1';
    content.style.display = 'flex';
    content.style.flexDirection = 'column';

    const source = document.createElement('span');
    source.className = 'card-badge go';
    source.textContent = (article.source || 'Space Dispatch') + ' · ' + spaceAPI.getTimeAgo(article.publishedAt);
    source.style.marginBottom = '0.75rem';
    content.appendChild(source);

    const title = document.createElement('h3');
    title.style.fontSize = '1.05rem';
    title.style.marginBottom = '0.75rem';
    title.style.lineHeight = '1.4';
    title.textContent = article.title || 'Untitled Dispatch';
    content.appendChild(title);

    if (article.summary) {
        const summary = document.createElement('p');
        summary.style.fontSize = '0.85rem';
        summary.style.color = 'var(--text-muted)';
        summary.style.lineHeight = '1.6';
        summary.style.marginBottom = '1rem';
        summary.style.flex = '1';
        summary.textContent = article.summary.slice(0, 180) + '…';
        content.appendChild(summary);
    }

    const safeUrl = sanitizeUrl(article.url);
    if (safeUrl) {
        const link = document.createElement('a');
        link.className = 'read-more';
        link.href = safeUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = 'Read Full Dispatch →';
        content.appendChild(link);
    }

    card.appendChild(content);
    return card;
}

function renderLaunchCardSafe(launch) {
    const card = document.createElement('article');
    card.className = 'card';
    card.style.cursor = 'pointer';

    const statusClass = launch.status === 'Success' ? 'success' :
                        launch.status === 'Failure' ? 'danger' :
                        launch.status === 'Go' ? 'go' : 'warning';

    const header = document.createElement('div');
    header.className = 'card-header';

    const status = document.createElement('span');
    status.className = `card-badge ${statusClass}`;
    status.textContent = launch.isFallback ? 'Archive telemetry' : 'Live sync';
    header.appendChild(status);

    const time = document.createElement('span');
    time.className = 'text-muted';
    time.style.fontSize = '0.75rem';
    time.style.fontFamily = 'var(--font-mono)';
    time.textContent = spaceAPI.formatDateTime(launch.net);
    header.appendChild(time);

    card.appendChild(header);

    const title = document.createElement('h3');
    title.className = 'card-title';
    title.textContent = launch.name;
    card.appendChild(title);

    const provider = document.createElement('p');
    provider.className = 'text-muted';
    provider.style.fontSize = '0.88rem';
    provider.style.marginBottom = '0.5rem';
    provider.textContent = launch.provider;
    card.appendChild(provider);

    const rocket = document.createElement('p');
    rocket.className = 'text-muted';
    rocket.style.fontSize = '0.88rem';
    rocket.style.marginBottom = '0.75rem';
    rocket.textContent = launch.rocket;
    card.appendChild(rocket);

    const meta = document.createElement('div');
    meta.style.display = 'flex';
    meta.style.justifyContent = 'space-between';
    meta.style.fontSize = '0.75rem';
    meta.style.fontFamily = 'var(--font-mono)';
    meta.style.color = 'var(--text-muted)';
    meta.style.marginTop = 'auto';

    const location = document.createElement('span');
    location.textContent = launch.location || 'TBD';
    meta.appendChild(location);

    const type = document.createElement('span');
    type.textContent = launch.missionType || 'Orbital';
    meta.appendChild(type);

    card.appendChild(meta);

    // Click to navigate
    card.addEventListener('click', (e) => {
        if (e.target.tagName !== 'BUTTON' && !e.target.closest('button')) {
            window.location.href = `launch.html?id=${launch.id}`;
        }
    });

    // Bookmark button
    const isFav = Bookmarks && Bookmarks.has(launch.id);
    const btn = document.createElement('button');
    btn.className = 'btn btn-secondary';
    btn.style.marginTop = '1rem';
    btn.style.width = '100%';
    btn.textContent = isFav ? '★ Bookmarked' : '☆ Bookmark';
    btn.setAttribute('aria-label', isFav ? 'Remove from bookmarks' : 'Add to bookmarks');
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (Bookmarks) {
            isFav ? Bookmarks.remove(launch.id) : Bookmarks.add(launch.id);
            Toast.show(isFav ? 'Removed from bookmarks' : 'Added to bookmarks');
            btn.textContent = isFav ? '☆ Bookmark' : '★ Bookmarked';
        }
    });
    card.appendChild(btn);

    return card;
}

function renderVehicleCardSafe(vehicle) {
    const card = document.createElement('article');
    card.className = 'card';

    const header = document.createElement('div');
    header.className = 'card-header';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'flex-start';

    const status = document.createElement('span');
    status.className = `card-badge ${vehicle.status === 'Active' ? 'go' : 'warning'}`;
    status.textContent = vehicle.status;
    header.appendChild(status);

    const provider = document.createElement('span');
    provider.className = 'text-muted';
    provider.style.fontSize = '0.75rem';
    provider.textContent = vehicle.provider;
    header.appendChild(provider);

    card.appendChild(header);

    const title = document.createElement('h3');
    title.className = 'card-title';
    title.textContent = vehicle.name;
    card.appendChild(title);

    const specs = document.createElement('div');
    specs.style.display = 'grid';
    specs.style.gridTemplateColumns = 'repeat(2, 1fr)';
    specs.style.gap = '0.75rem';
    specs.style.margin = '1rem 0';
    specs.style.fontSize = '0.85rem';

    const specItems = [
        { label: 'LEO', value: vehicle.payloadLEO ? `${(vehicle.payloadLEO / 1000).toFixed(1)}t` : 'N/A' },
        { label: 'GTO', value: vehicle.payloadGTO ? `${(vehicle.payloadGTO / 1000).toFixed(1)}t` : 'N/A' },
        { label: 'Height', value: `${vehicle.height}m` },
        { label: 'Thrust', value: `${vehicle.thrust.toLocaleString()} kN` }
    ];

    specItems.forEach(spec => {
        const div = document.createElement('div');
        div.style.display = 'flex';
        div.style.flexDirection = 'column';
        const label = document.createElement('span');
        label.className = 'text-muted';
        label.style.fontSize = '0.7rem';
        label.textContent = spec.label;
        const value = document.createElement('span');
        value.style.fontFamily = 'var(--font-mono)';
        value.style.fontSize = '0.9rem';
        value.textContent = spec.value;
        div.appendChild(label);
        div.appendChild(value);
        specs.appendChild(div);
    });

    card.appendChild(specs);

    const footer = document.createElement('div');
    footer.style.display = 'flex';
    footer.style.justifyContent = 'space-between';
    footer.style.alignItems = 'center';
    footer.style.marginTop = '1rem';
    footer.style.paddingTop = '1rem';
    footer.style.borderTop = '1px solid var(--border-subtle)';

    const cost = document.createElement('span');
    cost.className = 'text-muted';
    cost.style.fontSize = '0.75rem';
    cost.textContent = spaceAPI.formatCurrency(vehicle.costPerLaunch);
    footer.appendChild(cost);

    const success = document.createElement('span');
    success.className = 'text-muted';
    success.style.fontSize = '0.75rem';
    success.textContent = `${vehicle.successRate}% success`;
    footer.appendChild(success);

    card.appendChild(footer);
    return card;
}

function initMobileMenu() {
    const toggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav-menu');

    if (!toggle || !nav) return;

    toggle.addEventListener('click', () => {
        const expanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', (!expanded).toString());
        nav.classList.toggle('active');
    });
}

function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.card, .stat-card').forEach(el => observer.observe(el));
}

function updateTelemetryStatus() {
    const statusDot = document.getElementById('telemetry-status');
    if (!statusDot) return;

    const isOnline = navigator.onLine;
    statusDot.className = `pulse-dot ${isOnline ? 'online' : 'offline'}`;
    statusDot.title = isOnline ? 'Live telemetry active' : 'Offline mode';

    window.addEventListener('online', () => {
        statusDot.className = 'pulse-dot online';
        statusDot.title = 'Live telemetry active';
    });

    window.addEventListener('offline', () => {
        statusDot.className = 'pulse-dot offline';
        statusDot.title = 'Offline mode';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initScrollAnimations();
    updateTelemetryStatus();

    const yearSpan = document.getElementById('current-year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
});
