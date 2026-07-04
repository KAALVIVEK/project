
const initProductCharts = () => {
    const isLight = document.body.classList.contains('light-theme');
    Chart.defaults.color = isLight ? '#64748b' : '#94a3b8';

    new Chart(document.getElementById('prodChart1'), {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Product Margins vs Volume',
                data: [{x: 100, y: 40}, {x: 200, y: 30}, {x: 50, y: 60}, {x: 300, y: 20}, {x: 150, y: 50}],
                backgroundColor: '#10b981'
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });

    new Chart(document.getElementById('prodChart2'), {
        type: 'polarArea',
        data: {
            labels: ['Software', 'Hardware', 'Services', 'Consulting'],
            datasets: [{ data: [40, 25, 20, 15], backgroundColor: ['rgba(59,130,246,0.6)', 'rgba(139,92,246,0.6)', 'rgba(16,185,129,0.6)', 'rgba(245,158,11,0.6)'] }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
};
document.addEventListener('DOMContentLoaded', initProductCharts);
