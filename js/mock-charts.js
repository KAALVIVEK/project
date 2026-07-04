const initMockCharts = () => {
    const isLight = document.body.classList.contains('light-theme');
    Chart.defaults.color = isLight ? '#64748b' : '#94a3b8';
    Chart.defaults.font.family = "'Outfit', sans-serif";
    const gridColor = isLight ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)';
    document.querySelectorAll('.mock-line-chart').forEach((canvas, index) => {
        new Chart(canvas, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                datasets: [{
                    label: 'Trend Metric ' + (index + 1),
                    data: Array.from({length: 7}, () => Math.floor(Math.random() * 50) + 20),
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { grid: { color: gridColor } },
                    x: { grid: { display: false } }
                }
            }
        });
    });
    document.querySelectorAll('.mock-bar-chart').forEach((canvas, index) => {
        new Chart(canvas, {
            type: 'bar',
            data: {
                labels: ['Category A', 'Category B', 'Category C', 'Category D', 'Category E'],
                datasets: [{
                    label: 'Distribution ' + (index + 1),
                    data: Array.from({length: 5}, () => Math.floor(Math.random() * 100) + 10),
                    backgroundColor: ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { grid: { color: gridColor } },
                    x: { grid: { display: false } }
                }
            }
        });
    });
};
document.addEventListener('DOMContentLoaded', initMockCharts);
