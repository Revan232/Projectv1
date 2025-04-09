document.addEventListener('DOMContentLoaded', function() {
    // Inisialisasi sistem autentikasi
    const auth = new AuthSystem();
    
    // Cek apakah user sudah login
    if (!auth.isLoggedIn()) {
        // Redirect ke halaman login jika belum login
        window.location.href = 'login.html';
        return;
    }
    
    // Update informasi user di dashboard
    const userNameElement = document.getElementById('dashboard-user-name');
    const userRoleElement = document.getElementById('dashboard-user-role');
    
    if (userNameElement && userRoleElement && auth.currentUser) {
        userNameElement.textContent = auth.currentUser.name;
        userRoleElement.textContent = auth.currentUser.role;
    }
    
    // Set visibility berdasarkan role
    const adminOnlyElements = document.querySelectorAll('.admin-only');
    const editorOnlyElements = document.querySelectorAll('.editor-only');
    
    if (auth.isAdmin()) {
        // Admin dapat melihat semua elemen
        adminOnlyElements.forEach(el => el.style.display = 'block');
        editorOnlyElements.forEach(el => el.style.display = 'block');
    } else if (auth.isEditor()) {
        // Editor hanya dapat melihat elemen editor
        adminOnlyElements.forEach(el => el.style.display = 'none');
        editorOnlyElements.forEach(el => el.style.display = 'block');
    } else {
        // User biasa tidak dapat melihat elemen admin/editor
        adminOnlyElements.forEach(el => el.style.display = 'none');
        editorOnlyElements.forEach(el => el.style.display = 'none');
    }
    
    // Handle logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            // Gunakan sistem autentikasi untuk logout
            auth.logout();
            
            // Redirect ke halaman login
            window.location.href = 'login.html';
        });
    }
    
    // Handle tool buttons
    const toolButtons = document.querySelectorAll('.admin-tool-btn');
    toolButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.textContent;
            alert(`${action} functionality will be implemented soon.`);
        });
    });
    
    // Log untuk debugging
    console.log('Dashboard loaded for user:', auth.currentUser);
    console.log('Is admin:', auth.isAdmin());
    console.log('Is editor:', auth.isEditor());
}); 