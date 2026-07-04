let budgetChartInstance = null;
let expenseTypeChartInstance = null;

const initExpenseCharts = async () => {
    const budgetCtx = document.getElementById('budgetChart');
    const expenseTypeCtx = document.getElementById('expenseTypeChart');
    
    if (!budgetCtx || !expenseTypeCtx) return;

    const isLight = document.body.classList.contains('light-theme');
    Chart.defaults.color = isLight ? '#64748b' : '#94a3b8';
    Chart.defaults.font.family = "'Outfit', sans-serif";
    const gridColor = isLight ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)';

    try {
        const filters = window.getFilters();
        const params = new URLSearchParams(filters).toString();
        const response = await fetch('api/get_expense_data.php?' + params);
        const data = await response.json();
        window.applyCurrencyConversion(data);

        if (data.success) {
            const kpiValues = document.querySelectorAll('.kpi-value');
            if (kpiValues.length >= 4) {
                kpiValues[0].innerText = window.formatDynamicCurrency(data.kpis.totalBudget);
                kpiValues[1].innerText = window.formatDynamicCurrency(data.kpis.actualSpend);
                kpiValues[2].innerText = window.formatDynamicCurrency(data.kpis.varianceAmount);
                kpiValues[3].innerText = data.kpis.opexRatio + '%';
            }

            if (budgetChartInstance) budgetChartInstance.destroy();
            budgetChartInstance = new Chart(budgetCtx, {
                type: 'bar',
                data: {
                    labels: data.charts.budget.labels,
                    datasets: [
                        {
                            label: 'Actual Spend',
                            data: data.charts.budget.actual,
                            backgroundColor: 'rgba(99, 102, 241, 0.8)',
                            borderRadius: 4
                        },
                        {
                            label: 'Budget Allocated',
                            data: data.charts.budget.budget,
                            backgroundColor: 'rgba(203, 213, 225, 0.2)',
                            borderColor: '#cbd5e1',
                            borderWidth: 1,
                            borderRadius: 4
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: { y: { grid: { color: gridColor } }, x: { grid: { display: false } } }
                }
            });

            // Reusing a Doughnut to mock a TreeMap/Pie
            if (expenseTypeChartInstance) expenseTypeChartInstance.destroy();
            expenseTypeChartInstance = new Chart(expenseTypeCtx, {
                type: 'doughnut',
                data: {
                    labels: data.charts.expenseType.labels,
                    datasets: [{
                        data: data.charts.expenseType.data,
                        backgroundColor: ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'],
                        borderWidth: 0,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '60%'
                }
            });

            // Populate table if it exists
            const tbody = document.querySelector('tbody');
            if (tbody && data.table) {
                tbody.innerHTML = data.table.map(row => `
                    <tr>
                        <td>${row.Vendor}</td>
                        <td>${row.Department}</td>
                        <td>${row.Type}</td>
                        <td style="font-weight: 600;">${window.formatDynamicCurrency(row.Amount)}</td>
                        <td>${row.Date}</td>
                    </tr>
                `).join('');
            }
        }
    } catch (err) {
        console.error("Failed to load expense data:", err);
    }
};

document.addEventListener('DOMContentLoaded', initExpenseCharts);

const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        setTimeout(() => {
            const isLight = document.body.classList.contains('light-theme');
            const newColor = isLight ? '#64748b' : '#94a3b8';
            const newGridColor = isLight ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)';
            
            Chart.defaults.color = newColor;
            
            if (budgetChartInstance) {
                budgetChartInstance.options.scales.y.grid.color = newGridColor;
                budgetChartInstance.update();
            }
            if (expenseTypeChartInstance) {
                expenseTypeChartInstance.update();
            }
        }, 100);
    });
}

window.addEventListener('filtersChanged', initExpenseCharts);
