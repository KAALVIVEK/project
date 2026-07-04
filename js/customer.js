let custChart1Instance = null;
let custChart2Instance = null;

const formatNumber = (value) => new Intl.NumberFormat('en-US').format(value);

const initCustomerCharts = async () => {
    const ctx1 = document.getElementById('custChart1');
    const ctx2 = document.getElementById('custChart2');
    
    if (!ctx1 || !ctx2) return;

    const isLight = document.body.classList.contains('light-theme');
    Chart.defaults.color = isLight ? '#64748b' : '#94a3b8';
    Chart.defaults.font.family = "'Outfit', sans-serif";
    const gridColor = isLight ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)';

    try {
        const filters = window.getFilters();
        const params = new URLSearchParams(filters).toString();
        const response = await fetch('api/get_customer_data.php?' + params);
        const data = await response.json();
        window.applyCurrencyConversion(data);

        if (data.success) {
            const kpiValues = document.querySelectorAll('.kpi-value');
            if (kpiValues.length >= 3) {
                kpiValues[0].innerText = formatNumber(data.kpis.activeCustomers);
                kpiValues[1].innerText = window.formatDynamicCurrency(data.kpis.totalAR);
                kpiValues[2].innerText = window.formatDynamicCurrency(data.kpis.overdueAR);
            }

            if (custChart1Instance) custChart1Instance.destroy();
            custChart1Instance = new Chart(ctx1, {
                type: 'bar',
                data: {
                    labels: data.charts.aging.labels,
                    datasets: [{
                        label: 'Accounts Receivable ($)',
                        data: data.charts.aging.data,
                        backgroundColor: ['#10b981', '#f59e0b', '#f97316', '#ef4444'],
                        borderRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: { y: { grid: { color: gridColor } }, x: { grid: { display: false } } }
                }
            });

            if (custChart2Instance) custChart2Instance.destroy();
            custChart2Instance = new Chart(ctx2, {
                type: 'bar',
                data: {
                    labels: data.charts.topCustomers.labels,
                    datasets: [{
                        label: 'Revenue Generated ($)',
                        data: data.charts.topCustomers.data,
                        backgroundColor: 'rgba(99, 102, 241, 0.8)',
                        borderRadius: 4
                    }]
                },
                options: {
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: { x: { grid: { color: gridColor } }, y: { grid: { display: false } } }
                }
            });
        }
    } catch (err) {
        console.error("Failed to load customer data:", err);
    }
};

document.addEventListener('DOMContentLoaded', initCustomerCharts);

const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        setTimeout(() => {
            const isLight = document.body.classList.contains('light-theme');
            const newColor = isLight ? '#64748b' : '#94a3b8';
            const newGridColor = isLight ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)';
            
            Chart.defaults.color = newColor;
            
            if (custChart1Instance) {
                custChart1Instance.options.scales.y.grid.color = newGridColor;
                custChart1Instance.update();
            }
            if (custChart2Instance) {
                custChart2Instance.options.scales.x.grid.color = newGridColor;
                custChart2Instance.update();
            }
        }, 100);
    });
}

window.addEventListener('filtersChanged', initCustomerCharts);
