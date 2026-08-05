/**
 * SPACE PROGRAM - Main Application
 * Core functionality for navigation and page interactions
 */

// ============================================
// DOM READY
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initScrollEffects();
    initAnimations();
});

// ============================================
// NAVIGATION
// ============================================
function initNavigation() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu on link click
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // Set active nav link
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === 'index.html' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// ============================================
// SCROLL EFFECTS
// ============================================
function initScrollEffects() {
    const header = document.querySelector('.header');

    if (header) {
        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            // Add scrolled class for header styling
            if (currentScroll > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            lastScroll = currentScroll;
        });
    }
}

// ============================================
// SCROLL ANIMATIONS
// ============================================
function initAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements with animate class
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
}

// ============================================
// LOADING STATES
// ============================================
function showLoading(container) {
    container.innerHTML = `
        <div class="loading">
            <div class="loading-spinner"></div>
            <p>Loading data...</p>
        </div>
    `;
}

function showError(container, message = 'Failed to load data') {
    container.innerHTML = `
        <div class="error-message">
            <h3>⚠️ Connection Error</h3>
            <p>${message}</p>
            <button class="btn btn-secondary" onclick="location.reload()">Retry</button>
        </div>
    `;
}

// ============================================
// CARD RENDERERS
// ============================================
function renderNewsCard(news) {
    const imageUrl = news.imageUrl || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80';
    const timeAgo = spaceAPI.getTimeAgo(news.publishedAt);

    return `
        <article class="card news-card" role="article" itemscope itemtype="https://schema.org/NewsArticle">
            <img src="${imageUrl}" alt="${news.title}" class="card-image" loading="lazy" itemprop="image">
            <div class="card-content">
                <div class="card-meta">
                    <span class="card-badge">${news.source}</span>
                    <time datetime="${news.publishedAt}" itemprop="datePublished">${timeAgo}</time>
                </div>
                <h3 itemprop="headline">${news.title}</h3>
                <p itemprop="description">${news.summary ? news.summary.substring(0, 150) + '...' : ''}</p>
                <div class="card-footer">
                    <a href="${news.url}" target="_blank" rel="noopener noreferrer" class="read-more" itemprop="url">
                        Read Article
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                    </a>
                </div>
            </div>
        </article>
    `;
}

function renderLaunchCard(launch) {
    const statusClass = launch.status === 'Success' ? 'success' :
        launch.status === 'Failure' ? 'failure' : 'upcoming';
    const launchDate = spaceAPI.formatDateTime(launch.net);

    return `
        <article class="card launch-card" role="article" itemscope itemtype="https://schema.org/Event">
            <div class="launch-header">
                <h3 itemprop="name">${launch.name}</h3>
                <span class="card-badge ${statusClass}">${launch.statusName}</span>
            </div>
            <div class="launch-info">
                <div class="info-row">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    <time datetime="${launch.net}" itemprop="startDate">${launchDate}</time>
                </div>
                <div class="info-row">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16"/>
                        <path d="M1 21h22"/>
                        <path d="M9 7h1m-1 4h1m4-4h1m-1 4h1"/>
                    </svg>
                    <span itemprop="organizer">${launch.provider}</span>
                </div>
                <div class="info-row">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                    </svg>
                    <span>${launch.rocket}</span>
                </div>
                <div class="info-row">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                    </svg>
                    <span itemprop="location">${launch.location}</span>
                </div>
            </div>
            <p class="launch-description">${launch.missionType} - ${launch.pad}</p>
        </article>
    `;
}

function renderVehicleCard(vehicle) {
    const statusClass = vehicle.status === 'Active' ? 'success' :
        vehicle.status === 'Development' ? 'upcoming' : '';

    return `
        <article class="card" role="article" itemscope itemtype="https://schema.org/Product">
            <div class="launch-header">
                <h3 itemprop="name">${vehicle.name}</h3>
                <span class="card-badge ${statusClass}">${vehicle.status}</span>
            </div>
            <div class="launch-info">
                <div class="info-row">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16"/>
                    </svg>
                    <span itemprop="manufacturer">${vehicle.provider}</span>
                </div>
                <div class="info-row">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M2 12h20"/>
                    </svg>
                    <span>${vehicle.country}</span>
                </div>
                <div class="info-row">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                    </svg>
                    <span>${vehicle.successRate}% Success Rate</span>
                </div>
                <div class="info-row">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
                    </svg>
                    <span>${spaceAPI.formatCurrency(vehicle.costPerLaunch)}/launch</span>
                </div>
            </div>
            <p class="launch-description">
                LEO: ${vehicle.payloadLEO?.toLocaleString() || 'N/A'} kg | 
                Height: ${vehicle.height}m | 
                ${vehicle.totalLaunches} launches
            </p>
        </article>
    `;
}

function renderStatCard(value, label, color = '') {
    return `
        <div class="card stat-card ${color}">
            <div class="stat-value">${value}</div>
            <div class="stat-label">${label}</div>
        </div>
    `;
}

