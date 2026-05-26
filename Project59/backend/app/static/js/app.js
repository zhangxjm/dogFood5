const API_BASE = '/api';

async function apiCall(url, options = {}) {
    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.detail || '请求失败');
        }
        
        return data;
    } catch (error) {
        console.error('API Error:', error);
        showAlert(error.message, 'error');
        throw error;
    }
}

function showAlert(message, type = 'success') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    alertDiv.style.position = 'fixed';
    alertDiv.style.top = '20px';
    alertDiv.style.right = '20px';
    alertDiv.style.zIndex = '2000';
    alertDiv.style.minWidth = '300px';
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

function formatDate(dateStr) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN');
}

function formatDateTime(dateStr) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleString('zh-CN');
}

function getStatusBadge(status) {
    const statusMap = {
        'confirmed': { class: 'badge-confirmed', text: '已确认' },
        'completed': { class: 'badge-completed', text: '已完成' },
        'cancelled': { class: 'badge-cancelled', text: '已取消' },
        'pending': { class: 'badge-pending', text: '待确认' }
    };
    const info = statusMap[status] || { class: 'badge-pending', text: status };
    return `<span class="badge ${info.class}">${info.text}</span>`;
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
    if (e.target.classList.contains('close-btn')) {
        const modal = e.target.closest('.modal');
        if (modal) {
            modal.classList.remove('active');
        }
    }
});

function formatDuration(minutes) {
    if (!minutes) return '-';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
        return `${hours}小时${mins}分钟`;
    }
    return `${mins}分钟`;
}

function formatCurrency(amount) {
    return '¥' + parseFloat(amount).toFixed(2);
}
