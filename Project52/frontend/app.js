const API_BASE = '/api';

let currentCategoryId = null;
let categories = [];
let notes = [];

async function fetchCategories() {
    try {
        const response = await fetch(`${API_BASE}/categories`);
        categories = await response.json();
        renderCategories();
        renderCategoryOptions();
    } catch (error) {
        showToast('加载分类失败');
    }
}

async function fetchNotes(keyword = '', categoryId = null) {
    try {
        let url = `${API_BASE}/notes`;
        const params = new URLSearchParams();
        if (keyword) params.append('keyword', keyword);
        if (categoryId) params.append('category_id', categoryId);
        if (params.toString()) url += `?${params.toString()}`;
        
        const response = await fetch(url);
        notes = await response.json();
        renderNotes();
    } catch (error) {
        showToast('加载笔记失败');
    }
}

function renderCategories() {
    const container = document.getElementById('categoryList');
    container.innerHTML = '';

    const allItem = document.createElement('div');
    allItem.className = 'category-item' + (currentCategoryId === null ? ' active' : '');
    allItem.innerHTML = `
        <div class="category-color" style="background: #718096;"></div>
        <span class="category-name">全部笔记</span>
        <span class="category-count">${categories.reduce((sum, c) => sum + c.note_count, 0)}</span>
    `;
    allItem.onclick = () => selectCategory(null);
    container.appendChild(allItem);

    categories.forEach(category => {
        const item = document.createElement('div');
        item.className = 'category-item' + (currentCategoryId === category.id ? ' active' : '');
        item.innerHTML = `
            <div class="category-color" style="background: ${category.color};"></div>
            <span class="category-name">${escapeHtml(category.name)}</span>
            <span class="category-count">${category.note_count}</span>
            <div class="category-actions">
                <button class="btn-icon" onclick="event.stopPropagation(); editCategory(${category.id})" title="编辑">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                </button>
                <button class="btn-icon" onclick="event.stopPropagation(); deleteCategory(${category.id})" title="删除">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                </button>
            </div>
        `;
        item.onclick = () => selectCategory(category.id);
        container.appendChild(item);
    });
}

function renderCategoryOptions() {
    const select = document.getElementById('noteCategory');
    select.innerHTML = '<option value="">请选择分类</option>';
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        select.appendChild(option);
    });
}

function renderNotes() {
    const container = document.getElementById('notesContainer');
    const emptyState = document.getElementById('emptyState');
    
    if (notes.length === 0) {
        container.innerHTML = '';
        emptyState.style.display = 'flex';
        return;
    }
    
    emptyState.style.display = 'none';
    container.innerHTML = '';
    
    notes.forEach(note => {
        const card = document.createElement('div');
        card.className = 'note-card';
        const tagsHtml = note.tags && note.tags.length > 0 
            ? `<div class="note-tags">${note.tags.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('')}</div>` 
            : '';
        
        card.innerHTML = `
            <div class="note-header">
                <h3 class="note-title">${escapeHtml(note.title)}</h3>
                <div class="note-actions">
                    <button class="btn-icon" onclick="editNote(${note.id})" title="编辑">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                    </button>
                    <button class="btn-icon" onclick="deleteNote(${note.id})" title="删除">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                    </button>
                </div>
            </div>
            ${tagsHtml}
            <div class="note-content" id="content-${note.id}">${escapeHtml(note.content)}</div>
            <div class="note-footer">
                <div class="note-meta">
                    <span class="category-badge" style="background: ${note.category_color};">${escapeHtml(note.category_name)}</span>
                    <span>${formatDate(note.created_at)}</span>
                </div>
                ${note.content.length > 200 ? `<button class="expand-btn" onclick="toggleExpand(${note.id})">展开全文</button>` : ''}
            </div>
        `;
        container.appendChild(card);
    });
}

function selectCategory(categoryId) {
    currentCategoryId = categoryId;
    const nameEl = document.getElementById('currentCategoryName');
    if (categoryId === null) {
        nameEl.textContent = '全部笔记';
    } else {
        const category = categories.find(c => c.id === categoryId);
        nameEl.textContent = category ? category.name : '全部笔记';
    }
    renderCategories();
    fetchNotes('', categoryId);
}

function toggleExpand(noteId) {
    const contentEl = document.getElementById(`content-${noteId}`);
    if (contentEl.classList.contains('expanded')) {
        contentEl.classList.remove('expanded');
        event.target.textContent = '展开全文';
    } else {
        contentEl.classList.add('expanded');
        event.target.textContent = '收起';
    }
}

