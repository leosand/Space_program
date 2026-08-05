/**
 * SPACE PROGRAM - Charts Module
 * Chart.js configurations and rendering functions
 */

// ============================================
// CHART THEME CONFIGURATION
// ============================================
const CHART_COLORS = {
    cyan: 'rgba(0, 212, 255, 1)',
    cyanLight: 'rgba(0, 212, 255, 0.2)',
    purple: 'rgba(139, 92, 246, 1)',
    purpleLight: 'rgba(139, 92, 246, 0.2)',
    pink: 'rgba(236, 72, 153, 1)',
    pinkLight: 'rgba(236, 72, 153, 0.2)',
    green: 'rgba(16, 185, 129, 1)',
    greenLight: 'rgba(16, 185, 129, 0.2)',
    orange: 'rgba(245, 158, 11, 1)',
    orangeLight: 'rgba(245, 158, 11, 0.2)',
    red: 'rgba(239, 68, 68, 1)',
    redLight: 'rgba(239, 68, 68, 0.2)',
    gray: 'rgba(161, 161, 170, 1)',
    grayLight: 'rgba(161, 161, 170, 0.2)',
    white: 'rgba(255, 255, 255, 1)',
    whiteLight: 'rgba(255, 255, 255, 0.1)'
};

const CHART_PALETTE = [
    CHART_COLORS.cyan,
    CHART_COLORS.purple,
    CHART_COLORS.pink,
    CHART_COLORS.green,
    CHART_COLORS.orange,
    CHART_COLORS.red,
    CHART_COLORS.gray
];

const CHART_PALETTE_LIGHT = [
    CHART_COLORS.cyanLight,
    CHART_COLORS.purpleLight,
    CHART_COLORS.pinkLight,
    CHART_COLORS.greenLight,
    CHART_COLORS.orangeLight,
    CHART_COLORS.redLight,
    CHART_COLORS.grayLight
];

// Default chart options
const DEFAULT_OPTIONS = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            labels: {
                color: CHART_COLORS.gray,
                font: {
                    family: "'Inter', sans-serif",
                    size: 12
                },
                padding: 20
            }
        },
        tooltip: {
            backgroundColor: 'rgba(12, 13, 20, 0.95)',
            titleColor: CHART_COLORS.white,
            bodyColor: CHART_COLORS.gray,
            borderColor: CHART_COLORS.whiteLight,
            borderWidth: 1,
            padding: 12,
            cornerRadius: 8,
            titleFont: {
                family: "'Space Grotesk', sans-serif",
                size: 14,
                weight: 600
            },
            bodyFont: {
                family: "'Inter', sans-serif",
                size: 12
            }
        }
    },
    scales: {
        x: {
            grid: {
                color: CHART_COLORS.whiteLight,
                drawBorder: false
            },
            ticks: {
                color: CHART_COLORS.gray,
                font: {
                    family: "'Inter', sans-serif",
                    size: 11
                }
            }
        },
        y: {
            grid: {
                color: CHART_COLORS.whiteLight,
                drawBorder: false
            },
            ticks: {
                color: CHART_COLORS.gray,
                font: {
                    family: "'Inter', sans-serif",
                    size: 11
                }
            }
        }
    }
};

// ============================================
// CHART INSTANCES STORAGE
// ============================================
const chartInstances = {};

function destroyChart(chartId) {
    if (chartInstances[chartId]) {
        chartInstances[chartId].destroy();
        delete chartInstances[chartId];
    }
}

// ============================================
// LAUNCHES BY YEAR CHART
// ============================================
function createLaunchesByYearChart(canvasId, data) {
    destroyChart(canvasId);
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;

    const labels = Object.keys(data).sort();
    const values = labels.map(year => data[year]);

    chartInstances[canvasId] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Number of Launches',
                data: values,
                backgroundColor: CHART_COLORS.cyanLight,
                borderColor: CHART_COLORS.cyan,
                borderWidth: 2,
                borderRadius: 6,
                hoverBackgroundColor: CHART_COLORS.cyan
            }]
        },
        options: {
            ...DEFAULT_OPTIONS,
            plugins: {
                ...DEFAULT_OPTIONS.plugins,
                legend: {
                    display: false
                }
            }
        }
    });

    return chartInstances[canvasId];
}

// ============================================
// LAUNCHES BY PROVIDER CHART (DOUGHNUT)
// ============================================
function createProviderChart(canvasId, data) {
    destroyChart(canvasId);
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;

    const labels = Object.keys(data);
    const values = Object.values(data);

    chartInstances[canvasId] = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: CHART_PALETTE_LIGHT,
                borderColor: CHART_PALETTE,
                borderWidth: 2,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '60%',
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        color: CHART_COLORS.gray,
                        font: {
                            family: "'Inter', sans-serif",
                            size: 12
                        },
                        padding: 15,
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: DEFAULT_OPTIONS.plugins.tooltip
            }
        }
    });

    return chartInstances[canvasId];
}

