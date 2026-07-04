let cashChart1Instance = null;
let cashChart2Instance = null;

const initCashCharts = async () => {
    const ctx1 = document.getElementById('cashChart1');
    const ctx2 = document.getElementById('cashChart2');
    
    if (!ctx1 || !ctx2) return;

    const isLight = document.body.classList.contains('light-theme');
    Chart.defaults.color = isLight ? '#64748b' : '#94a3b8';
    Chart.defaults.font.family = "'Outfit', sans-serif";
    const gridColor = isLight ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)';

    try {
        const filters = window.getFilters();
        const params = new URLSearchParams(filters).toString();
        const response = await fetch('api/get_cashflow_data.php?' + params);
        const data = await response.json();
        window.applyCurrencyConversion(data);

        if (data.success) {
            const kpiValues = document.querySelectorAll('.kpi-value');
            if (kpiValues.length >= 3) {
                kpiValues[0].innerText = window.formatDynamicCurrency(data.kpis.opCashFlow);
                kpiValues[1].innerText = window.formatDynamicCurrency(data.kpis.invCashFlow);
                kpiValues[2].innerText = window.formatDynamicCurrency(data.kpis.endingBalance);
            }

            if (cashChart1Instance) cashChart1Instance.destroy();
            cashChart1Instance = new Chart(ctx1, {
                type: 'radar',
                data: {
                    labels: data.charts.categories.labels,
                    datasets: [{
                        label: 'Cash Flow Categories',
                        data: data.charts.categories.data,
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

            if (cashChart2Instance) cashChart2Instance.destroy();
            cashChart2Instance = new Chart(ctx2, {
                type: 'line',
                data: {
                    labels: data.charts.trend.labels,
                    datasets: [{
                        label: 'Ending Cash Balance',
                        data: data.charts.trend.data,
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
        console.error("Failed to load cash flow data:", err);
    }
};

document.addEventListener('DOMContentLoaded', initCashCharts);

const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        setTimeout(() => {
            const isLight = document.body.classList.contains('light-theme');
            const newColor = isLight ? '#64748b' : '#94a3b8';
            const newGridColor = isLight ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)';
            
            Chart.defaults.color = newColor;
            
            if (cashChart1Instance) {
                cashChart1Instance.options.scales.r.grid.color = newGridColor;
                cashChart1Instance.options.scales.r.angleLines.color = newGridColor;
                cashChart1Instance.update();
            }
            if (cashChart2Instance) {
                cashChart2Instance.options.scales.y.grid.color = newGridColor;
                cashChart2Instance.update();
            }
        }, 100);
    });
}

window.addEventListener('filtersChanged', initCashCharts);
