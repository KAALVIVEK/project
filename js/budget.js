let budgetVarChart = null;
let budgetAllocChart = null;

const initBudgetCharts = () => {
    const varCtx = document.getElementById('budgetVarianceChart');
    const allocCtx = document.getElementById('budgetAllocationChart');
    if (!varCtx || !allocCtx) return;

    const isLight = document.body.classList.contains('light-theme');
    Chart.defaults.color = isLight ? '#64748b' : '#94a3b8';
    Chart.defaults.font.family = "'Outfit', sans-serif";
    const gridColor = isLight ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)';

    budgetVarChart = new Chart(varCtx, {
        type: 'bar',
        data: {
            labels: ['Engineering', 'Marketing', 'Sales', 'HR', 'Operations', 'Finance'],
            datasets: [
                {
                    label: 'Budget',
                    data: [850, 420, 600, 180, 250, 150],
                    backgroundColor: 'rgba(59, 130, 246, 0.8)',
                    borderRadius: 4
                },
                {
                    label: 'Actual Spend',
                    data: [820, 455, 580, 178, 260, 145],
                    backgroundColor: 'rgba(139, 92, 246, 0.8)',
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
                    title: { display: true, text: 'Amount ($ in Thousands)' }
                },
                x: {
                    grid: { display: false }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: (context) => context.dataset.label + ': $' + context.parsed.y + 'k'
                    }
                }
            }
        }
    });

    budgetAllocChart = new Chart(allocCtx, {
        type: 'doughnut',
        data: {
            labels: ['Engineering', 'Marketing', 'Sales', 'Operations', 'Other'],
            datasets: [{
                data: [35, 17, 24, 10, 14],
                backgroundColor: [
                    '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'
                ],
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '75%',
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
};

window.updateChartTheme = (theme) => {
    if (!budgetVarChart || !budgetAllocChart) return;
    const isLight = theme === 'light';
    Chart.defaults.color = isLight ? '#64748b' : '#94a3b8';
    const gridColor = isLight ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)';
    
    budgetVarChart.options.scales.y.grid.color = gridColor;
    budgetVarChart.update();
    budgetAllocChart.update();
};

document.addEventListener('DOMContentLoaded', initBudgetCharts);