// ============================================
// COUNTDOWN TIMER
// ============================================
function startCountdown(elementId, targetDate) {
    const element = document.getElementById(elementId);
    if (!element) return;

    function update() {
        const countdown = spaceAPI.getCountdown(targetDate);

        if (countdown.expired) {
            element.innerHTML = '<p class="text-accent">Launched!</p>';
            return;
        }

        element.innerHTML = `
            <div class="countdown">
                <div class="countdown-item">
                    <span class="countdown-value">${countdown.days}</span>
                    <span class="countdown-label">Days</span>
                </div>
                <div class="countdown-item">
                    <span class="countdown-value">${countdown.hours}</span>
                    <span class="countdown-label">Hours</span>
                </div>
                <div class="countdown-item">
                    <span class="countdown-value">${countdown.minutes}</span>
                    <span class="countdown-label">Minutes</span>
                </div>
                <div class="countdown-item">
                    <span class="countdown-value">${countdown.seconds}</span>
                    <span class="countdown-label">Seconds</span>
                </div>
            </div>
        `;
    }

    update();
    setInterval(update, 1000);
}

// ============================================
// FILTER FUNCTIONALITY
// ============================================
function initFilters(containerSelector, items, renderFunction) {
    const container = document.querySelector(containerSelector);
    const searchInput = document.getElementById('search-input');
    const statusFilter = document.getElementById('status-filter');
    const providerFilter = document.getElementById('provider-filter');
    const sortSelect = document.getElementById('sort-select');

    let filteredItems = [...items];

    function filterAndRender() {
        filteredItems = items.filter(item => {
            const searchTerm = searchInput?.value.toLowerCase() || '';
            const statusValue = statusFilter?.value || 'all';
            const providerValue = providerFilter?.value || 'all';

            const matchesSearch =
                (item.name?.toLowerCase().includes(searchTerm)) ||
                (item.title?.toLowerCase().includes(searchTerm)) ||
                (item.provider?.toLowerCase().includes(searchTerm)) ||
                (item.rocket?.toLowerCase().includes(searchTerm));

            const matchesStatus = statusValue === 'all' ||
                item.status?.toLowerCase() === statusValue.toLowerCase();

            const matchesProvider = providerValue === 'all' ||
                item.provider === providerValue;

            return matchesSearch && matchesStatus && matchesProvider;
        });

        // Sort
        const sortValue = sortSelect?.value || 'date-desc';
        const [sortBy, sortDir] = sortValue.split('-');

        filteredItems.sort((a, b) => {
            let comparison = 0;
            switch (sortBy) {
                case 'date':
                    comparison = new Date(a.net || a.publishedAt) - new Date(b.net || b.publishedAt);
                    break;
                case 'name':
                    comparison = (a.name || a.title || '').localeCompare(b.name || b.title || '');
                    break;
                case 'provider':
                    comparison = (a.provider || '').localeCompare(b.provider || '');
                    break;
            }
            return sortDir === 'asc' ? comparison : -comparison;
        });

        // Render
        container.innerHTML = filteredItems.map(renderFunction).join('');

        if (filteredItems.length === 0) {
            container.innerHTML = `
                <div class="error-message" style="grid-column: 1/-1;">
                    <h3>No Results Found</h3>
                    <p>Try adjusting your filters or search terms.</p>
                </div>
            `;
        }
    }

    // Attach event listeners
    searchInput?.addEventListener('input', filterAndRender);
    statusFilter?.addEventListener('change', filterAndRender);
    providerFilter?.addEventListener('change', filterAndRender);
    sortSelect?.addEventListener('change', filterAndRender);

    // Populate provider filter
    if (providerFilter) {
        const providers = [...new Set(items.map(item => item.provider).filter(Boolean))];
        providers.sort().forEach(provider => {
            const option = document.createElement('option');
            option.value = provider;
            option.textContent = provider;
            providerFilter.appendChild(option);
        });
    }

    // Initial render
    filterAndRender();

    return { filterAndRender };
}

// ============================================
// DATA SOURCES DISPLAY
// ============================================
function renderDataSources(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const sources = spaceAPI.getDataSourcesList();

    container.innerHTML = sources.map(source => `
        <div class="source-card">
            <div class="source-icon">${source.type === 'rss' ? '📡' : '🔌'}</div>
            <div class="source-info">
                <h4>${source.name}</h4>
                <p>${source.type.toUpperCase()}</p>
            </div>
        </div>
    `).join('');
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Smooth scroll to element
function scrollToElement(selector) {
    const element = document.querySelector(selector);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Copy to clipboard
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        console.error('Failed to copy:', err);
        return false;
    }
}

// Local storage helpers
function saveToStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        console.error('Storage error:', e);
    }
}

function loadFromStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (e) {
        console.error('Storage error:', e);
        return null;
    }
}
