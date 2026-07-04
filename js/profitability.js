let profitChart1Instance = null;
let profitChart2Instance = null;

const initProfitCharts = async () => {
    const ctx1 = document.getElementById('profitChart1');
    const ctx2 = document.getElementById('profitChart2');
    
    if (!ctx1 || !ctx2) return;

    const isLight = document.body.classList.contains('light-theme');
    Chart.defaults.color = isLight ? '#64748b' : '#94a3b8';
    Chart.defaults.font.family = "'Outfit', sans-serif";
    const gridColor = isLight ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)';

    try {
        const filters = window.getFilters();
        const params = new URLSearchParams(filters).toString();
        const response = await fetch('api/get_profitability_data.php?' + params);
        const data = await response.json();
        window.applyCurrencyConversion(data);

        if (data.success) {
            const kpiValues = document.querySelectorAll('.kpi-value');
            if (kpiValues.length >= 3) {
                kpiValues[0].innerText = data.kpis.grossMargin + '%';
                kpiValues[1].innerText = window.formatDynamicCurrency(data.kpis.netProfit);
                kpiValues[2].innerText = data.kpis.ebitda + '%';
            }

            if (profitChart1Instance) profitChart1Instance.destroy();
            profitChart1Instance = new Chart(ctx1, {
                type: 'bar',
                data: {
                    labels: data.charts.trend.labels,
                    datasets: [
                        {
                            type: 'line',
                            label: 'Gross Margin %',
                            data: data.charts.trend.margin,
                            borderColor: '#3b82f6',
                            borderWidth: 2,
                            yAxisID: 'y1'
                        },
                        {
                            type: 'bar',
                            label: 'Net Profit ($)',
                            data: data.charts.trend.profit,
                            backgroundColor: 'rgba(16, 185, 129, 0.8)',
                            borderRadius: 4,
                            yAxisID: 'y'
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: { 
                        y: { 
                            type: 'linear', display: true, position: 'left', grid: { color: gridColor }
                        },
                        y1: {
                            type: 'linear', display: true, position: 'right', grid: { drawOnChartArea: false }
                        },
                        x: { grid: { display: false } } 
                    }
                }
            });

            if (profitChart2Instance) profitChart2Instance.destroy();
            profitChart2Instance = new Chart(ctx2, {
                type: 'doughnut',
                data: {
                    labels: data.charts.region.labels,
                    datasets: [{
                        data: data.charts.region.profit,
                        backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '70%',
                    plugins: { legend: { position: 'right' } }
                }
            });
        }
    } catch (err) {
        console.error("Failed to load profitability data:", err);
    }
};

document.addEventListener('DOMContentLoaded', initProfitCharts);

const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        setTimeout(() => {
            const isLight = document.body.classList.contains('light-theme');
            const newColor = isLight ? '#64748b' : '#94a3b8';
            const newGridColor = isLight ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)';
            
            Chart.defaults.color = newColor;
            
            if (profitChart1Instance) {
                profitChart1Instance.options.scales.y.grid.color = newGridColor;
                profitChart1Instance.update();
            }
            if (profitChart2Instance) {
                profitChart2Instance.update();
            }
        }, 100);
    });
}

window.addEventListener('filtersChanged', initProfitCharts);
