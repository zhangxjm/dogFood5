let currentOrders = [];

document.addEventListener('DOMContentLoaded', function() {
    loadOrders();
    document.getElementById('orderForm').addEventListener('submit', handleSubmit);
    document.getElementById('feedbackForm').addEventListener('submit', handleFeedbackSubmit);
});

function loadOrders() {
    const status = document.getElementById('statusFilter').value;
    const keyword = document.getElementById('keyword').value;

    let url = '/api/orders';
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (keyword) params.append('keyword', keyword);
    if (params.toString()) url += '?' + params.toString();

    fetch(url)
        .then(res => res.json())
        .then(data => {
            currentOrders = data;
            renderTable(data);
            updateStats(data);
        })
        .catch(err => {
            console.error('Error:', err);
            document.getElementById('orderTable').innerHTML = 
                '<tr><td colspan="10" class="loading">加载失败，请刷新重试</td></tr>';
        });
}

function renderTable(orders) {
    const tbody = document.getElementById('orderTable');
    
    if (!orders.length) {
        tbody.innerHTML = '<tr><td colspan="10" class="loading">暂无工单数据</td></tr>';
        return;
    }

    tbody.innerHTML = orders.map(order => `
        <tr>
            <td><strong>${escapeHtml(order.order_no)}</strong></td>
            <td>${escapeHtml(order.customer_name)}</td>
            <td>${escapeHtml(order.phone || '-')}</td>
            <td title="${escapeHtml(order.address)}">${truncateText(order.address, 30)}</td>
            <td>${escapeHtml(order.product_type || '-')}</td>
            <td>${order.quantity}</td>
            <td>${formatDate(order.install_date)}</td>
            <td><span class="status-badge status-${order.status}">${getStatusText(order.status)}</span></td>
            <td title="${escapeHtml(order.feedback || '')}">${truncateText(order.feedback || '-', 15)}</td>
            <td>
                <div class="action-btns">
                    <button class="btn btn-edit" onclick="showEditModal(${order.id})">编辑</button>
                    ${order.status !== 'completed' ? `<button class="btn btn-complete" onclick="completeOrder(${order.id})">完工</button>` : ''}
                    <button class="btn btn-feedback" onclick="showFeedbackModal(${order.id})">反馈</button>
                    <button class="btn btn-delete" onclick="deleteOrder(${order.id})">删除</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function updateStats(orders) {
    const pending = orders.filter(o => o.status === 'pending').length;
    const progress = orders.filter(o => o.status === 'in_progress').length;
    const completed = orders.filter(o => o.status === 'completed').length;

    document.getElementById('pendingCount').textContent = pending;
    document.getElementById('progressCount').textContent = progress;
    document.getElementById('completedCount').textContent = completed;
    document.getElementById('totalCount').textContent = orders.length;
}

function getStatusText(status) {
    const map = {
        'pending': '待安装',
        'in_progress': '施工中',
        'completed': '已完工'
    };
    return map[status] || status;
}

function formatDate(dateStr) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN');
}

function truncateText(text, maxLength) {
    if (!text) return '-';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showCreateModal() {
    document.getElementById('modalTitle').textContent = '新建工单';
    document.getElementById('orderForm').reset();
    document.getElementById('orderId').value = '';
    document.getElementById('orderNo').value = '';
    document.getElementById('productType').value = '铝合金门窗';
    document.getElementById('quantity').value = '1';
    document.getElementById('status').value = 'pending';
    document.getElementById('modal').classList.add('active');
}

function showEditModal(id) {
    const order = currentOrders.find(o => o.id === id);
    if (!order) return;

    document.getElementById('modalTitle').textContent = '编辑工单';
    document.getElementById('orderId').value = order.id;
    document.getElementById('orderNo').value = order.order_no;
    document.getElementById('customerName').value = order.customer_name;
    document.getElementById('phone').value = order.phone || '';
    document.getElementById('address').value = order.address;
    document.getElementById('productType').value = order.product_type || '铝合金门窗';
    document.getElementById('quantity').value = order.quantity;
    document.getElementById('installDate').value = order.install_date ? order.install_date.substring(0, 10) : '';
    document.getElementById('status').value = order.status;
    document.getElementById('feedback').value = order.feedback || '';
    document.getElementById('modal').classList.add('active');
}

function hideModal() {
    document.getElementById('modal').classList.remove('active');
}

function handleSubmit(e) {
    e.preventDefault();
    
    const id = document.getElementById('orderId').value;
    const installDateVal = document.getElementById('installDate').value;
    
    const data = {
        order_no: document.getElementById('orderNo').value,
        customer_name: document.getElementById('customerName').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        product_type: document.getElementById('productType').value,
        quantity: parseInt(document.getElementById('quantity').value) || 1,
        install_date: installDateVal ? installDateVal + 'T00:00:00Z' : null,
        status: document.getElementById('status').value,
        feedback: document.getElementById('feedback').value
    };

    const url = id ? `/api/orders/${id}` : '/api/orders';
    const method = id ? 'PUT' : 'POST';

    fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(() => {
        hideModal();
        loadOrders();
    })
    .catch(err => console.error('Error:', err));
}

function completeOrder(id) {
    if (!confirm('确定要将此工单标记为已完工吗？')) return;

    fetch(`/api/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'completed' })
    })
    .then(res => res.json())
    .then(() => loadOrders())
    .catch(err => console.error('Error:', err));
}

function deleteOrder(id) {
    if (!confirm('确定要删除此工单吗？此操作不可恢复！')) return;

    fetch(`/api/orders/${id}`, {
        method: 'DELETE'
    })
    .then(res => res.json())
    .then(() => loadOrders())
    .catch(err => console.error('Error:', err));
}

function showFeedbackModal(id) {
    const order = currentOrders.find(o => o.id === id);
    if (!order) return;

    document.getElementById('feedbackOrderId').value = order.id;
    document.getElementById('feedbackContent').value = order.feedback || '';
    document.getElementById('feedbackModal').classList.add('active');
}

function hideFeedbackModal() {
    document.getElementById('feedbackModal').classList.remove('active');
}

function handleFeedbackSubmit(e) {
    e.preventDefault();
    
    const id = document.getElementById('feedbackOrderId').value;
    const feedback = document.getElementById('feedbackContent').value;

    fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            feedback: feedback,
            customer_name: currentOrders.find(o => o.id == id)?.customer_name,
            address: currentOrders.find(o => o.id == id)?.address
        })
    })
    .then(res => res.json())
    .then(() => {
        hideFeedbackModal();
        loadOrders();
    })
    .catch(err => console.error('Error:', err));
}

function handleSearch(e) {
    if (e.key === 'Enter') {
        loadOrders();
    }
}
