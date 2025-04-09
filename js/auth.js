// Sistem autentikasi dan role pengguna
class AuthSystem {
    constructor() {
        // Data pengguna (dalam aplikasi nyata, ini akan disimpan di database)
        this.users = [
            {
                id: 1,
                username: 'admin',
                password: 'password123',
                role: 'admin',
                name: 'Administrator',
                email: 'admin@example.com'
            },
            {
                id: 2,
                username: 'editor',
                password: 'editor123',
                role: 'editor',
                name: 'Content Editor',
                email: 'editor@example.com'
            },
            {
                id: 3,
                username: 'user',
                password: 'user123',
                role: 'user',
                name: 'Regular User',
                email: 'user@example.com'
            }
        ];
        
        // Status login saat ini
        this.currentUser = null;
        
        // Cek apakah ada sesi yang tersimpan
        this.checkSession();
    }
    
    // Cek apakah ada sesi yang tersimpan di sessionStorage
    checkSession() {
        const savedUser = sessionStorage.getItem('currentUser');
        if (savedUser) {
            try {
                const userData = JSON.parse(savedUser);
                // Validasi data user yang tersimpan
                if (this.validateUserData(userData)) {
                    // Pastikan semua properti yang diperlukan ada
                    const userInfo = { 
                        id: userData.id,
                        username: userData.username,
                        role: userData.role,
                        name: userData.name,
                        email: userData.email
                    };
                    
                    this.currentUser = userInfo;
                    this.updateUIForLoggedInUser();
                } else {
                    // Jika data tidak valid, hapus sesi
                    this.logout();
                }
            } catch (error) {
                // Jika ada error parsing JSON, hapus sesi
                console.error('Error parsing session data:', error);
                this.logout();
            }
        }
    }
    
    // Validasi data user
    validateUserData(userData) {
        // Cek apakah semua properti yang diperlukan ada
        if (!userData || 
            typeof userData.id !== 'number' || 
            typeof userData.username !== 'string' || 
            typeof userData.role !== 'string' ||
            typeof userData.name !== 'string' ||
            typeof userData.email !== 'string') {
            return false;
        }
        
        // Cek apakah role valid
        const validRoles = ['admin', 'editor', 'user'];
        if (!validRoles.includes(userData.role)) {
            return false;
        }
        
        // Cek apakah user ada di database
        const userExists = this.users.find(u => u.id === userData.id && 
                                              u.username === userData.username && 
                                              u.role === userData.role);
        return !!userExists;
    }
    
    // Login pengguna
    login(username, password) {
        // Jika sudah login, cek apakah mencoba login dengan akun berbeda
        if (this.currentUser && this.currentUser.username !== username) {
            return { 
                success: false, 
                message: 'Anda sudah login dengan akun lain. Silakan logout terlebih dahulu.' 
            };
        }
        
        const user = this.users.find(u => u.username === username && u.password === password);
        
        if (user) {
            // Simpan informasi pengguna (tanpa password)
            const userInfo = { 
                id: user.id,
                username: user.username,
                role: user.role,
                name: user.name,
                email: user.email
            };
            
            this.currentUser = userInfo;
            
            // Simpan sesi di sessionStorage
            sessionStorage.setItem('currentUser', JSON.stringify(userInfo));
            
            // Update UI
            this.updateUIForLoggedInUser();
            
            return { success: true, user: userInfo };
        } else {
            return { success: false, message: 'Username atau password salah' };
        }
    }
    
    // Logout pengguna
    logout() {
        // Hapus data pengguna
        this.currentUser = null;
        
        // Hapus sesi dari sessionStorage
        sessionStorage.removeItem('currentUser');
        
        // Update UI
        this.updateUIForLoggedOutUser();
        
        // Log untuk debugging
        console.log('User logged out successfully');
    }
    
    // Cek apakah pengguna sudah login
    isLoggedIn() {
        return this.currentUser !== null && 
               typeof this.currentUser === 'object' && 
               this.currentUser.id && 
               this.currentUser.username && 
               this.currentUser.role;
    }
    
    // Cek role pengguna
    hasRole(role) {
        return this.isLoggedIn() && 
               this.currentUser.role === role;
    }
    
    // Cek apakah pengguna adalah admin
    isAdmin() {
        return this.hasRole('admin');
    }
    
    // Cek apakah pengguna adalah editor
    isEditor() {
        return this.hasRole('editor');
    }
    
