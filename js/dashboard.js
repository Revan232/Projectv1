// Fungsi untuk menampilkan modal
function showModal(modal) {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Mencegah scrolling saat modal terbuka
}

// Fungsi untuk menyembunyikan modal
function hideModal(modal) {
    modal.style.display = 'none';
    document.body.style.overflow = ''; // Mengembalikan scrolling
}

// Fungsi untuk menampilkan pesan error
function showError(message) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Error</h3>
            <div class="error-message">
                <p>${message}</p>
                <div class="form-actions">
                    <button class="admin-btn cancel-btn">Close</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    showModal(modal);

    // Handle cancel button
    const cancelBtn = modal.querySelector('.cancel-btn');
    cancelBtn.addEventListener('click', () => {
        hideModal(modal);
        modal.remove();
    });

    // Handle klik di luar modal
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            hideModal(modal);
            modal.remove();
        }
    });
}

// Fungsi untuk memuat statistik galeri
function loadGalleryStats() {
    // Dalam implementasi nyata, data ini akan diambil dari API atau database
    const stats = {
        totalImages: 15,
        pageViews: 1247,
        categories: 4,
        comments: 32
    };

    // Update statistik di dashboard
    document.querySelector('.dashboard-card:nth-child(1) .stat-number').textContent = stats.totalImages;
    document.querySelector('.dashboard-card:nth-child(2) .stat-number').textContent = stats.pageViews.toLocaleString();
    document.querySelector('.dashboard-card:nth-child(3) .stat-number').textContent = stats.categories;
    document.querySelector('.dashboard-card:nth-child(4) .stat-number').textContent = stats.comments;
}

// Fungsi untuk menangani tombol Manage System
function handleSystemManagement() {
    const systemBtn = document.querySelector('.admin-only .admin-tool-btn:nth-child(2)');
    if (!systemBtn) return;

    systemBtn.addEventListener('click', () => {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>System Management</h3>
                <div class="system-options">
                    <button class="admin-tool-item" id="systemSettings">
                        <i class="fas fa-cog"></i>
                        <span>System Settings</span>
                    </button>
                    <button class="admin-tool-item" id="systemLogs">
                        <i class="fas fa-clipboard-list"></i>
                        <span>System Logs</span>
                    </button>
                </div>
                <div class="form-actions">
                    <button class="admin-btn cancel-btn">Close</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        showModal(modal);

        // Handle system settings button
        const settingsBtn = modal.querySelector('#systemSettings');
        settingsBtn.addEventListener('click', () => {
            hideModal(modal);
            modal.remove();
            showSystemSettings();
        });

        // Handle system logs button
        const logsBtn = modal.querySelector('#systemLogs');
        logsBtn.addEventListener('click', () => {
            hideModal(modal);
            modal.remove();
            showSystemLogs();
        });

        // Handle cancel button
        const cancelBtn = modal.querySelector('.cancel-btn');
        cancelBtn.addEventListener('click', () => {
            hideModal(modal);
            modal.remove();
        });

        // Handle klik di luar modal
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                hideModal(modal);
                modal.remove();
            }
        });
    });
}

// Fungsi untuk menangani tombol Backup
function handleBackup() {
    const backupBtn = document.querySelector('.admin-only .admin-tool-btn:nth-child(3)');
    if (!backupBtn) return;

    backupBtn.addEventListener('click', () => {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>Database Backup</h3>
                <div class="backup-info">
                    <p>Last backup: <span id="lastBackupTime">Never</span></p>
                    <p>Backup size: <span id="backupSize">-</span></p>
                </div>
                <div class="form-actions">
                    <button class="admin-btn" id="startBackup">Start Backup</button>
                    <button class="admin-btn" id="downloadBackup">Download Last Backup</button>
                    <button class="admin-btn cancel-btn">Close</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        showModal(modal);

        // Handle start backup button
        const startBackupBtn = modal.querySelector('#startBackup');
        startBackupBtn.addEventListener('click', () => {
            // Implementasi backup database
            alert('Database backup started. You will receive a notification when it is complete.');
            hideModal(modal);
            modal.remove();
        });

        // Handle download backup button
        const downloadBackupBtn = modal.querySelector('#downloadBackup');
        downloadBackupBtn.addEventListener('click', () => {
            // Implementasi download backup
            alert('Backup downloaded successfully!');
        });

        // Handle cancel button
        const cancelBtn = modal.querySelector('.cancel-btn');
        cancelBtn.addEventListener('click', () => {
            hideModal(modal);
            modal.remove();
        });

        // Handle klik di luar modal
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                hideModal(modal);
                modal.remove();
            }
        });
    });
}

