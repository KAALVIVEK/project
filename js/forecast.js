
const initForecastCharts = () => {
    const isLight = document.body.classList.contains('light-theme');
    Chart.defaults.color = isLight ? '#64748b' : '#94a3b8';

    new Chart(document.getElementById('foreChart1'), {
        type: 'line',
        data: {
            labels: ['Q1', 'Q2', 'Q3', 'Q4 (Pred)', 'Q1 (Pred)', 'Q2 (Pred)'],
            datasets: [
                { label: 'Expected Trend', data: [100, 120, 130, 145, 160, 180], borderColor: '#8b5cf6', fill: false, tension: 0.4, borderDash: [5, 5] },
                { label: 'Optimistic Bound', data: [100, 120, 130, 155, 175, 200], backgroundColor: 'rgba(139, 92, 246, 0.1)', fill: '+1', pointRadius: 0, borderWidth: 0 },
                { label: 'Pessimistic Bound', data: [100, 120, 130, 135, 145, 150], backgroundColor: 'rgba(139, 92, 246, 0.1)', fill: false, pointRadius: 0, borderWidth: 0 }
            ]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
};
document.addEventListener('DOMContentLoaded', initForecastCharts);