    // Update UI berdasarkan status login
    updateUIForLoggedInUser() {
        // Sembunyikan form login
        const adminLogin = document.getElementById('admin');
        if (adminLogin) adminLogin.style.display = 'none';
        
        // Tampilkan dashboard
        const adminDashboard = document.getElementById('admin-dashboard');
        if (adminDashboard) {
            adminDashboard.style.display = 'block';
            
            // Update informasi pengguna di dashboard
            const userNameElement = document.getElementById('dashboard-user-name');
            if (userNameElement && this.currentUser) {
                userNameElement.textContent = this.currentUser.name;
            }
            
            const userRoleElement = document.getElementById('dashboard-user-role');
            if (userRoleElement && this.currentUser) {
                userRoleElement.textContent = this.currentUser.role;
            }
        }
        
        // Sembunyikan bagian about pengguna
        const userAbout = document.getElementById('user-about');
        if (userAbout) userAbout.style.display = 'none';
        
        // Update tombol login/logout di navbar
        this.updateNavbarButtons();
        
        // Tampilkan/sembunyikan elemen berdasarkan role
        this.updateUIByRole();
        
        // Log untuk debugging
        console.log('User logged in:', this.currentUser);
        console.log('Is admin:', this.isAdmin());
        console.log('Is editor:', this.isEditor());
    }
    
    // Update UI saat logout
    updateUIForLoggedOutUser() {
        // Tampilkan form login
        const adminLogin = document.getElementById('admin');
        if (adminLogin) adminLogin.style.display = 'block';
        
        // Sembunyikan dashboard
        const adminDashboard = document.getElementById('admin-dashboard');
        if (adminDashboard) adminDashboard.style.display = 'none';
        
        // Tampilkan bagian about pengguna
        const userAbout = document.getElementById('user-about');
        if (userAbout) userAbout.style.display = 'block';
        
        // Update tombol login/logout di navbar
        this.updateNavbarButtons();
        
        // Sembunyikan elemen khusus admin/editor
        const adminOnlyElements = document.querySelectorAll('.admin-only');
        const editorOnlyElements = document.querySelectorAll('.editor-only');
        
        adminOnlyElements.forEach(el => el.style.display = 'none');
        editorOnlyElements.forEach(el => el.style.display = 'none');
        
        // Log untuk debugging
        console.log('User logged out');
    }
    
    // Update tombol di navbar
    updateNavbarButtons() {
        const adminLink = document.getElementById('admin-link');
        const logoutBtn = document.getElementById('logout-btn');
        
        if (adminLink) {
            if (this.isLoggedIn()) {
                adminLink.textContent = 'Dashboard';
                adminLink.href = '#admin-dashboard';
                
                // Tampilkan tombol logout
                if (logoutBtn) {
                    logoutBtn.style.display = 'block';
                    logoutBtn.onclick = () => this.logout();
                }
            } else {
                adminLink.textContent = 'Admin';
                adminLink.href = '#admin';
                
                // Sembunyikan tombol logout
                if (logoutBtn) {
                    logoutBtn.style.display = 'none';
                }
            }
        }
    }
    
    // Update UI berdasarkan role pengguna
    updateUIByRole() {
        const adminOnlyElements = document.querySelectorAll('.admin-only');
        const editorOnlyElements = document.querySelectorAll('.editor-only');
        
        if (this.isAdmin()) {
            // Admin dapat melihat semua elemen
            adminOnlyElements.forEach(el => el.style.display = 'block');
            editorOnlyElements.forEach(el => el.style.display = 'block');
        } else if (this.isEditor()) {
            // Editor hanya dapat melihat elemen editor
            adminOnlyElements.forEach(el => el.style.display = 'none');
            editorOnlyElements.forEach(el => el.style.display = 'block');
        } else {
            // User biasa tidak dapat melihat elemen admin/editor
            adminOnlyElements.forEach(el => el.style.display = 'none');
            editorOnlyElements.forEach(el => el.style.display = 'none');
        }
    }
    
    // Tampilkan elemen khusus admin
    showAdminElements() {
        const adminOnlyElements = document.querySelectorAll('.admin-only');
        const editorOnlyElements = document.querySelectorAll('.editor-only');
        
        // Admin dapat melihat semua elemen
        adminOnlyElements.forEach(el => el.style.display = 'block');
        editorOnlyElements.forEach(el => el.style.display = 'block');
        
        // Log untuk debugging
        console.log('Admin elements shown');
    }
    
