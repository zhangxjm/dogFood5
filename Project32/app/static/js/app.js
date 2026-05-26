let currentPage = 1;
let currentCategory = '';
let currentSort = 'created_at';
let currentView = 'home';
let currentPreviewScoreId = null;
let selectedIcon = 'folder';
let selectedFile = null;

document.addEventListener('DOMContentLoaded', function() {
    loadCategories();
    loadStats();
    loadScores();
    setupDragAndDrop();
});

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icons = {
        success: 'ri-checkbox-circle-fill',
        error: 'ri-error-warning-fill',
        info: 'ri-information-fill'
    };

    toast.innerHTML = `
        <i class="${icons[type]}"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function navigateTo(view) {
    currentView = view;
    currentPage = 1;

    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`nav-${view}`).classList.add('active');

    if (view === 'home') {
        document.getElementById('contentTitle').textContent = 'All Scores';
        loadScores();
    } else if (view === 'favorites') {
        document.getElementById('contentTitle').textContent = 'My Favorites';
        loadFavorites();
    } else if (view === 'categories') {
        document.getElementById('contentTitle').textContent = 'Categories';
        loadCategoriesView();
    }
}

async function loadCategories() {
    try {
        const response = await fetch('/api/categories');
        const categories = await response.json();

        const categoryList = document.getElementById('categoryList');
        const uploadCategory = document.getElementById('uploadCategory');

        const allCount = await fetch('/api/scores?per_page=1').then(r => r.json()).then(d => d.total);
        document.getElementById('allCount').textContent = allCount;

        categories.forEach(cat => {
            const item = document.createElement('div');
            item.className = 'category-item';
            item.dataset.categoryId = cat.id;
            item.innerHTML = `
                <i class="ri-${cat.icon}-line"></i>
                <span>${cat.name}</span>
                <span class="count">${cat.score_count}</span>
            `;
            item.onclick = () => filterByCategory(cat.id);
            categoryList.appendChild(item);

            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = cat.name;
            uploadCategory.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

async function loadStats() {
    try {
        const response = await fetch('/api/stats');
        const stats = await response.json();

        document.getElementById('totalScores').textContent = stats.total_scores;
        document.getElementById('totalCategories').textContent = stats.total_categories;
        document.getElementById('totalFavorites').textContent = stats.total_favorites;
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

async function loadScores() {
    try {
        const searchQuery = document.getElementById('searchInput').value;
        let url = `/api/scores?page=${currentPage}&per_page=12&sort_by=${currentSort}`;

        if (currentCategory) {
            url += `&category_id=${currentCategory}`;
        }
        if (searchQuery) {
            url += `&search=${encodeURIComponent(searchQuery)}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        renderScores(data.scores);
        renderPagination(data.total, data.pages, data.current_page);
    } catch (error) {
        console.error('Error loading scores:', error);
    }
}

async function loadFavorites() {
    try {
        const response = await fetch('/api/favorites');
        const favorites = await response.json();

        const scores = favorites.map(f => f.score);
        renderScores(scores);
        document.getElementById('pagination').innerHTML = '';
    } catch (error) {
        console.error('Error loading favorites:', error);
    }
}

