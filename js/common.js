const themeToggleBtn = document.getElementById('theme-toggle');
if (themeToggleBtn) {
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'light') {
        document.body.classList.add('light-theme');
        themeToggleBtn.innerHTML = "<i class='bx bx-sun'></i>";
    }
    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        let theme = 'dark';
        if (document.body.classList.contains('light-theme')) {
            theme = 'light';
            themeToggleBtn.innerHTML = "<i class='bx bx-sun'></i>";
        } else {
            themeToggleBtn.innerHTML = "<i class='bx bx-moon'></i>";
        }
        localStorage.setItem('theme', theme);
        if (typeof updateChartTheme === 'function') {
            updateChartTheme(theme);
        }
    });
}
const updateISTTime = () => {
    const timeElement = document.getElementById('ist-time');
    if (!timeElement) return;
    const options = {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    };
    const formatter = new Intl.DateTimeFormat('en-IN', options);
    const timeString = formatter.format(new Date());
    timeElement.innerHTML = `<i class='bx bx-time-five'></i> <span>IST: ${timeString}</span>`;
};
setInterval(updateISTTime, 1000);
updateISTTime();
const setupSidebar = () => {
    const navItems = document.querySelectorAll('.nav-item');
    if (!navItems.length) return;
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const linkText = item.querySelector('span').innerText.trim();
            if(linkText === 'Logout') {
                window.location.href = 'index.html';
                return;
            }
            const routes = {
                'Executive Summary': 'dashboard.html',
                'Revenue Dashboard': 'revenue-sales.html',
                'Expense Dashboard': 'expense-budget.html',
                'Profitability': 'profitability.html',
                'Cash Flow': 'cash-flow.html',
                'Budget & Planning': 'budget.html',
                'Balance Sheet': 'balance-sheet.html',
                'Income Statement': 'income-statement.html',
                'Transaction Explorer': 'transactions.html',
                'Customer Finance': 'customer-finance.html',
                'Product Finance': 'product-finance.html',
                'Department Performance': 'department-performance.html',
                'Forecast Dashboard': 'forecast.html',
                'Risk Dashboard': 'risk.html',
                'Settings': 'settings.html'
            };
            if(routes[linkText]) {
                window.location.href = routes[linkText];
            }
        });
    });
    const filterBtn = document.getElementById('btn-apply-filters');
    if(filterBtn) {
        filterBtn.addEventListener('click', () => {
            const originalText = filterBtn.innerHTML;
            filterBtn.innerHTML = "<i class='bx bx-loader-alt bx-spin'></i> Applying...";
            filterBtn.style.opacity = '0.8';
            filterBtn.disabled = true;
            
            // Dispatch event so dashboards can reload data
            window.dispatchEvent(new Event('filtersChanged'));

            setTimeout(() => {
                filterBtn.innerHTML = "<i class='bx bx-check'></i> Applied";
                filterBtn.style.background = 'var(--success)';
                setTimeout(() => {
                    filterBtn.innerHTML = originalText;
                    filterBtn.style.background = '';
                    filterBtn.style.opacity = '1';
                    filterBtn.disabled = false;
                }, 2000);
            }, 500); // reduced timeout for snappier feel
        });
    }

    const mobileToggle = document.querySelector('.mobile-toggle');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    if (mobileToggle && sidebar && overlay) {
        const toggleSidebar = () => {
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
        };
        mobileToggle.addEventListener('click', toggleSidebar);
        overlay.addEventListener('click', toggleSidebar);
    }

    // Set user profile info from localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
        try {
            const user = JSON.parse(userStr);
            if (user && user.full_name) {
                const nameSpan = document.querySelector('.user-profile span');
                const avatarDiv = document.querySelector('.user-profile .avatar');
                if (nameSpan) {
                    nameSpan.innerText = user.full_name;
                }
                if (avatarDiv) {
                    avatarDiv.innerText = user.full_name.charAt(0).toUpperCase();
                }
            }
        } catch (e) {
            console.error("Error parsing user data", e);
        }
    }
};
document.addEventListener('DOMContentLoaded', setupSidebar);

// Global helpers
window.getFilters = () => {
    return {
        date: document.getElementById('filter-date')?.value || 'all',
        region: document.getElementById('filter-region')?.value || '',
        department: document.getElementById('filter-department')?.value || '',
        product: document.getElementById('filter-product')?.value || '',
        currency: document.getElementById('filter-currency')?.value || 'USD'
    };
};

window.formatDynamicCurrency = (value) => {
    const currency = window.getFilters().currency;
    if (currency === 'INR') {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
    } else if (currency === 'EUR') {
        return new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);
    } else if (currency === 'GBP') {
        return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(value);
    } else {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
    }
};

window.applyCurrencyConversion = (data) => {
    const currency = window.getFilters().currency;
    let rate = 1;
    if (currency === 'INR') rate = 83.5;
    else if (currency === 'EUR') rate = 0.92;
    else if (currency === 'GBP') rate = 0.79;
    
    if (rate === 1) return data;
    
    const traverse = (obj) => {
        for (let key in obj) {
            if (typeof obj[key] === 'number') {
                const skipKeys = ['id', 'activeCustomers', 'unitsSold', 'retentionRate', 'margin', 'impact_score', 'probability_score'];
                if (!skipKeys.includes(key) && !key.toLowerCase().includes('score')) {
                     obj[key] = obj[key] * rate;
                }
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                traverse(obj[key]);
            }
        }
    };
    if (data.kpis) traverse(data.kpis);
    if (data.charts) traverse(data.charts);
    if (data.mainChart) traverse(data.mainChart);
    if (data.donutChart) traverse(data.donutChart);
    return data;
};

window.getCurrencySymbol = () => {
    const currency = window.getFilters().currency;
    if (currency === 'INR') return '₹';
    if (currency === 'EUR') return '€';
    if (currency === 'GBP') return '£';
    return '$';
};
