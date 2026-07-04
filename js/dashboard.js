let mainChartInstance = null;
let donutChartInstance = null;
const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
};
const initCharts = async () => {
    const mainCtx = document.getElementById('mainChart');
    const donutCtx = document.getElementById('donutChart');
    if (!mainCtx || !donutCtx) return;
    const isLight = document.body.classList.contains('light-theme');
    Chart.defaults.color = isLight ? '#64748b' : '#94a3b8';
    Chart.defaults.font.family = "'Outfit', sans-serif";
    const gridColor = isLight ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)';
    try {
        const filters = window.getFilters();
        const params = new URLSearchParams(filters).toString();
        const response = await fetch('api/get_dashboard_data.php?' + params);
        const data = await response.json();
        window.applyCurrencyConversion(data);
        if (data.success) {
            const kpiValues = document.querySelectorAll('.kpi-value');
            if (kpiValues.length >= 4) {
                kpiValues[0].innerText = window.formatDynamicCurrency(data.kpis.totalRevenue);
                kpiValues[1].innerText = window.formatDynamicCurrency(data.kpis.totalExpenses);
                kpiValues[2].innerText = window.formatDynamicCurrency(data.kpis.grossProfit);
                kpiValues[3].innerText = window.formatDynamicCurrency(data.kpis.netCashFlow);
            }
            if (mainChartInstance) mainChartInstance.destroy();
            mainChartInstance = new Chart(mainCtx, {
                type: 'line',
                data: {
                    labels: data.mainChart.labels,
                    datasets: [
                        {
                            label: 'Revenue',
                            data: data.mainChart.revenue,
                            borderColor: '#0ea5e9',
                            backgroundColor: 'rgba(14, 165, 233, 0.1)',
                            borderWidth: 2,
                            tension: 0.4,
                            fill: true
                        },
                        {
                            label: 'Expenses',
                            data: data.mainChart.expenses,
                            borderColor: '#ef4444',
                            backgroundColor: 'rgba(239, 68, 68, 0.05)',
                            borderWidth: 2,
                            tension: 0.4,
                            fill: true
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'top', labels: { usePointStyle: true, boxWidth: 8 } }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: { color: gridColor },
                            ticks: { callback: function(value) { return window.getCurrencySymbol() + (value > 1000 ? (value/1000).toFixed(0) : value) / 1000 + 'k'; } }
                        },
                        x: { grid: { display: false } }
                    },
                    interaction: { intersect: false, mode: 'index' },
                }
            });
            const palette = ['#0ea5e9', '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
            if (donutChartInstance) donutChartInstance.destroy();
            donutChartInstance = new Chart(donutCtx, {
                type: 'doughnut',
                data: {
                    labels: data.donutChart.labels,
                    datasets: [{
                        data: data.donutChart.data,
                        backgroundColor: data.donutChart.labels.map((_, i) => palette[i % palette.length]),
                        borderWidth: 0,
                        hoverOffset: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '75%',
                    plugins: {
                        legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8, padding: 20 } }
                    }
                }
            });
        }
    } catch (err) {
        console.error("Failed to load dashboard data:", err);
    }
};
document.addEventListener('DOMContentLoaded', initCharts);
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        setTimeout(() => {
            const isLight = document.body.classList.contains('light-theme');
            const newColor = isLight ? '#64748b' : '#94a3b8';
            const newGridColor = isLight ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)';
            Chart.defaults.color = newColor;
            if (mainChartInstance) {
                mainChartInstance.options.scales.y.grid.color = newGridColor;
                mainChartInstance.update();
            }
            if (donutChartInstance) {
                donutChartInstance.update();
            }
        }, 100);
    });
}