// Fungsi untuk memuat data user dan menampilkan informasi di dashboard
function loadUserInfo() {
    const currentUser = sessionStorage.getItem('currentUser');
    if (currentUser) {
        try {
            const userData = JSON.parse(currentUser);
            document.getElementById('dashboard-user-name').textContent = userData.username;
            document.getElementById('dashboard-user-role').textContent = userData.role;
            
            // Menampilkan/menyembunyikan tombol berdasarkan role
            const editorButtons = document.querySelectorAll('.editor-only');
            const adminButtons = document.querySelectorAll('.admin-only');
            
            if (userData.role === 'editor') {
                editorButtons.forEach(button => button.style.display = 'block');
                adminButtons.forEach(section => section.style.display = 'none');
            } else if (userData.role === 'admin') {
                editorButtons.forEach(button => button.style.display = 'block');
                adminButtons.forEach(section => section.style.display = 'block');
            } else {
                editorButtons.forEach(button => button.style.display = 'none');
                adminButtons.forEach(section => section.style.display = 'none');
            }
        } catch (error) {
            console.error('Error loading user info:', error);
            showError('Error loading user information. Please try again.');
            setTimeout(() => {
                window.location.href = '/Projectv1/pages/login.html';
            }, 2000);
        }
    } else {
        showError('You must be logged in to access this page.');
        setTimeout(() => {
            window.location.href = '/Projectv1/pages/login.html';
        }, 2000);
    }
}

// Fungsi untuk menangani upload gambar
function handleImageUpload() {
    const uploadBtn = document.querySelector('.admin-tool-btn:nth-child(1)');
    uploadBtn.addEventListener('click', () => {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>Upload New Image</h3>
                <form id="uploadForm">
                    <div class="form-group">
                        <label for="imageTitle">Title</label>
                        <input type="text" id="imageTitle" required>
                    </div>
                    <div class="form-group">
                        <label for="imageCategory">Category</label>
                        <select id="imageCategory" required>
                            <option value="landscape">Landscape</option>
                            <option value="portrait">Portrait</option>
                            <option value="nature">Nature</option>
                            <option value="urban">Urban</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="imageFile">Image File</label>
                        <input type="file" id="imageFile" accept="image/*" required>
                    </div>
                    <div class="form-group">
                        <label for="imageDescription">Description</label>
                        <textarea id="imageDescription" required></textarea>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="admin-btn">Upload</button>
                        <button type="button" class="admin-btn cancel-btn">Cancel</button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(modal);
        showModal(modal);

        // Handle form submission
        const form = modal.querySelector('#uploadForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            // Implementasi upload gambar
            alert('Image uploaded successfully!');
            hideModal(modal);
            modal.remove();
        });

        // Handle cancel button
        const cancelBtn = modal.querySelector('.cancel-btn');
        cancelBtn.addEventListener('click', () => {
            hideModal(modal);
            modal.remove();
        });

        // Handle klik di luar modal
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                hideModal(modal);
                modal.remove();
            }
        });
    });
}

