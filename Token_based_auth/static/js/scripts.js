document.addEventListener("DOMContentLoaded", function () {
    const csrfToken = getCookie('csrf_token');

    // Login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken
                },
                body: JSON.stringify({ email, password })
            })
            .then(response => response.json())
            .then(data => {
                if (data.access_token) {
                    // Store tokens in localStorage
                    localStorage.setItem('access_token', data.access_token);
                    localStorage.setItem('refresh_token', data.refresh_token);
                    // Redirect to profile page
                    window.location.href = 'profile.html';
                } else {
                    // Display error message
                    document.getElementById('message').innerText = data.message;
                }
            })
            .catch(error => console.error('Error:', error));
        });
    }

    // Register form submission
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken
                },
                body: JSON.stringify({ name, email, password })
            })
            .then(response => response.json())
            .then(data => {
                if (data.message === 'User registered successfully') {
                    // Redirect to login page
                    window.location.href = 'login.html';
                } else {
                    // Display error message
                    document.getElementById('message').innerText = data.message;
                }
            })
            .catch(error => console.error('Error:', error));
        });
    }

    // Load profile information
    const profileInfo = document.getElementById('profileInfo');
    if (profileInfo) {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            // Redirect to login page if no token
            window.location.href = 'login.html';
        } else {
            fetch('/profile', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'X-CSRF-Token': csrfToken
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.message === 'Token has expired' || data.message === 'Invalid token') {
                    // Redirect to login if token is invalid
                    window.location.href = 'login.html';
                } else {
                    // Display user info
                    profileInfo.innerHTML = `<p>Name: ${data.name}</p><p>Email: ${data.email}</p>`;
                }
            })
            .catch(error => console.error('Error:', error));
        }
    }

    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            // Clear tokens from localStorage and redirect to login
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            window.location.href = 'login.html';
        });
    }
});

// Helper function to get CSRF token from cookies
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}