// ============================================
// SUCCESS RATE LINE CHART
// ============================================
function createSuccessRateChart(canvasId, data) {
    destroyChart(canvasId);
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;

    const labels = Object.keys(data).sort();
    const values = labels.map(year => data[year]);

    chartInstances[canvasId] = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Success Rate (%)',
                data: values,
                borderColor: CHART_COLORS.green,
                backgroundColor: CHART_COLORS.greenLight,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: CHART_COLORS.green,
                pointBorderColor: CHART_COLORS.white,
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            ...DEFAULT_OPTIONS,
            scales: {
                ...DEFAULT_OPTIONS.scales,
                y: {
                    ...DEFAULT_OPTIONS.scales.y,
                    min: 0,
                    max: 100,
                    ticks: {
                        ...DEFAULT_OPTIONS.scales.y.ticks,
                        callback: (value) => value + '%'
                    }
                }
            }
        }
    });

    return chartInstances[canvasId];
}

// ============================================
// PAYLOAD COMPARISON CHART (HORIZONTAL BAR)
// ============================================
function createPayloadComparisonChart(canvasId, vehicles) {
    destroyChart(canvasId);
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;

    const sortedVehicles = [...vehicles].sort((a, b) => b.payloadLEO - a.payloadLEO);
    const labels = sortedVehicles.map(v => v.name);
    const leoData = sortedVehicles.map(v => v.payloadLEO || 0);
    const gtoData = sortedVehicles.map(v => v.payloadGTO || 0);

    chartInstances[canvasId] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'LEO Payload (kg)',
                    data: leoData,
                    backgroundColor: CHART_COLORS.cyanLight,
                    borderColor: CHART_COLORS.cyan,
                    borderWidth: 2,
                    borderRadius: 4
                },
                {
                    label: 'GTO Payload (kg)',
                    data: gtoData,
                    backgroundColor: CHART_COLORS.purpleLight,
                    borderColor: CHART_COLORS.purple,
                    borderWidth: 2,
                    borderRadius: 4
                }
            ]
        },
        options: {
            ...DEFAULT_OPTIONS,
            indexAxis: 'y',
            plugins: {
                ...DEFAULT_OPTIONS.plugins,
                legend: {
                    ...DEFAULT_OPTIONS.plugins.legend,
                    position: 'top'
                }
            },
            scales: {
                x: {
                    ...DEFAULT_OPTIONS.scales.x,
                    ticks: {
                        ...DEFAULT_OPTIONS.scales.x.ticks,
                        callback: (value) => (value / 1000).toFixed(0) + 't'
                    }
                },
                y: {
                    ...DEFAULT_OPTIONS.scales.y,
                    grid: {
                        display: false
                    }
                }
            }
        }
    });

    return chartInstances[canvasId];
}

// ============================================
// RADAR COMPARISON CHART
// ============================================
function createVehicleComparisonRadar(canvasId, vehicles) {
    destroyChart(canvasId);
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;

    // Normalize data for radar chart (0-100 scale)
    const maxPayload = Math.max(...vehicles.map(v => v.payloadLEO || 0));
    const maxThrust = Math.max(...vehicles.map(v => v.thrust || 0));
    const maxCost = Math.max(...vehicles.map(v => v.costPerLaunch || 0));
    const maxLaunches = Math.max(...vehicles.map(v => v.totalLaunches || 0));

    const datasets = vehicles.map((vehicle, index) => ({
        label: vehicle.name,
        data: [
            vehicle.successRate || 0,
            ((vehicle.payloadLEO || 0) / maxPayload) * 100,
            ((maxCost - (vehicle.costPerLaunch || 0)) / maxCost) * 100, // Inverted for cost efficiency
            vehicle.reusable ? 100 : 0,
            ((vehicle.totalLaunches || 0) / maxLaunches) * 100,
            ((vehicle.thrust || 0) / maxThrust) * 100
        ],
        borderColor: CHART_PALETTE[index % CHART_PALETTE.length],
        backgroundColor: CHART_PALETTE_LIGHT[index % CHART_PALETTE_LIGHT.length],
        borderWidth: 2,
        pointBackgroundColor: CHART_PALETTE[index % CHART_PALETTE.length],
        pointBorderColor: CHART_COLORS.white,
        pointBorderWidth: 1,
        pointRadius: 4
    }));

    chartInstances[canvasId] = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: [
                'Success Rate',
                'Payload Capacity',
                'Cost Efficiency',
                'Reusability',
                'Flight Heritage',
                'Thrust Power'
            ],
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: CHART_COLORS.gray,
                        font: {
                            family: "'Inter', sans-serif",
                            size: 12
                        },
                        padding: 15,
                        usePointStyle: true
                    }
                },
                tooltip: DEFAULT_OPTIONS.plugins.tooltip
            },
            scales: {
                r: {
                    min: 0,
                    max: 100,
                    ticks: {
                        display: false,
                        stepSize: 20
                    },
                    grid: {
                        color: CHART_COLORS.whiteLight
                    },
                    angleLines: {
                        color: CHART_COLORS.whiteLight
                    },
                    pointLabels: {
                        color: CHART_COLORS.gray,
                        font: {
                            family: "'Inter', sans-serif",
                            size: 11
                        }
                    }
                }
            }
        }
    });

    return chartInstances[canvasId];
}

