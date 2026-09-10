/**
 * SPACE PROGRAM - API & Data Sources Module
 * Telemetry cache, sanitization and open space API fetchers
 */

const DATA_SOURCES = {
    spaceflightNews: {
        name: 'Spaceflight News API',
        url: 'https://api.spaceflightnewsapi.net/v4/articles',
        type: 'api',
        description: 'Latest space news and articles'
    },
    launchLibrary: {
        name: 'Launch Library 2',
        url: 'https://ll.thespacedevs.com/2.2.0',
        type: 'api',
        description: 'Comprehensive launch database'
    },
    nasaApod: {
        name: 'NASA APOD',
        url: 'https://api.nasa.gov/planetary/apod',
        apiKey: 'DEMO_KEY',
        type: 'api',
        description: 'Astronomy Picture of the Day'
    },
    rssProxy: 'https://api.rss2json.com/v1/api.json?rss_url=',
    rssFeeds: [
        { name: 'NASA Breaking News', url: 'https://www.nasa.gov/rss/dyn/breaking_news.rss', icon: '🚀' },
        { name: 'ESA News', url: 'https://www.esa.int/rssfeed/Our_Activities/Space_News', icon: '🌍' },
        { name: 'Space.com', url: 'https://www.space.com/feeds/all', icon: '🌌' },
        { name: 'Universe Today', url: 'https://www.universetoday.com/feed/', icon: '🔭' },
        { name: 'Spaceflight Now', url: 'https://spaceflightnow.com/feed/', icon: '📡' },
        { name: 'NASA JPL News', url: 'https://www.jpl.nasa.gov/feeds/news', icon: '🛰️' }
    ]
};

