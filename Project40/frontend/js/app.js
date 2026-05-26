const API_BASE = 'http://localhost:8000';

let currentUser = null;
let users = [];
let tasks = [];

async function apiFetch(url, options = {}) {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        return null;
    }
}

function switchTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`tab-${tabName}`).classList.add('active');

    if (tabName === 'tasks') loadTasks();
    if (tabName === 'gallery') loadExcellentWorks();
    if (tabName === 'stats') loadStats();
    if (tabName === 'upload') loadTaskOptions();
}

async function loadUsers() {
    const data = await apiFetch(`${API_BASE}/api/users/`);
    if (data) {
        users = data;
        updateUserSelector();
    }
}

function updateUserSelector() {
    const selector = document.getElementById('currentUser');
    selector.innerHTML = '<option value="">请选择用户</option>';
    users.forEach(user => {
        const option = document.createElement('option');
        option.value = user.id;
        option.textContent = user.nickname || user.username;
        if (currentUser && currentUser.id === user.id) {
            option.selected = true;
        }
        selector.appendChild(option);
    });
}

function switchUser() {
    const selector = document.getElementById('currentUser');
    const userId = parseInt(selector.value);
    if (userId) {
        currentUser = users.find(u => u.id === userId);
        if (currentUser.id) {
            loadTasks();
        }
    } else {
        currentUser = null;
    }
}

function showUserModal() {
    document.getElementById('userModal').classList.add('active');
}

function showTaskModal() {
    document.getElementById('taskModal').classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

async function createUser(event) {
    event.preventDefault();
    const username = document.getElementById('newUsername').value;
    const nickname = document.getElementById('newNickname').value;

    const data = await apiFetch(`${API_BASE}/api/users/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, nickname })
    });

    if (data) {
        users.push(data);
        updateUserSelector();
        document.getElementById('currentUser').value = data.id;
        currentUser = data;
        closeModal('userModal');
        document.getElementById('newUsername').value = '';
        document.getElementById('newNickname').value = '';
        loadTasks();
    }
}

async function createTask(event) {
    event.preventDefault();
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDescription').value;

    const data = await apiFetch(`${API_BASE}/api/tasks/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description })
    });

    if (data) {
        tasks.push(data);
        closeModal('taskModal');
        document.getElementById('taskTitle').value = '';
        document.getElementById('taskDescription').value = '';
        loadTasks();
    }
}

async function loadTasks() {
    const data = await apiFetch(`${API_BASE}/api/tasks/`);
    if (data) {
        tasks = data;
        renderTasks();
    }
}