// ============================================
// DIRECT COMPARISON BAR CHART
// ============================================
function createDirectComparisonChart(canvasId, vehicles, metric) {
    destroyChart(canvasId);
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;

    const metricLabels = {
        successRate: 'Success Rate (%)',
        costPerLaunch: 'Cost per Launch ($M)',
        payloadLEO: 'Payload to LEO (kg)',
        payloadGTO: 'Payload to GTO (kg)',
        height: 'Height (m)',
        totalLaunches: 'Total Launches',
        thrust: 'Thrust (kN)'
    };

    const labels = vehicles.map(v => v.name);
    const values = vehicles.map(v => {
        let val = v[metric] || 0;
        if (metric === 'costPerLaunch') val = val / 1000000;
        return val;
    });

    chartInstances[canvasId] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: metricLabels[metric] || metric,
                data: values,
                backgroundColor: vehicles.map((_, i) => CHART_PALETTE_LIGHT[i % CHART_PALETTE_LIGHT.length]),
                borderColor: vehicles.map((_, i) => CHART_PALETTE[i % CHART_PALETTE.length]),
                borderWidth: 2,
                borderRadius: 6
            }]
        },
        options: {
            ...DEFAULT_OPTIONS,
            plugins: {
                ...DEFAULT_OPTIONS.plugins,
                legend: {
                    display: false
                }
            }
        }
    });

    return chartInstances[canvasId];
}

// ============================================
// MINI STATS CHART (for dashboard cards)
// ============================================
function createMiniChart(canvasId, data, color = 'cyan') {
    destroyChart(canvasId);
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;

    const borderColor = CHART_COLORS[color] || CHART_COLORS.cyan;
    const bgColor = CHART_COLORS[color + 'Light'] || CHART_COLORS.cyanLight;

    chartInstances[canvasId] = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map((_, i) => i),
            datasets: [{
                data: data,
                borderColor: borderColor,
                backgroundColor: bgColor,
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: { enabled: false }
            },
            scales: {
                x: { display: false },
                y: { display: false }
            },
            elements: {
                line: {
                    borderCapStyle: 'round'
                }
            }
        }
    });

    return chartInstances[canvasId];
}

// ============================================
// INITIALIZE STATISTICS PAGE CHARTS
// ============================================
async function initStatisticsCharts() {
    try {
        const stats = await spaceAPI.getLaunchStatistics();
        const vehicles = spaceAPI.getVehicles();

        // Launches by year
        if (stats.byYear && Object.keys(stats.byYear).length > 0) {
            createLaunchesByYearChart('chart-by-year', stats.byYear);
        }

        // Launches by provider
        if (stats.byProvider && Object.keys(stats.byProvider).length > 0) {
            createProviderChart('chart-by-provider', stats.byProvider);
        }

        // Top 10 vehicles by payload
        const topVehicles = [...vehicles]
            .sort((a, b) => (b.payloadLEO || 0) - (a.payloadLEO || 0))
            .slice(0, 10);
        createPayloadComparisonChart('chart-payload', topVehicles);

        // Update stat cards
        updateStatCard('stat-total', stats.total);
        updateStatCard('stat-success', stats.success);
        updateStatCard('stat-failure', stats.failure);
        updateStatCard('stat-upcoming', stats.upcoming);

    } catch (error) {
        console.error('Failed to initialize statistics charts:', error);
    }
}

function updateStatCard(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        animateNumber(element, 0, value, 1500);
    }
}

function animateNumber(element, start, end, duration) {
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(start + (end - start) * easeOutQuart);

        element.textContent = current.toLocaleString();

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}
