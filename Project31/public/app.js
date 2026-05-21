let groups = [];
let accounts = [];
let currentGroupFilter = null;
let currentSearch = '';
let selectedColor = '#2ecc71';

async function loadGroups() {
    try {
        const res = await fetch('/api/groups');
        const data = await res.json();
        if (data.success) {
            groups = data.data;
            renderGroups();
            renderGroupSelects();
        }
    } catch (e) {
        console.error('加载分组失败:', e);
    }
}

async function loadAccounts() {
    try {
        const params = new URLSearchParams();
        if (currentSearch) params.append('search', currentSearch);
        if (currentGroupFilter) params.append('group_id', currentGroupFilter);
        
        const res = await fetch('/api/accounts?' + params);
        const data = await res.json();
        if (data.success) {
            accounts = data.data;
            renderAccounts();
        }
    } catch (e) {
        console.error('加载账号失败:', e);
    }
}

function renderGroups() {
    const list = document.getElementById('groupList');
    const allItem = list.querySelector('.group-item[data-id="all"]');
    list.innerHTML = '';
    list.appendChild(allItem);
    
    groups.forEach(group => {
        const li = document.createElement('li');
        li.className = 'group-item' + (currentGroupFilter == group.id ? ' active' : '');
        li.dataset.id = group.id;
        li.innerHTML = `
            <span class="group-color" style="background: ${group.color};"></span>
            ${group.name}
        `;
        li.onclick = () => filterByGroup(group.id);
        list.appendChild(li);
    });
}

function renderGroupSelects() {
    const select = document.getElementById('groupId');
    select.innerHTML = '<option value="">无分组</option>';
    groups.forEach(group => {
        select.innerHTML += `<option value="${group.id}">${group.name}</option>`;
    });
}

function renderAccounts() {
    const container = document.getElementById('accountList');
    const emptyState = document.getElementById('emptyState');
    
    if (accounts.length === 0) {
        container.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    container.innerHTML = accounts.map(acc => `
        <div class="account-card">
            <div class="account-header">
                <div class="account-platform">
                    🌐 ${escapeHtml(acc.platform)}
                    ${acc.group_name ? `<span class="account-group-tag" style="background: ${acc.group_color};">${escapeHtml(acc.group_name)}</span>` : ''}
                </div>
            </div>
            <div class="account-info">
                <div class="info-item">
                    <span class="info-label">👤 用户名</span>
                    <span class="info-value">
                        ${escapeHtml(acc.username)}
                        <button class="copy-btn" onclick="copyText('${escapeHtml(acc.username)}')">📋</button>
                    </span>
                </div>
                <div class="info-item">
                    <span class="info-label">🔑 密码</span>
                    <span class="info-value password-field">
                        <span id="pass-${acc.id}">••••••••</span>
                        <button class="copy-btn" onclick="togglePasswordVisibility(${acc.id}, '${escapeHtml(acc.password)}')">👁️</button>
                        <button class="copy-btn" onclick="copyText('${escapeHtml(acc.password)}')">📋</button>
                    </span>
                </div>
            </div>
            ${acc.url ? `
            <div class="info-item" style="margin-bottom: 15px;">
                <span class="info-label">🔗 网址</span>
                <span class="info-value">
                    <a href="${escapeHtml(acc.url)}" target="_blank" class="url-link">${escapeHtml(acc.url)}</a>
                </span>
            </div>
            ` : ''}
            ${acc.notes ? `<div class="account-notes">📝 ${escapeHtml(acc.notes)}</div>` : ''}
            <div class="account-actions">
                <button class="btn btn-secondary btn-small" onclick="editAccount(${acc.id})">✏️ 编辑</button>
                <button class="btn btn-danger btn-small" onclick="deleteAccount(${acc.id})">🗑️ 删除</button>
            </div>
        </div>
    `).join('');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function filterByGroup(groupId) {
    currentGroupFilter = groupId;
    renderGroups();
    loadAccounts();
}

function searchAccounts() {
    currentSearch = document.getElementById('searchInput').value;
    loadAccounts();
}

function showAddModal() {
    document.getElementById('modalTitle').textContent = '添加账号';
    document.getElementById('accountId').value = '';
    document.getElementById('accountForm').reset();
    document.getElementById('accountModal').classList.add('show');
}

function showAddGroupModal() {
    document.getElementById('groupName').value = '';
    selectedColor = '#2ecc71';
    document.querySelectorAll('.color-option').forEach(el => el.classList.remove('selected'));
    document.querySelector('.color-option[data-color="#2ecc71"]').classList.add('selected');
    document.getElementById('groupModal').classList.add('show');
}

function closeModal() {
    document.getElementById('accountModal').classList.remove('show');
}

function closeGroupModal() {
    document.getElementById('groupModal').classList.remove('show');
}

async function saveAccount(e) {
    e.preventDefault();
    const id = document.getElementById('accountId').value;
    const account = {
        platform: document.getElementById('platform').value,
        group_id: document.getElementById('groupId').value || null,
        username: document.getElementById('username').value,
        password: document.getElementById('password').value,
        url: document.getElementById('url').value,
        notes: document.getElementById('notes').value
    };
    
    try {
        const url = id ? `/api/accounts/${id}` : '/api/accounts';
        const method = id ? 'PUT' : 'POST';
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(account)
        });
        const data = await res.json();
        if (data.success) {
            closeModal();
            loadAccounts();
        }
    } catch (e) {
        console.error('保存失败:', e);
    }
}

async function saveGroup(e) {
    e.preventDefault();
    const name = document.getElementById('groupName').value;
    try {
        const res = await fetch('/api/groups', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, color: selectedColor })
        });
        const data = await res.json();
        if (data.success) {
            closeGroupModal();
            loadGroups();
        }
    } catch (e) {
        console.error('创建分组失败:', e);
    }
}

async function editAccount(id) {
    const account = accounts.find(a => a.id === id);
    if (!account) return;
    
    document.getElementById('modalTitle').textContent = '编辑账号';
    document.getElementById('accountId').value = account.id;
    document.getElementById('platform').value = account.platform;
    document.getElementById('groupId').value = account.group_id || '';
    document.getElementById('username').value = account.username;
    document.getElementById('password').value = account.password;
    document.getElementById('url').value = account.url || '';
    document.getElementById('notes').value = account.notes || '';
    document.getElementById('accountModal').classList.add('show');
}

async function deleteAccount(id) {
    if (!confirm('确定要删除这个账号吗？')) return;
    try {
        const res = await fetch(`/api/accounts/${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (data.success) {
            loadAccounts();
        }
    } catch (e) {
        console.error('删除失败:', e);
    }
}

function selectColor(el) {
    document.querySelectorAll('.color-option').forEach(e => e.classList.remove('selected'));
    el.classList.add('selected');
    selectedColor = el.dataset.color;
}

function togglePassword() {
    const input = document.getElementById('password');
    input.type = input.type === 'password' ? 'text' : 'password';
}

function togglePasswordVisibility(id, password) {
    const el = document.getElementById(`pass-${id}`);
    el.textContent = el.textContent === '••••••••' ? password : '••••••••';
}

function copyText(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('已复制到剪贴板!');
    });
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #333;
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        z-index: 9999;
        animation: fadeIn 0.3s;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
}

window.onclick = function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('show');
    }
};

loadGroups();
loadAccounts();