    // Tampilkan elemen khusus editor
    showEditorElements() {
        const adminOnlyElements = document.querySelectorAll('.admin-only');
        const editorOnlyElements = document.querySelectorAll('.editor-only');
        
        // Editor hanya dapat melihat elemen editor
        adminOnlyElements.forEach(el => el.style.display = 'none');
        editorOnlyElements.forEach(el => el.style.display = 'block');
        
        // Log untuk debugging
        console.log('Editor elements shown');
    }
    
    // Sembunyikan elemen admin/editor
    hideAdminElements() {
        const adminOnlyElements = document.querySelectorAll('.admin-only');
        const editorOnlyElements = document.querySelectorAll('.editor-only');
        
        // Sembunyikan semua elemen admin/editor
        adminOnlyElements.forEach(el => el.style.display = 'none');
        editorOnlyElements.forEach(el => el.style.display = 'none');
        
        // Log untuk debugging
        console.log('Admin/Editor elements hidden');
    }
}

// Inisialisasi sistem autentikasi
const auth = new AuthSystem();

// Event listener untuk form login
document.addEventListener('DOMContentLoaded', () => {
    // Elemen-elemen DOM
    const loginTab = document.getElementById('loginTab');
    const signupTab = document.getElementById('signupTab');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const passwordInput = document.getElementById('password');
    const passwordStrength = document.getElementById('passwordStrength');
    const termsCheckbox = document.getElementById('terms');

    // Fungsi untuk beralih antara tab login dan signup
    function switchTab(activeTab, activeForm, inactiveTab, inactiveForm) {
        activeTab.classList.add('active');
        inactiveTab.classList.remove('active');
        activeForm.style.display = 'block';
        inactiveForm.style.display = 'none';
    }

    // Event listener untuk tab
    if (loginTab && signupTab && loginForm && signupForm) {
        loginTab.addEventListener('click', () => {
            switchTab(loginTab, loginForm, signupTab, signupForm);
        });

        signupTab.addEventListener('click', () => {
            switchTab(signupTab, signupForm, loginTab, loginForm);
        });
    }

    // Validasi kekuatan password
    function checkPasswordStrength(password) {
        let strength = 0;
        const feedback = [];

        if (password.length >= 8) strength++;
        else feedback.push('Minimal 8 karakter');

        if (password.match(/[A-Z]/)) strength++;
        else feedback.push('Minimal 1 huruf kapital');

        if (password.match(/[0-9]/)) strength++;
        else feedback.push('Minimal 1 angka');

        if (password.match(/[^A-Za-z0-9]/)) strength++;
        else feedback.push('Minimal 1 karakter khusus');

        return {
            score: strength,
            feedback: feedback.join(', ')
        };
    }

    // Event listener untuk input password
    if (passwordInput && passwordStrength) {
        passwordInput.addEventListener('input', (e) => {
            const result = checkPasswordStrength(e.target.value);
            const strengthText = ['Sangat Lemah', 'Lemah', 'Sedang', 'Kuat', 'Sangat Kuat'];
            const strengthColor = ['#ff4444', '#ffbb33', '#ffeb3b', '#00C851', '#007E33'];
            
            passwordStrength.textContent = `Kekuatan: ${strengthText[result.score - 1]}`;
            passwordStrength.style.color = strengthColor[result.score - 1];
            
            if (result.feedback) {
                passwordStrength.textContent += ` (${result.feedback})`;
            }
        });
    }

    // Validasi form login
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;

            if (!username || !password) {
                alert('Mohon isi semua field');
                return;
            }

            // Gunakan sistem autentikasi untuk login
            const result = auth.login(username, password);
            
            if (result.success) {
                // Redirect ke dashboard jika login berhasil
                window.location.href = 'dashboard.html';
            } else {
                // Tampilkan pesan error
                alert(result.message || 'Username atau password salah');
            }
        });
    }

    // Validasi form signup
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('signupUsername').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const role = document.getElementById('role').value;

            // Validasi input
            if (!username || !email || !password || !confirmPassword || !role) {
                alert('Mohon isi semua field');
                return;
            }

            if (password !== confirmPassword) {
                alert('Password tidak cocok');
                return;
            }

            if (!termsCheckbox.checked) {
                alert('Anda harus menyetujui syarat dan ketentuan');
                return;
            }

            const strength = checkPasswordStrength(password);
            if (strength.score < 3) {
                alert('Password terlalu lemah. Mohon gunakan password yang lebih kuat');
                return;
            }

            // Di sini Anda bisa menambahkan logika pendaftaran
            console.log('Signup attempt:', { username, email, password, role });
        });
    }
}); 