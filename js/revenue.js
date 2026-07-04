let regionChartInstance = null;
let productChartInstance = null;
let forecastChartInstance = null;

const formatNumber = (value) => new Intl.NumberFormat('en-US').format(value);

const initRevenueCharts = async () => {
    const regionCtx = document.getElementById('regionChart');
    const productCtx = document.getElementById('productChart');
    const forecastCtx = document.getElementById('forecastChart');
    
    if (!regionCtx || !productCtx || !forecastCtx) return;

    const isLight = document.body.classList.contains('light-theme');
    Chart.defaults.color = isLight ? '#64748b' : '#94a3b8';
    Chart.defaults.font.family = "'Outfit', sans-serif";
    const gridColor = isLight ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)';

    try {
        const filters = window.getFilters();
        const params = new URLSearchParams(filters).toString();
        const response = await fetch('api/get_revenue_data.php?' + params);
        const data = await response.json();
        window.applyCurrencyConversion(data);

        if (data.success) {
            const kpiValues = document.querySelectorAll('.kpi-value');
            if (kpiValues.length >= 4) {
                kpiValues[0].innerText = window.formatDynamicCurrency(data.kpis.totalRevenue);
                kpiValues[1].innerText = formatNumber(data.kpis.unitsSold);
                kpiValues[2].innerText = formatNumber(data.kpis.activeCustomers);
                kpiValues[3].innerText = data.kpis.retentionRate + '%';
            }

            if (regionChartInstance) regionChartInstance.destroy();
            regionChartInstance = new Chart(regionCtx, {
                type: 'bar',
                data: {
                    labels: data.charts.region.labels,
                    datasets: [{
                        label: 'Revenue ($)',
                        data: data.charts.region.data,
                        backgroundColor: 'rgba(14, 165, 233, 0.8)',
                        borderRadius: 8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: { y: { grid: { color: gridColor } }, x: { grid: { display: false } } }
                }
            });

            if (productChartInstance) productChartInstance.destroy();
            productChartInstance = new Chart(productCtx, {
                type: 'radar',
                data: {
                    labels: data.charts.product.labels,
                    datasets: [{
                        label: 'Profit Margin %',
                        data: data.charts.product.data,
                        backgroundColor: 'rgba(99, 102, 241, 0.2)',
                        borderColor: '#6366f1',
                        pointBackgroundColor: '#6366f1',
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: { r: { grid: { color: gridColor }, angleLines: { color: gridColor } } }
                }
            });

            if (forecastChartInstance) forecastChartInstance.destroy();
            forecastChartInstance = new Chart(forecastCtx, {
                type: 'line',
                data: {
                    labels: data.charts.forecast.labels,
                    datasets: [{
                        label: 'Revenue Trend',
                        data: data.charts.forecast.data,
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: { y: { grid: { color: gridColor } }, x: { grid: { display: false } } }
                }
            });
        }
    } catch (err) {
        console.error("Failed to load revenue data:", err);
    }
};

document.addEventListener('DOMContentLoaded', initRevenueCharts);

const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        setTimeout(() => {
            const isLight = document.body.classList.contains('light-theme');
            const newColor = isLight ? '#64748b' : '#94a3b8';
            const newGridColor = isLight ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)';
            
            Chart.defaults.color = newColor;
            
            if (regionChartInstance) {
                regionChartInstance.options.scales.y.grid.color = newGridColor;
                regionChartInstance.update();
            }
            if (productChartInstance) {
                productChartInstance.options.scales.r.grid.color = newGridColor;
                productChartInstance.options.scales.r.angleLines.color = newGridColor;
                productChartInstance.update();
            }
            if (forecastChartInstance) {
                forecastChartInstance.options.scales.y.grid.color = newGridColor;
                forecastChartInstance.update();
            }
        }, 100);
    });
}

window.addEventListener('filtersChanged', initRevenueCharts);
