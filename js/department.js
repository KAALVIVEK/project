
const initDeptCharts = () => {
    const isLight = document.body.classList.contains('light-theme');
    Chart.defaults.color = isLight ? '#64748b' : '#94a3b8';

    new Chart(document.getElementById('deptChart1'), {
        type: 'bar',
        data: {
            labels: ['Engineering', 'Marketing', 'Sales', 'HR'],
            datasets: [
                { label: 'Budget', data: [500, 300, 400, 150], backgroundColor: 'rgba(148, 163, 184, 0.4)' },
                { label: 'Actual', data: [480, 320, 390, 145], backgroundColor: '#3b82f6' }
            ]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });

    new Chart(document.getElementById('deptChart2'), {
        type: 'pie',
        data: {
            labels: ['Salaries', 'Software', 'Travel', 'Facilities'],
            datasets: [{ data: [60, 20, 10, 10], backgroundColor: ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'] }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
};
document.addEventListener('DOMContentLoaded', initDeptCharts);
