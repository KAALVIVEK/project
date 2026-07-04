
const initRiskCharts = () => {
    const isLight = document.body.classList.contains('light-theme');
    Chart.defaults.color = isLight ? '#64748b' : '#94a3b8';

    new Chart(document.getElementById('riskChart1'), {
        type: 'bubble',
        data: {
            datasets: [{
                label: 'Risk Matrix (Impact vs Probability)',
                data: [{x: 2, y: 3, r: 15}, {x: 4, y: 4, r: 25}, {x: 1, y: 2, r: 10}, {x: 5, y: 1, r: 20}, {x: 3, y: 5, r: 30}],
                backgroundColor: 'rgba(239, 68, 68, 0.6)'
            }]
        },
        options: { responsive: true, maintainAspectRatio: false, scales: { x: { max: 5 }, y: { max: 5 } } }
    });

    new Chart(document.getElementById('riskChart2'), {
        type: 'doughnut',
        data: {
            labels: ['Compliant', 'Non-Compliant'],
            datasets: [{ data: [94, 6], backgroundColor: ['#10b981', '#ef4444'], circumference: 180, rotation: 270 }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
};
document.addEventListener('DOMContentLoaded', initRiskCharts);