function renderTasks() {
    const container = document.getElementById('tasksList');
    
    if (!tasks.length) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="icon">📋</div>
                <p>暂无打卡任务，点击上方按钮发布新任务</p>
            </div>
        `;
        return;
    }

    container.innerHTML = tasks.map(task => `
        <div class="task-card">
            <h3>${task.title}</h3>
            <p>${task.description || '暂无描述'}</p>
            <div class="task-meta">
                <span>创建于 ${new Date(task.created_at).toLocaleDateString('zh-CN')}</span>
                <span>${task.is_active ? '🟢 进行中' : '⚪ 已结束'}</span>
            </div>
            ${currentUser ? `
                <div class="task-actions">
                    <button class="btn-primary" onclick="uploadForTask(${task.id})">📷 上传作品</button>
                </div>
            ` : '<p style="color:#999;font-size:12px;margin-top:10px;">请先选择用户以上传作品</p>'}
        </div>
    `).join('');
}

function uploadForTask(taskId) {
    switchTab('upload');
    setTimeout(() => {
        document.getElementById('uploadTaskId').value = taskId;
    }, 100);
}

async function loadTaskOptions() {
    await loadTasks();
    const select = document.getElementById('uploadTaskId');
    select.innerHTML = '<option value="">请选择任务</option>';
    tasks.filter(t => t.is_active).forEach(task => {
        const option = document.createElement('option');
        option.value = task.id;
        option.textContent = task.title;
        select.appendChild(option);
    });
}

function previewImage(event) {
    const file = event.target.files[0];
    const preview = document.getElementById('imagePreview');
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = `<img src="${e.target.result}" alt="预览">`;
        };
        reader.readAsDataURL(file);
    } else {
        preview.innerHTML = '';
    }
}

async function uploadWork(event) {
    event.preventDefault();
    
    if (!currentUser) {
        alert('请先选择用户！');
        return;
    }

    const taskId = parseInt(document.getElementById('uploadTaskId').value);
    const file = document.getElementById('workImage').files[0];
    const description = document.getElementById('workDescription').value;

    if (!taskId || !file) {
        alert('请填写完整信息！');
        return;
    }

    const formData = new FormData();
    formData.append('user_id', currentUser.id);
    formData.append('task_id', taskId);
    formData.append('description', description);
    formData.append('file', file);

    try {
        const response = await fetch(`${API_BASE}/api/works/upload`, {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            const data = await response.json();
            alert('打卡成功！');
            document.getElementById('uploadForm').reset();
            document.getElementById('imagePreview').innerHTML = '';
            switchTab('gallery');
        } else {
            alert('上传失败，请重试！');
        }
    } catch (error) {
        console.error('Upload error:', error);
        alert('上传出错，请检查网络连接！');
    }
}

async function loadExcellentWorks() {
    const data = await apiFetch(`${API_BASE}/api/works/excellent`);
    renderGallery(data || []);
}

function renderGallery(works) {
    const container = document.getElementById('excellentWorks');
    
    if (!works.length) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="icon">🏆</div>
                <p>暂无优秀作品</p>
            </div>
        `;
        return;
    }

    container.innerHTML = works.map(work => `
        <div class="work-card">
            <div class="work-image" onclick="showImageModal('${work.image_path}')">
                <img src="${API_BASE}/uploads/${work.image_path}" alt="${work.task_title}" onerror="this.style.display='none';this.parentElement.innerHTML='<div class=\\'placeholder\\'>🖼️</div>'">
            </div>
            <div class="work-info">
                <h4>${work.task_title || '未知任务'}</h4>
                <p>${work.description || '暂无描述'}</p>
                <div class="work-meta">
                    <div class="user-info">
                        👤 ${work.nickname || work.username || '匿名'}
                    </div>
                    <div style="display:flex;gap:10px;align-items:center;">
                        <span class="excellent-badge">优秀</span>
                        <span class="likes" onclick="likeWork(${work.id})">❤️ ${work.likes}</span>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

async function likeWork(workId) {
    const data = await apiFetch(`${API_BASE}/api/works/${workId}/like`, {
        method: 'PUT'
    });
    if (data) {
        loadExcellentWorks();
    }
}

function showImageModal(imagePath) {
    const modal = document.getElementById('imageModal');
    const img = document.getElementById('modalImage');
    img.src = `${API_BASE}/uploads/${imagePath}`;
    img.onerror = function() {
        this.src = '';
        this.alt = '图片加载失败';
    };
    modal.classList.add('active');
}

async function loadStats() {
    const summary = await apiFetch(`${API_BASE}/api/stats/summary`);
    const ranking = await apiFetch(`${API_BASE}/api/stats/ranking`);
    
    if (summary) {
        renderStatsSummary(summary);
    }
    
    if (ranking) {
        renderRanking(ranking);
    }
}

function renderStatsSummary(stats) {
    const container = document.getElementById('statsSummary');
    
    let userStats = '';
    if (currentUser) {
        userStats = `
            <div class="stat-item">
                <span class="label">我的打卡天数</span>
                <span class="value">加载中...</span>
            </div>
            <div class="stat-item">
                <span class="label">我的作品数</span>
                <span class="value">加载中...</span>
            </div>
        `;
        
        apiFetch(`${API_BASE}/api/stats/users/${currentUser.id}`).then(data => {
            if (data) {
                container.innerHTML = container.innerHTML.replace(
                    '<span class="value">加载中...</span>',
                    `<span class="value">${data.total_checkins || 0}</span>`
                ).replace(
                    '<span class="value">加载中...</span>',
                    `<span class="value">${data.total_works || 0}</span>`
                );
            }
        });
    }

    container.innerHTML = `
        <h3>📊 系统概览</h3>
        <div class="stat-item">
            <span class="label">总用户数</span>
            <span class="value">${stats.total_users || 0}</span>
        </div>
        <div class="stat-item">
            <span class="label">总任务数</span>
            <span class="value">${stats.total_tasks || 0}</span>
        </div>
        <div class="stat-item">
            <span class="label">总作品数</span>
            <span class="value">${stats.total_works || 0}</span>
        </div>
        <div class="stat-item">
            <span class="label">优秀作品</span>
            <span class="value">${stats.total_excellent || 0}</span>
        </div>
        <div class="stat-item">
            <span class="label">今日打卡</span>
            <span class="value">${stats.today_checkins || 0}</span>
        </div>
        ${userStats}
    `;
}

function renderRanking(ranking) {
    const container = document.getElementById('rankingList');
    
    if (!ranking.length) {
        container.innerHTML = '<p style="text-align:center;color:#999;">暂无排行数据</p>';
        return;
    }

    container.innerHTML = ranking.map((item, index) => `
        <div class="ranking-item">
            <div class="rank">${index + 1}</div>
            <div class="user-info">
                <div class="name">${item.nickname || item.username}</div>
                <div class="sub">${item.total_works} 作品 | ${item.excellent_works} 优秀</div>
            </div>
            <div class="count">🔥 ${item.total_checkins} 天</div>
        </div>
    `).join('');
}

document.getElementById('workImage').addEventListener('change', previewImage);

window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('active');
    }
};

async function init() {
    await loadUsers();
    
    if (users.length > 0) {
        currentUser = users[0];
        document.getElementById('currentUser').value = currentUser.id;
    }
    
    loadTasks();
}

init();