async function loadCategoriesView() {
    try {
        const response = await fetch('/api/categories');
        const categories = await response.json();

        const scoreGrid = document.getElementById('scoreGrid');
        document.getElementById('pagination').innerHTML = '';

        if (categories.length === 0) {
            scoreGrid.innerHTML = `
                <div class="empty-state">
                    <i class="ri-folder-3-line"></i>
                    <h3>No Categories</h3>
                    <p>Create your first category to organize scores</p>
                </div>
            `;
            return;
        }

        scoreGrid.innerHTML = categories.map(cat => `
            <div class="score-card" onclick="filterByCategory(${cat.id}); navigateTo('home');">
                <div class="score-thumbnail">
                    <i class="ri-${cat.icon}-fill" style="font-size:4rem; color:var(--primary);"></i>
                </div>
                <div class="score-info">
                    <div class="score-title">${cat.name}</div>
                    <div class="score-composer">${cat.score_count} scores</div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading categories view:', error);
    }
}

function renderScores(scores) {
    const scoreGrid = document.getElementById('scoreGrid');

    if (scores.length === 0) {
        scoreGrid.innerHTML = `
            <div class="empty-state">
                <i class="ri-file-music-line"></i>
                <h3>No Scores Found</h3>
                <p>Try adjusting your search or filters</p>
            </div>
        `;
        return;
    }

    scoreGrid.innerHTML = scores.map(score => {
        const fileUrl = `/uploads/${score.filename}`;
        const isImage = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'].includes(score.file_type);

        return `
            <div class="score-card" onclick="openPreviewModal(${score.id})">
                <div class="score-thumbnail">
                    ${isImage 
                        ? `<img src="${fileUrl}" alt="${score.title}" onerror="this.parentElement.innerHTML='<i class=\\'ri-file-music-line\\' style=\\'font-size:4rem;color:var(--text-muted);\\'></i>'">`
                        : `<i class="ri-file-pdf-line pdf-icon"></i>`
                    }
                    <button class="favorite-toggle" onclick="event.stopPropagation(); toggleFavorite(${score.id}, this)">
                        <i class="ri-heart-line"></i>
                    </button>
                </div>
                <div class="score-info">
                    <div class="score-title">${score.title}</div>
                    <div class="score-composer">${score.composer}</div>
                    <div class="score-meta">
                        <div class="score-meta-left">
                            <span class="score-category">${score.category_name}</span>
                        </div>
                        <span class="score-views">
                            <i class="ri-eye-line"></i>
                            ${score.views}
                        </span>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    scores.forEach(score => {
        checkFavoriteStatus(score.id);
    });
}

function renderPagination(total, pages, current) {
    const pagination = document.getElementById('pagination');

    if (pages <= 1) {
        pagination.innerHTML = '';
        return;
    }

    let html = `<button class="page-btn" onclick="changePage(${current - 1})" ${current === 1 ? 'disabled' : ''}><i class="ri-arrow-left-s-line"></i></button>`;

    for (let i = 1; i <= pages; i++) {
        if (i === 1 || i === pages || (i >= current - 1 && i <= current + 1)) {
            html += `<button class="page-btn ${i === current ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
        } else if (i === current - 2 || i === current + 2) {
            html += `<span style="padding: 0 0.5rem;">...</span>`;
        }
    }

    html += `<button class="page-btn" onclick="changePage(${current + 1})" ${current === pages ? 'disabled' : ''}><i class="ri-arrow-right-s-line"></i></button>`;

    pagination.innerHTML = html;
}

function changePage(page) {
    currentPage = page;
    if (currentView === 'favorites') {
        loadFavorites();
    } else {
        loadScores();
    }
}

function filterByCategory(categoryId) {
    currentCategory = categoryId;
    currentPage = 1;

    document.querySelectorAll('.category-item').forEach(item => {
        item.classList.toggle('active', item.dataset.categoryId == categoryId);
    });

    loadScores();
}

function sortScores() {
    currentSort = document.getElementById('sortSelect').value;
    currentPage = 1;
    loadScores();
}

function handleSearchKeyPress(event) {
    if (event.key === 'Enter') {
        currentPage = 1;
        loadScores();
    }
}

async function toggleFavorite(scoreId, button) {
    try {
        const checkResponse = await fetch(`/api/favorites/check/${scoreId}`);
        const checkData = await checkResponse.json();

        if (checkData.is_favorite) {
            await fetch(`/api/favorites/${scoreId}`, { method: 'DELETE' });
            button.innerHTML = '<i class="ri-heart-line"></i>';
            button.classList.remove('active');
            showToast('Removed from favorites', 'success');
        } else {
            await fetch(`/api/favorites/${scoreId}`, { method: 'POST' });
            button.innerHTML = '<i class="ri-heart-fill"></i>';
            button.classList.add('active');
            showToast('Added to favorites', 'success');
        }

        loadStats();
    } catch (error) {
        console.error('Error toggling favorite:', error);
        showToast('Error updating favorites', 'error');
    }
}

async function checkFavoriteStatus(scoreId) {
    try {
        const response = await fetch(`/api/favorites/check/${scoreId}`);
        const data = await response.json();

        const cards = document.querySelectorAll('.score-card');
        cards.forEach(card => {
            if (card.onclick.toString().includes(scoreId)) {
                const toggleBtn = card.querySelector('.favorite-toggle');
                if (data.is_favorite) {
                    toggleBtn.innerHTML = '<i class="ri-heart-fill"></i>';
                    toggleBtn.classList.add('active');
                }
            }
        });
    } catch (error) {
        console.error('Error checking favorite status:', error);
    }
}

function openUploadModal() {
    document.getElementById('uploadModal').classList.add('active');
    document.getElementById('uploadForm').reset();
    selectedFile = null;
    const fileArea = document.getElementById('fileUploadArea');
    fileArea.classList.remove('file-selected');
    fileArea.innerHTML = `
        <i class="ri-upload-cloud-2-line"></i>
        <p>Click to upload or drag file here</p>
        <p class="file-hint" id="fileHint">Max size: 16MB</p>
    `;
}

function openAddCategoryModal() {
    document.getElementById('addCategoryModal').classList.add('active');
    document.getElementById('newCategoryName').value = '';
    selectIcon('folder');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function setupDragAndDrop() {
    const fileArea = document.getElementById('fileUploadArea');
    const fileInput = document.getElementById('fileInput');

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        fileArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        fileArea.addEventListener(eventName, () => fileArea.classList.add('dragover'), false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        fileArea.addEventListener(eventName, () => fileArea.classList.remove('dragover'), false);
    });

    fileArea.addEventListener('drop', (e) => {
        const files = e.dataTransfer.files;
        if (files.length) {
            fileInput.files = files;
            handleFileSelect({ target: { files: files } });
        }
    }, false);
}

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/gif', 'image/bmp', 'image/webp'];
    const allowedExts = ['pdf', 'png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'];
    const fileExt = file.name.split('.').pop().toLowerCase();

    if (!allowedTypes.includes(file.type) && !allowedExts.includes(fileExt)) {
        showToast('Invalid file type', 'error');
        return;
    }

    if (file.size > 16 * 1024 * 1024) {
        showToast('File too large. Max size is 16MB', 'error');
        return;
    }

    selectedFile = file;
    const fileArea = document.getElementById('fileUploadArea');
    fileArea.classList.add('file-selected');
    fileArea.innerHTML = `
        <i class="ri-file-check-line"></i>
        <p>${file.name}</p>
        <p class="file-hint">${(file.size / 1024).toFixed(2)} KB</p>
    `;
}

async function handleUpload(event) {
    event.preventDefault();

    const title = document.getElementById('uploadTitle').value.trim();
    const composer = document.getElementById('uploadComposer').value.trim();
    const categoryId = document.getElementById('uploadCategory').value;
    const description = document.getElementById('uploadDescription').value.trim();

    if (!title) {
        showToast('Please enter a title', 'error');
        return;
    }

    if (!selectedFile) {
        showToast('Please select a file', 'error');
        return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('title', title);
    formData.append('composer', composer);
    formData.append('category_id', categoryId);
    formData.append('description', description);

    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="ri-loader-4-line"></i> Uploading...';

    try {
        const response = await fetch('/api/scores', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            showToast('Score uploaded successfully!', 'success');
            closeModal('uploadModal');
            loadScores();
            loadCategories();
            loadStats();
        } else {
            const data = await response.json();
            showToast(data.error || 'Upload failed', 'error');
        }
    } catch (error) {
        console.error('Error uploading score:', error);
        showToast('Upload failed', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="ri-upload-cloud-line"></i> Upload';
    }
}

function selectIcon(icon) {
    selectedIcon = icon;
    document.querySelectorAll('.icon-option').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.icon === icon);
    });
}

async function handleAddCategory(event) {
    event.preventDefault();

    const name = document.getElementById('newCategoryName').value.trim();

    if (!name) {
        showToast('Please enter a category name', 'error');
        return;
    }

    try {
        const response = await fetch('/api/categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, icon: selectedIcon })
        });

        if (response.ok) {
            showToast('Category created successfully!', 'success');
            closeModal('addCategoryModal');
            loadCategories();
            loadStats();
        } else {
            const data = await response.json();
            showToast(data.error || 'Failed to create category', 'error');
        }
    } catch (error) {
        console.error('Error creating category:', error);
        showToast('Failed to create category', 'error');
    }
}

async function openPreviewModal(scoreId) {
    currentPreviewScoreId = scoreId;

    try {
        const response = await fetch(`/api/scores/${scoreId}`);
        const score = await response.json();

        document.getElementById('previewTitle').textContent = score.title;
        document.getElementById('previewComposer').textContent = score.composer;
        document.getElementById('previewCategory').textContent = score.category_name;
        document.getElementById('previewViews').textContent = score.views;
        document.getElementById('previewUploader').textContent = score.uploader_name;
        document.getElementById('previewDescription').textContent = score.description || 'No description available';

        const previewContent = document.getElementById('previewContent');
        const fileUrl = `/uploads/${score.filename}`;
        const isImage = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'].includes(score.file_type);
        const isPdf = score.file_type === 'pdf';

        if (isImage) {
            previewContent.innerHTML = `<img src="${fileUrl}" alt="${score.title}">`;
        } else if (isPdf) {
            previewContent.innerHTML = `<iframe src="${fileUrl}"></iframe>`;
        } else {
            previewContent.innerHTML = `
                <div style="text-align: center; padding: 4rem;">
                    <i class="ri-file-music-line" style="font-size: 4rem; color: var(--text-muted);"></i>
                    <p>Preview not available</p>
                    <a href="${fileUrl}" target="_blank" class="submit-btn" style="width: auto; display: inline-flex; margin-top: 1rem;">
                        <i class="ri-download-line"></i>
                        Download File
                    </a>
                </div>
            `;
        }

        const favResponse = await fetch(`/api/favorites/check/${scoreId}`);
        const favData = await favResponse.json();
        const favBtn = document.getElementById('previewFavoriteBtn');

        if (favData.is_favorite) {
            favBtn.classList.add('active');
            favBtn.innerHTML = '<i class="ri-heart-fill"></i> Remove from Favorites';
        } else {
            favBtn.classList.remove('active');
            favBtn.innerHTML = '<i class="ri-heart-line"></i> Add to Favorites';
        }

        document.getElementById('previewModal').classList.add('active');
    } catch (error) {
        console.error('Error loading score preview:', error);
        showToast('Error loading score', 'error');
    }
}

async function togglePreviewFavorite() {
    if (!currentPreviewScoreId) return;

    try {
        const favResponse = await fetch(`/api/favorites/check/${currentPreviewScoreId}`);
        const favData = await favResponse.json();
        const favBtn = document.getElementById('previewFavoriteBtn');

        if (favData.is_favorite) {
            await fetch(`/api/favorites/${currentPreviewScoreId}`, { method: 'DELETE' });
            favBtn.classList.remove('active');
            favBtn.innerHTML = '<i class="ri-heart-line"></i> Add to Favorites';
            showToast('Removed from favorites', 'success');
        } else {
            await fetch(`/api/favorites/${currentPreviewScoreId}`, { method: 'POST' });
            favBtn.classList.add('active');
            favBtn.innerHTML = '<i class="ri-heart-fill"></i> Remove from Favorites';
            showToast('Added to favorites', 'success');
        }

        loadStats();
        loadScores();
    } catch (error) {
        console.error('Error toggling favorite:', error);
        showToast('Error updating favorites', 'error');
    }
}

document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.classList.remove('active');
        }
    });
});