// Fungsi untuk menangani edit kategori
function handleCategoryEdit() {
    const categoryBtn = document.querySelector('.admin-tool-btn:nth-child(2)');
    categoryBtn.addEventListener('click', () => {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>Edit Categories</h3>
                <div class="categories-list">
                    <div class="category-item">
                        <input type="text" value="Landscape">
                        <button class="admin-btn delete-btn">Delete</button>
                    </div>
                    <div class="category-item">
                        <input type="text" value="Portrait">
                        <button class="admin-btn delete-btn">Delete</button>
                    </div>
                    <div class="category-item">
                        <input type="text" value="Nature">
                        <button class="admin-btn delete-btn">Delete</button>
                    </div>
                    <div class="category-item">
                        <input type="text" value="Urban">
                        <button class="admin-btn delete-btn">Delete</button>
                    </div>
                </div>
                <div class="form-actions">
                    <button class="admin-btn" id="addCategory">Add Category</button>
                    <button class="admin-btn save-btn">Save Changes</button>
                    <button class="admin-btn cancel-btn">Cancel</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        showModal(modal);

        // Handle add category button
        const addBtn = modal.querySelector('#addCategory');
        addBtn.addEventListener('click', () => {
            const categoriesList = modal.querySelector('.categories-list');
            const newCategory = document.createElement('div');
            newCategory.className = 'category-item';
            newCategory.innerHTML = `
                <input type="text" placeholder="New Category">
                <button class="admin-btn delete-btn">Delete</button>
            `;
            categoriesList.appendChild(newCategory);
        });

        // Handle save button
        const saveBtn = modal.querySelector('.save-btn');
        saveBtn.addEventListener('click', () => {
            // Implementasi penyimpanan kategori
            alert('Categories updated successfully!');
            hideModal(modal);
            modal.remove();
        });

        // Handle cancel button
        const cancelBtn = modal.querySelector('.cancel-btn');
        cancelBtn.addEventListener('click', () => {
            hideModal(modal);
            modal.remove();
        });

        // Handle klik di luar modal
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                hideModal(modal);
                modal.remove();
            }
        });
    });
}

// Fungsi untuk menangani tombol Manage Comments
function handleCommentManagement() {
    const commentBtn = document.querySelector('.admin-gallery-tools .admin-tool-btn:nth-child(3)');
    console.log('Comment button:', commentBtn); // Debug log
    if (!commentBtn) return;

    commentBtn.addEventListener('click', () => {
        console.log('Comment button clicked'); // Debug log
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>Manage Comments</h3>
                <div class="comments-list">
                    <div class="comment-item">
                        <p class="comment-text">Great photo!</p>
                        <p class="comment-meta">By: John Doe - 2024-03-15</p>
                        <div class="comment-actions">
                            <button class="admin-btn approve-btn">Approve</button>
                            <button class="admin-btn delete-btn">Delete</button>
                        </div>
                    </div>
                    <!-- More comments will be loaded dynamically -->
                </div>
                <div class="form-actions">
                    <button class="admin-btn cancel-btn">Close</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        showModal(modal);

        // Handle cancel button
        const cancelBtn = modal.querySelector('.cancel-btn');
        cancelBtn.addEventListener('click', () => {
            hideModal(modal);
            modal.remove();
        });

        // Handle klik di luar modal
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                hideModal(modal);
                modal.remove();
            }
        });
    });
}

// Fungsi untuk menangani tombol Edit Profile
function handleProfileEdit() {
    const profileBtn = document.querySelector('.admin-gallery-tools .admin-tool-btn:nth-child(4)');
    console.log('Profile button:', profileBtn); // Debug log
    if (!profileBtn) return;

    profileBtn.addEventListener('click', () => {
        console.log('Profile button clicked'); // Debug log
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>Edit Profile</h3>
                <form id="profileForm">
                    <div class="form-group">
                        <label for="profileName">Name</label>
                        <input type="text" id="profileName" value="${currentUser.name}" required>
                    </div>
                    <div class="form-group">
                        <label for="profileEmail">Email</label>
                        <input type="email" id="profileEmail" value="${currentUser.email}" required>
                    </div>
                    <div class="form-group">
                        <label for="profilePassword">New Password</label>
                        <input type="password" id="profilePassword">
                    </div>
                    <div class="form-group">
                        <label for="profileConfirmPassword">Confirm New Password</label>
                        <input type="password" id="profileConfirmPassword">
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="admin-btn">Save Changes</button>
                        <button type="button" class="admin-btn cancel-btn">Cancel</button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(modal);
        showModal(modal);

        // Handle form submission
        const form = modal.querySelector('#profileForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            // Implementasi update profil
            alert('Profile updated successfully!');
            hideModal(modal);
            modal.remove();
        });

        // Handle cancel button
        const cancelBtn = modal.querySelector('.cancel-btn');
        cancelBtn.addEventListener('click', () => {
            hideModal(modal);
            modal.remove();
        });

        // Handle klik di luar modal
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                hideModal(modal);
                modal.remove();
            }
        });
    });
}

