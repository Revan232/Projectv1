// Fungsi untuk menangani loading komponen
function loadComponent(elementId, componentPath) {
    fetch(componentPath)
        .then(response => response.text())
        .then(data => {
            document.getElementById(elementId).innerHTML = data;
        })
        .catch(error => console.error(`Error loading component ${componentPath}:`, error));
}

// Fungsi untuk menangani navigasi
function navigateTo(path) {
    window.location.href = path;
}

// Event listener saat DOM sudah dimuat
document.addEventListener('DOMContentLoaded', () => {
    // Inisialisasi komponen yang perlu dimuat
    loadComponent('navbar-container', 'components/navbar.html');
    
    // Event listener untuk tombol logout
    document.addEventListener('click', (e) => {
        if (e.target && e.target.id === 'logout-btn') {
            auth.logout();
            navigateTo('index.html');
        }
    });
}); 