const LAUNCH_VEHICLES = [
    {
        id: 'falcon9',
        name: 'Falcon 9',
        provider: 'SpaceX',
        country: 'USA',
        status: 'Active',
        successRate: 99.1,
        costPerLaunch: 67000000,
        payloadLEO: 22800,
        payloadGTO: 8300,
        height: 70,
        diameter: 3.7,
        mass: 549054,
        thrust: 7607,
        stages: 2,
        reusable: true,
        firstFlight: '2010-06-04',
        totalLaunches: 380,
        description: 'Workhorse of commercial space flight with flight-proven reusable first stages.'
    },
    {
        id: 'falcon-heavy',
        name: 'Falcon Heavy',
        provider: 'SpaceX',
        country: 'USA',
        status: 'Active',
        successRate: 100,
        costPerLaunch: 97000000,
        payloadLEO: 63800,
        payloadGTO: 26700,
        height: 70,
        diameter: 12.2,
        mass: 1420788,
        thrust: 22819,
        stages: 2,
        reusable: true,
        firstFlight: '2018-02-06',
        totalLaunches: 11,
        description: 'Heavy-lift orbital launcher utilizing three Falcon 9 engine cores.'
    },
    {
        id: 'starship',
        name: 'Starship',
        provider: 'SpaceX',
        country: 'USA',
        status: 'Development',
        successRate: 75.0,
        costPerLaunch: 15000000,
        payloadLEO: 150000,
        payloadGTO: 100000,
        height: 121,
        diameter: 9,
        mass: 5000000,
        thrust: 74500,
        stages: 2,
        reusable: true,
        firstFlight: '2023-04-20',
        totalLaunches: 8,
        description: 'Super heavy-lift fully reusable orbital transportation system.'
    },
    {
        id: 'sls',
        name: 'SLS Block 1',
        provider: 'NASA',
        country: 'USA',
        status: 'Active',
        successRate: 100,
        costPerLaunch: 2200000000,
        payloadLEO: 95000,
        payloadGTO: 27000,
        height: 98,
        diameter: 8.4,
        mass: 2603000,
        thrust: 39100,
        stages: 2,
        reusable: false,
        firstFlight: '2022-11-16',
        totalLaunches: 1,
        description: 'Deep-space super heavy launcher engineered for the Artemis lunar return.'
    },
    {
        id: 'vulcan',
        name: 'Vulcan Centaur',
        provider: 'ULA',
        country: 'USA',
        status: 'Active',
        successRate: 100,
        costPerLaunch: 110000000,
        payloadLEO: 27200,
        payloadGTO: 14400,
        height: 61.6,
        diameter: 5.4,
        mass: 546700,
        thrust: 5336,
        stages: 2,
        reusable: false,
        firstFlight: '2024-01-08',
        totalLaunches: 2,
        description: 'ULA successor vehicle replacing Atlas V and Delta IV.'
    },
    {
        id: 'ariane-6',
        name: 'Ariane 6',
        provider: 'Arianespace',
        country: 'Europe',
        status: 'Active',
        successRate: 100,
        costPerLaunch: 80000000,
        payloadLEO: 21650,
        payloadGTO: 11500,
        height: 63,
        diameter: 5.4,
        mass: 860000,
        thrust: 8000,
        stages: 2,
        reusable: false,
        firstFlight: '2024-07-09',
        totalLaunches: 2,
        description: 'European heavy-lift launcher with modular Ariane 62/64 boosters.'
    },
    {
        id: 'electron',
        name: 'Electron',
        provider: 'Rocket Lab',
        country: 'USA/NZ',
        status: 'Active',
        successRate: 94.8,
        costPerLaunch: 7500000,
        payloadLEO: 300,
        payloadGTO: null,
        height: 18,
        diameter: 1.2,
        mass: 13000,
        thrust: 224,
        stages: 2,
        reusable: true,
        firstFlight: '2017-05-25',
        totalLaunches: 58,
        description: 'Dedicated smallsat launcher with Rutherford 3D-printed electric-pump engines.'
    },
    {
        id: 'new-glenn',
        name: 'New Glenn',
        provider: 'Blue Origin',
        country: 'USA',
        status: 'Development',
        successRate: 0,
        costPerLaunch: 68000000,
        payloadLEO: 45000,
        payloadGTO: 13000,
        height: 98,
        diameter: 7,
        mass: 680000,
        thrust: 17100,
        stages: 2,
        reusable: true,
        firstFlight: '2025-01-01',
        totalLaunches: 0,
        description: 'Heavy orbital launcher powered by seven BE-4 liquefied natural gas engines.'
    },
    {
        id: 'long-march-5',
        name: 'Long March 5',
        provider: 'CASC',
        country: 'China',
        status: 'Active',
        successRate: 88.8,
        costPerLaunch: 100000000,
        payloadLEO: 25000,
        payloadGTO: 14000,
        height: 56.97,
        diameter: 5,
        mass: 867000,
        thrust: 10557,
        stages: 2,
        reusable: false,
        firstFlight: '2016-11-03',
        totalLaunches: 9,
        description: 'Heavy orbital workhorse for space station modules and lunar sample returns.'
    },
    {
        id: 'h3',
        name: 'H3',
        provider: 'JAXA/MHI',
        country: 'Japan',
        status: 'Active',
        successRate: 75.0,
        costPerLaunch: 50000000,
        payloadLEO: 6500,
        payloadGTO: 4000,
        height: 63,
        diameter: 5.2,
        mass: 574000,
        thrust: 5880,
        stages: 2,
        reusable: false,
        firstFlight: '2023-03-07',
        totalLaunches: 4,
        description: 'Next-generation Japanese expendable orbital launcher.'
    }
];

class SpaceAPI {
    constructor() {
        this.cache = new Map();
        this.cacheTimeout = 10 * 60 * 1000;
    }

    getCached(key) {
        const mem = this.cache.get(key);
        if (mem && Date.now() - mem.timestamp < this.cacheTimeout) return mem.data;
        try {
            const raw = localStorage.getItem('spc_' + key);
            if (raw) {
                const stored = JSON.parse(raw);
                if (stored && Date.now() - stored.timestamp < this.cacheTimeout) {
                    this.cache.set(key, stored);
                    return stored.data;
                }
                localStorage.removeItem('spc_' + key);
            }
        } catch (e) { /* stockage indisponible : cache memoire seul */ }
        return null;
    }

    setCache(key, data) {
        const entry = { data, timestamp: Date.now() };
        this.cache.set(key, entry);
        try { localStorage.setItem('spc_' + key, JSON.stringify(entry)); } catch (e) { /* ignore */ }
    }