// Fungsi untuk menangani tombol Manage Users
function handleUserManagement() {
    const userBtn = document.querySelector('.admin-only .admin-tool-btn:nth-child(1)');
    if (!userBtn) return;

    userBtn.addEventListener('click', () => {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>User Management</h3>
                <div class="users-list">
                    <div class="user-item">
                        <div class="user-info">
                            <p>Username: admin</p>
                            <p>Role: Admin</p>
                            <p>Email: admin@example.com</p>
                        </div>
                        <div class="user-actions">
                            <button class="admin-btn edit-btn">Edit</button>
                            <button class="admin-btn delete-btn">Delete</button>
                        </div>
                    </div>
                    <!-- More users will be loaded dynamically -->
                </div>
                <div class="form-actions">
                    <button class="admin-btn" id="addUser">Add User</button>
                    <button class="admin-btn cancel-btn">Close</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        showModal(modal);

        // Handle add user button
        const addBtn = modal.querySelector('#addUser');
        addBtn.addEventListener('click', () => {
            const addUserModal = document.createElement('div');
            addUserModal.className = 'modal';
            addUserModal.innerHTML = `
                <div class="modal-content">
                    <h3>Add New User</h3>
                    <form id="addUserForm">
                        <div class="form-group">
                            <label for="newUsername">Username</label>
                            <input type="text" id="newUsername" required>
                        </div>
                        <div class="form-group">
                            <label for="newPassword">Password</label>
                            <input type="password" id="newPassword" required>
                        </div>
                        <div class="form-group">
                            <label for="newRole">Role</label>
                            <select id="newRole" required>
                                <option value="admin">Admin</option>
                                <option value="editor">Editor</option>
                                <option value="user">User</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="newEmail">Email</label>
                            <input type="email" id="newEmail" required>
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="admin-btn">Add User</button>
                            <button type="button" class="admin-btn cancel-btn">Cancel</button>
                        </div>
                    </form>
                </div>
            `;
            document.body.appendChild(addUserModal);
            showModal(addUserModal);

            // Handle form submission
            const form = addUserModal.querySelector('#addUserForm');
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                // Implementasi penambahan user
                alert('User added successfully!');
                hideModal(addUserModal);
                addUserModal.remove();
            });

            // Handle cancel button
            const cancelBtn = addUserModal.querySelector('.cancel-btn');
            cancelBtn.addEventListener('click', () => {
                hideModal(addUserModal);
                addUserModal.remove();
            });

            // Handle klik di luar modal
            addUserModal.addEventListener('click', (e) => {
                if (e.target === addUserModal) {
                    hideModal(addUserModal);
                    addUserModal.remove();
                }
            });
        });

        // Handle cancel button
        const cancelBtn = modal.querySelector('.cancel-btn');
        cancelBtn.addEventListener('click', () => {
            hideModal(modal);
            modal.remove();
        });

        // Handle klik di luar modal
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                hideModal(modal);
                modal.remove();
            }
        });
    });
}

// Fungsi untuk menangani pengaturan sistem (admin only)
function handleSystemSettings() {
    const settingsBtn = document.querySelector('.admin-tool-btn:nth-child(2)');
    settingsBtn.addEventListener('click', () => {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>System Settings</h3>
                <form id="settingsForm">
                    <div class="form-group">
                        <label for="siteTitle">Site Title</label>
                        <input type="text" id="siteTitle" value="Photography Gallery">
                    </div>
                    <div class="form-group">
                        <label for="siteDescription">Site Description</label>
                        <textarea id="siteDescription">A beautiful photography gallery website</textarea>
                    </div>
                    <div class="form-group">
                        <label for="maintenanceMode">Maintenance Mode</label>
                        <input type="checkbox" id="maintenanceMode">
                    </div>
                    <div class="form-group">
                        <label for="maxUploadSize">Maximum Upload Size (MB)</label>
                        <input type="number" id="maxUploadSize" value="5">
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="admin-btn">Save Settings</button>
                        <button type="button" class="admin-btn cancel-btn">Cancel</button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(modal);
        showModal(modal);

        // Handle form submission
        const form = modal.querySelector('#settingsForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            // Implementasi penyimpanan pengaturan
            alert('Settings saved successfully!');
            hideModal(modal);
            modal.remove();
        });

        // Handle cancel button
        const cancelBtn = modal.querySelector('.cancel-btn');
        cancelBtn.addEventListener('click', () => {
            hideModal(modal);
            modal.remove();
        });

        // Handle klik di luar modal
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                hideModal(modal);
                modal.remove();
            }
        });
    });
}

