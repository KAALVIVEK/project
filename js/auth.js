const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const btn = this.querySelector('button');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i>';
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        try {
            const formData = new FormData();
            formData.append('email', email);
            formData.append('password', password);
            const res = await fetch('api/login.php', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            if (data.success) {
                localStorage.setItem('user', JSON.stringify(data.user));
                window.location.href = 'dashboard.html';
            } else {
                alert(data.message || 'Login failed');
                btn.innerHTML = originalText;
            }
        } catch (err) {
            console.error('Login error:', err);
            alert('A server error occurred. Ensure your database is connected.');
            btn.innerHTML = originalText;
        }
    });
}
if (signupForm) {
    signupForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const btn = this.querySelector('button');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i>';
        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        try {
            const formData = new FormData();
            formData.append('fullName', fullName);
            formData.append('email', email);
            formData.append('password', password);
            const res = await fetch('api/signup.php', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            if (data.success) {
                alert('Account created successfully! Please log in.');
                window.location.href = 'index.html';
            } else {
                alert(data.message || 'Signup failed');
                btn.innerHTML = originalText;
            }
        } catch (err) {
            console.error('Signup error:', err);
            alert('A server error occurred. Ensure your database is connected.');
            btn.innerHTML = originalText;
        }
    });
}
