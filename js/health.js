let cashFlowChartInstance = null;

const initHealthCharts = () => {
    const cashFlowCtx = document.getElementById('cashFlowChart');
    if (!cashFlowCtx) return;

    const isLight = document.body.classList.contains('light-theme');
    Chart.defaults.color = isLight ? '#64748b' : '#94a3b8';
    Chart.defaults.font.family = "'Outfit', sans-serif";
    const gridColor = isLight ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)';

    cashFlowChartInstance = new Chart(cashFlowCtx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
                {
                    label: 'Cash Inflow',
                    data: [120000, 135000, 110000, 140000, 155000, 125000],
                    backgroundColor: 'rgba(16, 185, 129, 0.8)',
                    borderRadius: 4
                },
                {
                    label: 'Cash Outflow',
                    data: [-90000, -95000, -85000, -100000, -110000, -80000],
                    backgroundColor: 'rgba(239, 68, 68, 0.8)',
                    borderRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    grid: { color: gridColor },
                    stacked: true
                },
                x: {
                    grid: { display: false },
                    stacked: true
                }
            }
        }
    });
};

window.updateChartTheme = (theme) => {
    if (!cashFlowChartInstance) return;
    const isLight = theme === 'light';
    const textColor = isLight ? '#64748b' : '#94a3b8';
    const gridColor = isLight ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)';
    Chart.defaults.color = textColor;
    
    cashFlowChartInstance.options.scales.y.grid.color = gridColor;
    cashFlowChartInstance.update();
};

document.addEventListener('DOMContentLoaded', initHealthCharts);