// Fungsi untuk menangani view logs (admin only)
function handleViewLogs() {
    const logsBtn = document.querySelector('.admin-tool-btn:nth-child(4)');
    logsBtn.addEventListener('click', () => {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>System Logs</h3>
                <div class="logs-container">
                    <pre>
2024-03-15 10:30:45 - User 'admin' logged in
2024-03-15 10:31:20 - New image uploaded by 'editor'
2024-03-15 10:32:15 - Comment added by 'user123'
                    </pre>
                </div>
                <div class="form-actions">
                    <button class="admin-btn download-btn">Download Logs</button>
                    <button class="admin-btn cancel-btn">Close</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        showModal(modal);

        // Handle download button
        const downloadBtn = modal.querySelector('.download-btn');
        downloadBtn.addEventListener('click', () => {
            // Implementasi download logs
            alert('Logs downloaded successfully!');
        });

        // Handle cancel button
        const cancelBtn = modal.querySelector('.cancel-btn');
        cancelBtn.addEventListener('click', () => {
            hideModal(modal);
            modal.remove();
        });

        // Handle klik di luar modal
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                hideModal(modal);
                modal.remove();
            }
        });
    });
}

// Fungsi untuk menangani tombol Logout
function handleLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    if (!logoutBtn) return;

    logoutBtn.addEventListener('click', () => {
        // Konfirmasi logout
        if (confirm('Are you sure you want to logout?')) {
            // Hapus data user dari session storage
            sessionStorage.removeItem('currentUser');
            // Redirect ke halaman login
            window.location.href = '../pages/login.html';
        }
    });
}

// Fungsi untuk menangani admin tools
function handleAdminTools() {
    const adminToolsBtn = document.querySelector('.admin-only .admin-tool-btn:nth-child(4)');
    if (!adminToolsBtn) return;

    adminToolsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>Admin Tools</h3>
                <div class="admin-tools-grid">
                    <button class="admin-tool-item" id="userManagement">
                        <i class="fas fa-users"></i>
                        <span>User Management</span>
                    </button>
                    <button class="admin-tool-item" id="systemLogs">
                        <i class="fas fa-clipboard-list"></i>
                        <span>System Logs</span>
                    </button>
                    <button class="admin-tool-item" id="settings">
                        <i class="fas fa-cog"></i>
                        <span>System Settings</span>
                    </button>
                </div>
                <div class="form-actions">
                    <button class="admin-btn cancel-btn">Close</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        showModal(modal);

        // Handle user management button
        const userManagementBtn = modal.querySelector('#userManagement');
        userManagementBtn.addEventListener('click', () => {
            hideModal(modal);
            modal.remove();
            showUserManagement();
        });

        // Handle system logs button
        const systemLogsBtn = modal.querySelector('#systemLogs');
        systemLogsBtn.addEventListener('click', () => {
            hideModal(modal);
            modal.remove();
            showSystemLogs();
        });

        // Handle settings button
        const settingsBtn = modal.querySelector('#settings');
        settingsBtn.addEventListener('click', () => {
            hideModal(modal);
            modal.remove();
            showSystemSettings();
        });

        // Handle cancel button
        const cancelBtn = modal.querySelector('.cancel-btn');
        cancelBtn.addEventListener('click', () => {
            hideModal(modal);
            modal.remove();
        });

        // Handle klik di luar modal
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                hideModal(modal);
                modal.remove();
            }
        });
    });
}

// Fungsi untuk menampilkan user management
function showUserManagement() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>User Management</h3>
            <div class="user-list">
                <div class="user-item">
                    <span class="username">admin</span>
                    <span class="role">Admin</span>
                    <div class="user-actions">
                        <button class="admin-btn edit-btn">Edit</button>
                        <button class="admin-btn delete-btn">Delete</button>
                    </div>
                </div>
                <!-- User items will be dynamically added here -->
            </div>
            <div class="form-actions">
                <button class="admin-btn" id="addUser">Add New User</button>
                <button class="admin-btn cancel-btn">Close</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    showModal(modal);

    // Handle add user button
    const addUserBtn = modal.querySelector('#addUser');
    addUserBtn.addEventListener('click', () => {
        showAddUserForm();
    });

    // Handle cancel button
    const cancelBtn = modal.querySelector('.cancel-btn');
    cancelBtn.addEventListener('click', () => {
        hideModal(modal);
        modal.remove();
    });

    // Handle klik di luar modal
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            hideModal(modal);
            modal.remove();
        }
    });
}