function openNoteModal(note = null) {
    document.getElementById('noteModal').classList.add('active');
    document.getElementById('noteModalTitle').textContent = note ? '编辑笔记' : '新建笔记';
    document.getElementById('noteId').value = note ? note.id : '';
    document.getElementById('noteTitle').value = note ? note.title : '';
    document.getElementById('noteCategory').value = note ? note.category_id : '';
    document.getElementById('noteTags').value = note ? (note.tags || []).join(', ') : '';
    document.getElementById('noteContent').value = note ? note.content : '';
}

function openCategoryModal(category = null) {
    document.getElementById('categoryModal').classList.add('active');
    document.getElementById('categoryModalTitle').textContent = category ? '编辑分类' : '新建分类';
    document.getElementById('categoryId').value = category ? category.id : '';
    document.getElementById('categoryName').value = category ? category.name : '';
    document.getElementById('categoryDescription').value = category ? category.description : '';
    document.getElementById('categoryColor').value = category ? category.color : '#3B82F6';
    document.getElementById('categoryColorText').value = category ? category.color : '#3B82F6';
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

async function saveNote(event) {
    event.preventDefault();
    const id = document.getElementById('noteId').value;
    const data = {
        title: document.getElementById('noteTitle').value,
        category_id: parseInt(document.getElementById('noteCategory').value),
        tags: document.getElementById('noteTags').value.split(',').map(t => t.trim()).filter(t => t),
        content: document.getElementById('noteContent').value
    };

    try {
        if (id) {
            await fetch(`${API_BASE}/notes/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            showToast('更新成功');
        } else {
            await fetch(`${API_BASE}/notes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            showToast('创建成功');
        }
        closeModal('noteModal');
        fetchCategories();
        fetchNotes(document.getElementById('searchInput').value, currentCategoryId);
    } catch (error) {
        showToast('保存失败');
    }
}

async function saveCategory(event) {
    event.preventDefault();
    const id = document.getElementById('categoryId').value;
    const data = {
        name: document.getElementById('categoryName').value,
        description: document.getElementById('categoryDescription').value,
        color: document.getElementById('categoryColor').value
    };

    try {
        if (id) {
            await fetch(`${API_BASE}/categories/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            showToast('更新成功');
        } else {
            await fetch(`${API_BASE}/categories`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            showToast('创建成功');
        }
        closeModal('categoryModal');
        fetchCategories();
    } catch (error) {
        showToast('保存失败');
    }
}

async function editNote(noteId) {
    try {
        const response = await fetch(`${API_BASE}/notes/${noteId}`);
        const note = await response.json();
        openNoteModal(note);
    } catch (error) {
        showToast('加载笔记失败');
    }
}

function editCategory(categoryId) {
    const category = categories.find(c => c.id === categoryId);
    if (category) {
        openCategoryModal(category);
    }
}

async function deleteNote(noteId) {
    if (!confirm('确定要删除这条笔记吗？')) return;
    try {
        await fetch(`${API_BASE}/notes/${noteId}`, { method: 'DELETE' });
        showToast('删除成功');
        fetchCategories();
        fetchNotes(document.getElementById('searchInput').value, currentCategoryId);
    } catch (error) {
        showToast('删除失败');
    }
}

async function deleteCategory(categoryId) {
    if (!confirm('确定要删除这个分类吗？该分类下的所有笔记也会被删除。')) return;
    try {
        await fetch(`${API_BASE}/categories/${categoryId}`, { method: 'DELETE' });
        showToast('删除成功');
        if (currentCategoryId === categoryId) {
            currentCategoryId = null;
        }
        fetchCategories();
        fetchNotes('', currentCategoryId);
    } catch (error) {
        showToast('删除失败');
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

document.getElementById('searchInput').addEventListener('input', debounce((e) => {
    fetchNotes(e.target.value, currentCategoryId);
}, 300));

document.getElementById('addNoteBtn').addEventListener('click', () => openNoteModal());
document.getElementById('addCategoryBtn').addEventListener('click', () => openCategoryModal());
document.getElementById('noteForm').addEventListener('submit', saveNote);
document.getElementById('categoryForm').addEventListener('submit', saveCategory);

document.getElementById('categoryColor').addEventListener('input', (e) => {
    document.getElementById('categoryColorText').value = e.target.value;
});

document.getElementById('categoryColorText').addEventListener('input', (e) => {
    document.getElementById('categoryColor').value = e.target.value;
});

document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
});

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

fetchCategories();
fetchNotes();
