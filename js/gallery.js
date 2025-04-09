// Sample data - in a real application, this would come from a database
let photos = [
    {
        id: 1,
        title: "Mountain Vista",
        category: "landscape",
        description: "Captured during sunrise in the Alps",
        url: "https://source.unsplash.com/random/800x600/?landscape"
    },
    {
        id: 2,
        title: "Coastal Cliffs",
        category: "landscape",
        description: "Dramatic coastline at sunset",
        url: "https://source.unsplash.com/random/800x600/?mountain"
    },
    {
        id: 3,
        title: "Urban Portrait",
        category: "portrait",
        description: "Street photography in the city",
        url: "https://source.unsplash.com/random/800x600/?portrait"
    },
    {
        id: 4,
        title: "Studio Portrait",
        category: "portrait",
        description: "Professional studio lighting setup",
        url: "https://source.unsplash.com/random/800x600/?person"
    },
    {
        id: 5,
        title: "City Life",
        category: "street",
        description: "Capturing urban moments",
        url: "https://source.unsplash.com/random/800x600/?street"
    },
    {
        id: 6,
        title: "Night City",
        category: "street",
        description: "Urban night photography",
        url: "https://source.unsplash.com/random/800x600/?city"
    },
    {
        id: 7,
        title: "Forest Path",
        category: "nature",
        description: "Morning light through trees",
        url: "https://source.unsplash.com/random/800x600/?nature"
    },
    {
        id: 8,
        title: "Wildlife",
        category: "nature",
        description: "Capturing animals in their natural habitat",
        url: "https://source.unsplash.com/random/800x600/?wildlife"
    }
];

// DOM Elements
const galleryContainer = document.getElementById('gallery-container');
const modal = document.getElementById('photo-modal');
const modalTitle = document.getElementById('modal-title');
const photoForm = document.getElementById('photo-form');
const addPhotoBtn = document.getElementById('add-photo-btn');
const closeModalBtn = document.querySelector('.close-modal');
const filterButtons = document.querySelectorAll('.filter-btn:not(#add-photo-btn)');

// Current editing photo ID
let currentEditId = null;

// Render gallery
function renderGallery(photosToRender = photos) {
    galleryContainer.innerHTML = photosToRender.map(photo => `
        <div class="gallery-item" data-category="${photo.category}">
            <img src="${photo.url}" alt="${photo.title}">
            ${auth.isLoggedIn() && (auth.isAdmin() || auth.isEditor()) ? `
                <div class="crud-buttons">
                
                    <button class="crud-btn edit" onclick="editPhoto(${photo.id})">Edit</button>
                    <button class="crud-btn delete" onclick="deletePhoto(${photo.id})">Delete</button>
                </div>
            ` : ''}
            <div class="image-caption">
                <h3>${photo.title}</h3>
                <p>${photo.description}</p>
            </div>
        </div>
    `).join('');
}

// Filter functionality
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        const category = button.getAttribute('data-category');
        const filteredPhotos = category === 'all' 
            ? photos 
            : photos.filter(photo => photo.category === category);
        
        renderGallery(filteredPhotos);
    });
});

// Add new photo
if (addPhotoBtn) {
    addPhotoBtn.addEventListener('click', () => {
        currentEditId = null;
        modalTitle.textContent = 'Add New Photo';
        photoForm.reset();
        modal.style.display = 'block';
    });
}

// Edit photo
function editPhoto(id) {
    if (!auth.isLoggedIn() || (!auth.isAdmin() && !auth.isEditor())) {
        alert('You do not have permission to edit photos.');
        return;
    }
    
    currentEditId = id;
    const photo = photos.find(p => p.id === id);
    
    document.getElementById('photo-title').value = photo.title;
    document.getElementById('photo-category').value = photo.category;
    document.getElementById('photo-description').value = photo.description;
    document.getElementById('photo-url').value = photo.url;
    
    modalTitle.textContent = 'Edit Photo';
    modal.style.display = 'block';
}

// Delete photo
function deletePhoto(id) {
    if (!auth.isLoggedIn() || (!auth.isAdmin() && !auth.isEditor())) {
        alert('You do not have permission to delete photos.');
        return;
    }
    
    if (confirm('Are you sure you want to delete this photo?')) {
        photos = photos.filter(photo => photo.id !== id);
        renderGallery();
    }
}

// Handle form submission
if (photoForm) {
    photoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (!auth.isLoggedIn() || (!auth.isAdmin() && !auth.isEditor())) {
            alert('You do not have permission to add or edit photos.');
            return;
        }
        
        const photoData = {
            title: document.getElementById('photo-title').value,
            category: document.getElementById('photo-category').value,
            description: document.getElementById('photo-description').value,
            url: document.getElementById('photo-url').value
        };

        if (currentEditId) {
            // Update existing photo
            const index = photos.findIndex(p => p.id === currentEditId);
            photos[index] = { ...photos[index], ...photoData };
        } else {
            // Add new photo
            const newId = Math.max(...photos.map(p => p.id)) + 1;
            photos.push({ ...photoData, id: newId });
        }

        renderGallery();
        modal.style.display = 'none';
    });
}

// Close modal
if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Update UI based on user role
function updateUIByRole() {
    if (auth.isLoggedIn()) {
        if (auth.isAdmin() || auth.isEditor()) {
            // Show CRUD buttons for admin and editor
            document.querySelectorAll('.editor-only').forEach(el => {
                el.style.display = 'block';
            });
        } else {
            // Hide CRUD buttons for regular users
            document.querySelectorAll('.editor-only').forEach(el => {
                el.style.display = 'none';
            });
        }
    } else {
        // Hide CRUD buttons for non-logged in users
        document.querySelectorAll('.editor-only').forEach(el => {
            el.style.display = 'none';
        });
    }
}

// Initial render
document.addEventListener('DOMContentLoaded', function() {
    renderGallery();
    updateUIByRole();
}); 