// Fungsi untuk menampilkan form tambah user
function showAddUserForm() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Add New User</h3>
            <form id="addUserForm">
                <div class="form-group">
                    <label for="username">Username</label>
                    <input type="text" id="username" required>
                </div>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" required>
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" required>
                </div>
                <div class="form-group">
                    <label for="role">Role</label>
                    <select id="role" required>
                        <option value="user">User</option>
                        <option value="editor">Editor</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <div class="form-actions">
                    <button type="submit" class="admin-btn">Add User</button>
                    <button type="button" class="admin-btn cancel-btn">Cancel</button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
    showModal(modal);

    // Handle form submission
    const form = modal.querySelector('#addUserForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        // Implementasi penambahan user
        alert('User added successfully!');
        hideModal(modal);
        modal.remove();
    });

    // Handle cancel button
    const cancelBtn = modal.querySelector('.cancel-btn');
    cancelBtn.addEventListener('click', () => {
        hideModal(modal);
        modal.remove();
    });

    // Handle klik di luar modal
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            hideModal(modal);
            modal.remove();
        }
    });
}

// Fungsi untuk menampilkan system logs
function showSystemLogs() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>System Logs</h3>
            <div class="logs-container">
                <div class="log-item">
                    <span class="log-time">2024-03-14 15:30:00</span>
                    <span class="log-type">INFO</span>
                    <span class="log-message">System backup completed successfully</span>
                </div>
                <!-- Log items will be dynamically added here -->
            </div>
            <div class="form-actions">
                <button class="admin-btn" id="exportLogs">Export Logs</button>
                <button class="admin-btn cancel-btn">Close</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    showModal(modal);

    // Handle export logs button
    const exportLogsBtn = modal.querySelector('#exportLogs');
    exportLogsBtn.addEventListener('click', () => {
        // Implementasi export logs
        alert('Logs exported successfully!');
    });

    // Handle cancel button
    const cancelBtn = modal.querySelector('.cancel-btn');
    cancelBtn.addEventListener('click', () => {
        hideModal(modal);
        modal.remove();
    });

    // Handle klik di luar modal
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            hideModal(modal);
            modal.remove();
        }
    });
}

// Fungsi untuk menampilkan system settings
function showSystemSettings() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>System Settings</h3>
            <form id="settingsForm">
                <div class="form-group">
                    <label for="siteName">Site Name</label>
                    <input type="text" id="siteName" value="Gallery Website">
                </div>
                <div class="form-group">
                    <label for="maintenanceMode">Maintenance Mode</label>
                    <input type="checkbox" id="maintenanceMode">
                </div>
                <div class="form-group">
                    <label for="maxUploadSize">Maximum Upload Size (MB)</label>
                    <input type="number" id="maxUploadSize" value="10">
                </div>
                <div class="form-actions">
                    <button type="submit" class="admin-btn">Save Settings</button>
                    <button type="button" class="admin-btn cancel-btn">Cancel</button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
    showModal(modal);

    // Handle form submission
    const form = modal.querySelector('#settingsForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        // Implementasi penyimpanan settings
        alert('Settings saved successfully!');
        hideModal(modal);
        modal.remove();
    });

    // Handle cancel button
    const cancelBtn = modal.querySelector('.cancel-btn');
    cancelBtn.addEventListener('click', () => {
        hideModal(modal);
        modal.remove();
    });

    // Handle klik di luar modal
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            hideModal(modal);
            modal.remove();
        }
    });
}

// Inisialisasi semua fungsi saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded'); // Debug log
    loadUserInfo();
    loadGalleryStats();
    handleImageUpload();
    handleCategoryEdit();
    handleCommentManagement();
    handleProfileEdit();
    handleUserManagement();
    handleSystemManagement();
    handleBackup();
    handleAdminTools();
    handleLogout();
}); 