    // Si l'API est saturee (429), on suspend les appels quelques minutes
    // pour la laisser respirer au lieu de marteler chaque page.
    fallbackHeld() {
        try { const f = localStorage.getItem('spc_hold'); return Boolean(f) && Number(f) > Date.now(); }
        catch (e) { return false; }
    }

    holdFallback(ms = 4 * 60 * 1000) {
        try { localStorage.setItem('spc_hold', String(Date.now() + ms)); } catch (e) { /* ignore */ }
    }

    releaseHold() {
        try { localStorage.removeItem('spc_hold'); } catch (e) { /* ignore */ }
    }

    // Invalide les caches (memoire + localStorage) dont la cle commence par
    // le prefixe donne (ex. 'upcoming_' pour forcer une resynchro des vols a venir).
    clearCache(prefix = '') {
        for (const key of [...this.cache.keys()]) {
            if (key.startsWith(prefix)) this.cache.delete(key);
        }
        try {
            for (const key of Object.keys(localStorage)) {
                if (key.startsWith('spc_' + prefix)) localStorage.removeItem(key);
            }
        } catch (e) { /* stockage indisponible */ }
    }

    async fetchOnce(url, timeoutMs) {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeoutMs);
        try {
            const response = await fetch(url, {
                signal: controller.signal,
                headers: { 'Accept': 'application/json' }
            });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.json();
        } finally {
            clearTimeout(timer);
        }
    }

    async fetchJSON(url, timeoutMs = 20000) {
        try {
            return await this.fetchOnce(url, timeoutMs);
        } catch (error) {
            // Quota LL2 (429) ou erreur transitoire : un seul retry apres 2.5 s
            try {
                await new Promise(resolve => setTimeout(resolve, 2500));
                return await this.fetchOnce(url, timeoutMs);
            } catch (retryError) {
                console.warn(`Telemetry fetch error for ${url}:`, retryError.message);
                return null;
            }
        }
    }

    // Safe plain text extraction — does NOT assign to any DOM innerHTML
    stripHtml(html) {
        if (!html) return '';
        return String(html)
            .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
            .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    async getNews(limit = 12) {
        const cacheKey = `news_${limit}`;
        const cached = this.getCached(cacheKey);
        if (cached) return cached;

        const url = `${DATA_SOURCES.spaceflightNews.url}?limit=${limit}`;
        const data = await this.fetchJSON(url);

        if (data && Array.isArray(data.results)) {
            const news = data.results.map(item => ({
                id: String(item.id),
                title: item.title,
                summary: item.summary,
                url: item.url,
                imageUrl: item.image_url,
                publishedAt: item.published_at,
                source: item.news_site || 'Spaceflight News',
                sourceType: 'api'
            }));
            this.setCache(cacheKey, news);
            return news;
        }
        return [];
    }

    async getUpcomingLaunches(limit = 20) {
        const all = this.getCached('upcoming_all');
        if (all) return all.slice(0, limit);
        if (this.fallbackHeld()) return this.getFallbackUpcomingLaunches();

        const url = `${DATA_SOURCES.launchLibrary.url}/launch/upcoming/?limit=50&mode=detailed`;
        const data = await this.fetchJSON(url);

        if (data && Array.isArray(data.results)) {
            // Reponse API valide (meme vide) => donnees live, jamais de fausses entrees
            const launches = data.results.map(launch => ({
                id: launch.id,
                name: launch.name,
                status: launch.status?.abbrev || 'TBD',
                statusName: launch.status?.name || 'Scheduled',
                net: launch.net,
                provider: launch.launch_service_provider?.name || 'Unknown Provider',
                rocket: launch.rocket?.configuration?.full_name || launch.rocket?.configuration?.name || 'Unknown Rocket',
                mission: launch.mission?.name || launch.name?.split(' | ')[1] || launch.name,
                missionType: launch.mission?.type || 'Orbital',
                pad: launch.pad?.name || 'Pad',
                location: launch.pad?.location?.name || 'Launch Site',
                isFallback: false
            }));
            this.setCache('upcoming_all', launches);
            this.releaseHold();
            return launches.slice(0, limit);
        }

        this.holdFallback();
        return this.getFallbackUpcomingLaunches();
    }

    async getPastLaunches(limit = 100) {
        const all = this.getCached('past_all');
        if (all) return all.slice(0, limit);
        if (this.fallbackHeld()) return this.getFallbackPastLaunches();

        const url = `${DATA_SOURCES.launchLibrary.url}/launch/previous/?limit=50&mode=detailed`;
        const data = await this.fetchJSON(url);

        if (data && Array.isArray(data.results)) {
            const launches = data.results.map(launch => ({
                id: launch.id,
                name: launch.name,
                status: launch.status?.abbrev || 'Success',
                statusName: launch.status?.name || 'Successful',
                net: launch.net,
                provider: launch.launch_service_provider?.name || 'Unknown Provider',
                rocket: launch.rocket?.configuration?.full_name || launch.rocket?.configuration?.name || 'Unknown Rocket',
                mission: launch.mission?.name || launch.name?.split(' | ')[1] || launch.name,
                missionType: launch.mission?.type || 'Orbital',
                pad: launch.pad?.name || 'Pad',
                location: launch.pad?.location?.name || 'Launch Site',
                isFallback: false
            }));
            this.setCache('past_all', launches);
            this.releaseHold();
            return launches.slice(0, limit);
        }

        this.holdFallback();
        return this.getFallbackPastLaunches();
    }

    async getLaunchStatistics() {
        try {
            // Appels LL2 sequentiels (quota IP serre : pas de burst parallele)
            const upcoming = await this.getUpcomingLaunches(20);
            await new Promise(resolve => setTimeout(resolve, 1200));
            const past = await this.getPastLaunches(100);

            const all = [...past];
            if (all.length >= 20) {
                const stats = {
                    total: all.length,
                    success: all.filter(l => l.status === 'Success').length,
                    failure: all.filter(l => l.status === 'Failure').length,
                    upcoming: upcoming.length,
                    byProvider: {},
                    byYear: {}
                };

                all.forEach(l => {
                    const prov = l.provider || 'Other';
                    stats.byProvider[prov] = (stats.byProvider[prov] || 0) + 1;
                    const y = new Date(l.net).getFullYear();
                    if (!isNaN(y)) stats.byYear[y] = (stats.byYear[y] || 0) + 1;
                });
                return stats;
            }
        } catch (e) {
            console.warn('Live statistics failed, using curated archive:', e);
        }

        return this.getFallbackStatistics();
    }

    getFallbackStatistics() {
        return {
            total: 284,
            success: 272,
            failure: 12,
            upcoming: 24,
            byProvider: {
                'SpaceX': 138,
                'CASC': 66,
                'Roscosmos': 19,
                'Rocket Lab': 18,
                'ISRO': 11,
                'ULA': 9,
                'Arianespace': 8,
                'JAXA': 6,
                'Others': 9
            },
            byYear: {
                '2021': 145,
                '2022': 186,
                '2023': 223,
                '2024': 256,
                '2025': 284
            }
        };
    }

    getFallbackUpcomingLaunches() {
        return [
            { id: 'u1', name: 'Falcon 9 | Starlink Group 12-8', status: 'Go', statusName: 'Go for Launch', net: '2026-09-12T14:00:00Z', provider: 'SpaceX', rocket: 'Falcon 9 Block 5', mission: 'Starlink v2 Mini', location: 'Cape Canaveral, FL', pad: 'SLC-40', missionType: 'Communications', isFallback: true },
            { id: 'u2', name: 'Electron | StriX Launch', status: 'Go', statusName: 'Go for Launch', net: '2026-09-15T03:00:00Z', provider: 'Rocket Lab', rocket: 'Electron', mission: 'StriX SAR', location: 'Mahia LC-1A, NZ', pad: 'LC-1A', missionType: 'Earth Observation', isFallback: true },
            { id: 'u3', name: 'Vulcan Centaur | USSF-106', status: 'TBD', statusName: 'Scheduled', net: '2026-09-18T10:00:00Z', provider: 'United Launch Alliance', rocket: 'Vulcan Centaur', mission: 'USSF-106', location: 'Cape Canaveral, FL', pad: 'SLC-41', missionType: 'National Security', isFallback: true },
            { id: 'u4', name: 'Ariane 6 | CSO-3', status: 'Go', statusName: 'Go for Launch', net: '2026-09-22T20:00:00Z', provider: 'Arianespace', rocket: 'Ariane 62', mission: 'CSO-3 Reconnaissance', location: 'Kourou, French Guiana', pad: 'ELA-4', missionType: 'Government', isFallback: true }
        ];
    }

    getFallbackPastLaunches() {
        return [
            { id: 'p1', name: 'Falcon 9 | Starlink Group 12-7', status: 'Success', statusName: 'Mission Successful', net: '2026-09-04T11:20:00Z', provider: 'SpaceX', rocket: 'Falcon 9 Block 5', mission: 'Starlink', location: 'Cape Canaveral, FL', pad: 'SLC-40', missionType: 'Communications', isFallback: true },
            { id: 'p2', name: 'Starship | Integrated Flight Test 7', status: 'Success', statusName: 'Mission Successful', net: '2026-08-28T13:00:00Z', provider: 'SpaceX', rocket: 'Starship', mission: 'Orbital Demo & Catch', location: 'Starbase Boca Chica, TX', pad: 'OLM-1', missionType: 'Test Flight', isFallback: true },
            { id: 'p3', name: 'Long March 5B | Megaconstellation', status: 'Success', statusName: 'Mission Successful', net: '2026-08-20T04:30:00Z', provider: 'CASC', rocket: 'Long Long March 5B', mission: 'Qianfan Batch 2', location: 'Wenchang, China', pad: 'LC-101', missionType: 'Communications', isFallback: true }
        ];
    }

    async getNasaApod() {
        const cacheKey = 'nasa_apod';
        const cached = this.getCached(cacheKey);
        if (cached) return cached;

        const url = `${DATA_SOURCES.nasaApod.url}?api_key=${DATA_SOURCES.nasaApod.apiKey}`;
        const data = await this.fetchJSON(url);
        if (data) {
            this.setCache(cacheKey, data);
            return data;
        }
        return null;
    }

    async getRSSFeed(feedUrl, limit = 6) {
        const cacheKey = `rss_${feedUrl}_${limit}`;
        const cached = this.getCached(cacheKey);
        if (cached) return cached;

        const proxy = `${DATA_SOURCES.rssProxy}${encodeURIComponent(feedUrl)}`;
        const data = await this.fetchJSON(proxy);

        if (data && Array.isArray(data.items)) {
            const items = data.items.slice(0, limit).map(item => ({
                id: item.guid || item.link,
                title: this.stripHtml(item.title || ''),
                summary: this.stripHtml(item.description || item.content || ''),
                url: item.link,
                imageUrl: item.thumbnail || item.enclosure?.link || null,
                publishedAt: item.pubDate,
                sourceType: 'rss'
            }));
            this.setCache(cacheKey, items);
            return items;
        }
        return [];
    }

    async getAggregatedNews(limit = 30) {
        const [apiNews, ...rssResults] = await Promise.all([
            this.getNews(15),
            ...DATA_SOURCES.rssFeeds.slice(0, 4).map(f => this.getRSSFeed(f.url, 4).then(items => items.map(it => ({ ...it, source: f.name }))))
        ]);

        const all = [...apiNews];
        rssResults.forEach(batch => all.push(...batch));
        all.sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0));
        return all.slice(0, limit);
    }

    getVehicles() {
        return LAUNCH_VEHICLES;
    }

    formatDateTime(iso) {
        if (!iso) return 'TBD';
        const d = new Date(iso);
        if (isNaN(d.getTime())) return 'TBD';
        return d.toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit', timeZone: 'UTC', timeZoneName: 'short'
        });
    }

    formatCurrency(amount) {
        if (!amount || isNaN(amount)) return 'N/A';
        if (amount >= 1e9) return `$${(amount / 1e9).toFixed(1)}B`;
        if (amount >= 1e6) return `$${(amount / 1e6).toFixed(0)}M`;
        return `$${amount.toLocaleString()}`;
    }

    getTimeAgo(iso) {
        if (!iso) return 'Recently';
        const d = new Date(iso);
        const s = Math.floor((Date.now() - d.getTime()) / 1000);
        if (isNaN(s) || s < 0) return 'Just now';
        if (s < 3600) return `${Math.max(1, Math.floor(s / 60))}m ago`;
        if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
        if (s < 604800) return `${Math.floor(s / 86400)}d ago`;
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
}

const spaceAPI = new SpaceAPI();
