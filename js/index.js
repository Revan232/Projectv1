// Admin login functionality
document.addEventListener('DOMContentLoaded', function() {
    // Inisialisasi sistem autentikasi
    const auth = new AuthSystem();
    
    // Tangani form login
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            const result = auth.login(username, password);
            
            if (result.success) {
                // Redirect ke dashboard jika login berhasil
                window.location.href = 'dashboard.html';
            } else {
                // Tampilkan pesan error
                alert(result.message);
            }
        });
    }
    
    // Cek apakah user sudah login
    const currentUser = sessionStorage.getItem('currentUser');
    
    // Jika user sudah login, ubah teks link admin menjadi "Dashboard"
    if (currentUser) {
        const adminLink = document.getElementById('admin-link');
    if (adminLink) {
            adminLink.textContent = 'Dashboard';
            adminLink.href = 'dashboard.html';
        }
    }
}); 