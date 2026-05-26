const API_BASE = '/api';

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN') + ' ' + date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
}

function formatMoney(amount) {
    return '¥' + parseFloat(amount || 0).toFixed(2);
}

async function apiFetch(url, options = {}) {
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    
    const response = await fetch(API_BASE + url, { ...defaultOptions, ...options });
    
    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || '请求失败');
    }
    
    return response.json();
}

async function loadDashboardStats() {
    try {
        const stats = await apiFetch('/dashboard/stats');
        
        document.getElementById('stat-tool-count').textContent = stats.tool_count;
        document.getElementById('stat-category-count').textContent = stats.category_count;
        document.getElementById('stat-farmer-count').textContent = stats.farmer_count;
        document.getElementById('stat-purchase-count').textContent = stats.purchase_count;
        document.getElementById('stat-repair-count').textContent = stats.repair_count;
        document.getElementById('stat-low-stock').textContent = stats.low_stock_count;
        document.getElementById('stat-total-sales').textContent = formatMoney(stats.total_sales);
        document.getElementById('stat-repair-cost').textContent = formatMoney(stats.total_repair_cost);
        document.getElementById('stat-today-purchases').textContent = stats.today_purchases;
        document.getElementById('stat-today-repairs').textContent = stats.today_repairs;
        document.getElementById('stat-pending-repairs').textContent = stats.pending_repairs;
    } catch (error) {
        console.error('Failed to load stats:', error);
    }
}

async function loadCategories() {
    try {
        const categories = await apiFetch('/categories');
        renderCategories(categories);
        populateCategorySelects(categories);
    } catch (error) {
        console.error('Failed to load categories:', error);
    }
}

function renderCategories(categories) {
    const container = document.getElementById('categories-list');
    if (!container) return;
    
    container.innerHTML = categories.map(cat => `
        <div class="card">
            <div class="card-header">
                <h3>${cat.name}</h3>
                <span class="badge badge-info">${cat.tools ? cat.tools.length : 0} 件农具</span>
            </div>
            <div class="card-body">
                <p><strong>编码：</strong>${cat.code}</p>
                <p><strong>描述：</strong>${cat.description || '-'}</p>
                <p><strong>创建时间：</strong>${formatDate(cat.created_at)}</p>
            </div>
        </div>
    `).join('');
}

function populateCategorySelects(categories) {
    const selects = document.querySelectorAll('select[data-category-select]');
    selects.forEach(select => {
        const currentValue = select.value;
        select.innerHTML = '<option value="">请选择品类</option>' + 
            categories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('');
        select.value = currentValue;
    });
}

async function loadTools(filterCategoryId = null) {
    try {
        let url = '/tools';
        if (filterCategoryId) {
            url = `/tools/category/${filterCategoryId}`;
        }
        const tools = await apiFetch(url);
        renderTools(tools);
        populateToolSelects(tools);
    } catch (error) {
        console.error('Failed to load tools:', error);
    }
}

function renderTools(tools) {
    const container = document.getElementById('tools-table-body');
    if (!container) return;
    
    if (tools.length === 0) {
        container.innerHTML = '<tr><td colspan="8" class="empty-state"><i class="fas fa-toolbox"></i><p>暂无农具数据</p></td></tr>';
        return;
    }
    
    container.innerHTML = tools.map(tool => `
        <tr>
            <td>${tool.code}</td>
            <td>${tool.name}</td>
            <td>${tool.category ? tool.category.name : '-'}</td>
            <td>${tool.brand}</td>
            <td>${tool.model}</td>
            <td class="${tool.stock <= tool.min_stock ? 'text-danger' : ''}">${tool.stock} ${tool.unit}</td>
            <td>${formatMoney(tool.price)}</td>
            <td>${tool.location || '-'}</td>
        </tr>
    `).join('');
}

function populateToolSelects(tools) {
    const selects = document.querySelectorAll('select[data-tool-select]');
    selects.forEach(select => {
        const currentValue = select.value;
        select.innerHTML = '<option value="">请选择农具</option>' + 
            tools.map(tool => `<option value="${tool.id}">${tool.name} (${tool.code})</option>`).join('');
        select.value = currentValue;
    });
}

async function loadFarmers() {
    try {
        const farmers = await apiFetch('/farmers');
        populateFarmerSelects(farmers);
    } catch (error) {
        console.error('Failed to load farmers:', error);
    }
}

function populateFarmerSelects(farmers) {
    const selects = document.querySelectorAll('select[data-farmer-select]');
    selects.forEach(select => {
        const currentValue = select.value;
        select.innerHTML = '<option value="">请选择农户</option>' + 
            farmers.map(farmer => `<option value="${farmer.id}">${farmer.name} - ${farmer.village}</option>`).join('');
        select.value = currentValue;
    });
}

async function loadPurchases() {
    try {
        const purchases = await apiFetch('/purchases');
        renderPurchases(purchases);
    } catch (error) {
        console.error('Failed to load purchases:', error);
    }
}

function renderPurchases(purchases) {
    const container = document.getElementById('purchases-table-body');
    if (!container) return;
    
    if (purchases.length === 0) {
        container.innerHTML = '<tr><td colspan="8" class="empty-state"><i class="fas fa-shopping-cart"></i><p>暂无采购记录</p></td></tr>';
        return;
    }
    
    container.innerHTML = purchases.map(purchase => `
        <tr>
            <td>${formatDate(purchase.purchase_date)}</td>
            <td>${purchase.farmer ? purchase.farmer.name : '-'}</td>
            <td>${purchase.tool ? purchase.tool.name : '-'}</td>
            <td>${purchase.quantity}</td>
            <td>${formatMoney(purchase.unit_price)}</td>
            <td>${formatMoney(purchase.total_price)}</td>
            <td><span class="badge badge-info">${purchase.payment_method || '-'}</span></td>
            <td>${purchase.remark || '-'}</td>
        </tr>
    `).join('');
}

async function loadRepairs(filterStatus = null) {
    try {
        let url = '/repairs';
        if (filterStatus) {
            url += `?status=${encodeURIComponent(filterStatus)}`;
        }
        const repairs = await apiFetch(url);
        renderRepairs(repairs);
    } catch (error) {
        console.error('Failed to load repairs:', error);
    }
}

function renderRepairs(repairs) {
    const container = document.getElementById('repairs-table-body');
    if (!container) return;
    
    if (repairs.length === 0) {
        container.innerHTML = '<tr><td colspan="8" class="empty-state"><i class="fas fa-wrench"></i><p>暂无维修记录</p></td></tr>';
        return;
    }
    
    container.innerHTML = repairs.map(repair => {
        let statusBadge = '';
        switch(repair.status) {
            case '待维修':
                statusBadge = '<span class="badge badge-danger">待维修</span>';
                break;
            case '维修中':
                statusBadge = '<span class="badge badge-warning">维修中</span>';
                break;
            case '已完成':
                statusBadge = '<span class="badge badge-success">已完成</span>';
                break;
            default:
                statusBadge = `<span class="badge badge-secondary">${repair.status}</span>`;
        }
        
        return `
            <tr>
                <td>${formatDate(repair.start_date)}</td>
                <td>${repair.tool ? repair.tool.name : '-'}</td>
                <td>${repair.farmer ? repair.farmer.name : '-'}</td>
                <td>${repair.description || '-'}</td>
                <td>${repair.repair_man || '-'}</td>
                <td>${formatMoney(repair.cost)}</td>
                <td>${statusBadge}</td>
                <td>${repair.end_date ? formatDate(repair.end_date) : '-'}</td>
            </tr>
        `;
    }).join('');
}

async function loadInventory() {
    try {
        const inventory = await apiFetch('/inventory');
        renderInventory(inventory);
    } catch (error) {
        console.error('Failed to load inventory:', error);
    }
}

function renderInventory(records) {
    const container = document.getElementById('inventory-table-body');
    if (!container) return;
    
    if (records.length === 0) {
        container.innerHTML = '<tr><td colspan="7" class="empty-state"><i class="fas fa-clipboard-list"></i><p>暂无盘点记录</p></td></tr>';
        return;
    }
    
    container.innerHTML = records.map(record => {
        const diffClass = record.diff > 0 ? 'text-success' : (record.diff < 0 ? 'text-danger' : '');
        const diffSign = record.diff > 0 ? '+' : '';
        
        return `
            <tr>
                <td>${formatDate(record.check_date)}</td>
                <td>${record.tool ? record.tool.name : '-'}</td>
                <td>${record.prev_stock}</td>
                <td>${record.new_stock}</td>
                <td class="${diffClass}">${diffSign}${record.diff}</td>
                <td>${record.reason || '-'}</td>
                <td>${record.operator || '-'}</td>
            </tr>
        `;
    }).join('');
}

async function submitPurchaseForm(event) {
    event.preventDefault();
    
    const formData = {
        farmer_id: parseInt(document.getElementById('purchase-farmer').value),
        tool_id: parseInt(document.getElementById('purchase-tool').value),
        quantity: parseInt(document.getElementById('purchase-quantity').value),
        unit_price: parseFloat(document.getElementById('purchase-unit-price').value),
        total_price: parseFloat(document.getElementById('purchase-total-price').value),
        payment_method: document.getElementById('purchase-payment').value,
        remark: document.getElementById('purchase-remark').value
    };
    
    try {
        await apiFetch('/purchases', {
            method: 'POST',
            body: JSON.stringify(formData)
        });
        showNotification('采购记录添加成功');
        closeModal('purchase-modal');
        document.getElementById('purchase-form').reset();
        loadPurchases();
        loadTools();
        loadDashboardStats();
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

function calculateTotalPrice() {
    const quantity = parseFloat(document.getElementById('purchase-quantity').value) || 0;
    const unitPrice = parseFloat(document.getElementById('purchase-unit-price').value) || 0;
    document.getElementById('purchase-total-price').value = (quantity * unitPrice).toFixed(2);
}

async function submitRepairForm(event) {
    event.preventDefault();
    
    const formData = {
        tool_id: parseInt(document.getElementById('repair-tool').value),
        farmer_id: parseInt(document.getElementById('repair-farmer').value),
        description: document.getElementById('repair-description').value,
        repair_man: document.getElementById('repair-man').value,
        cost: parseFloat(document.getElementById('repair-cost').value) || 0,
        status: document.getElementById('repair-status').value
    };
    
    try {
        await apiFetch('/repairs', {
            method: 'POST',
            body: JSON.stringify(formData)
        });
        showNotification('维修记录添加成功');
        closeModal('repair-modal');
        document.getElementById('repair-form').reset();
        loadRepairs();
        loadDashboardStats();
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

async function submitInventoryForm(event) {
    event.preventDefault();
    
    const formData = {
        tool_id: parseInt(document.getElementById('inventory-tool').value),
        prev_stock: parseInt(document.getElementById('inventory-prev-stock').value),
        new_stock: parseInt(document.getElementById('inventory-new-stock').value),
        reason: document.getElementById('inventory-reason').value,
        operator: document.getElementById('inventory-operator').value
    };
    
    try {
        await apiFetch('/inventory', {
            method: 'POST',
            body: JSON.stringify(formData)
        });
        showNotification('库存盘点记录添加成功');
        closeModal('inventory-modal');
        document.getElementById('inventory-form').reset();
        loadInventory();
        loadTools();
        loadDashboardStats();
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

async function loadToolStock() {
    const toolId = document.getElementById('inventory-tool').value;
    if (toolId) {
        try {
            const tool = await apiFetch(`/tools/${toolId}`);
            document.getElementById('inventory-prev-stock').value = tool.stock;
        } catch (error) {
            console.error('Failed to load tool:', error);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname;
    
    document.querySelectorAll('.nav-menu a').forEach(link => {
        if (link.getAttribute('href') === currentPage || 
            (currentPage === '/' && link.getAttribute('href') === '/')) {
            link.classList.add('active');
        }
    });
    
    loadDashboardStats();
    
    if (currentPage === '/' || currentPage === '/tools') {
        loadCategories();
        loadTools();
    }
    
    if (currentPage === '/purchases') {
        loadPurchases();
        loadFarmers();
        loadTools();
    }
    
    if (currentPage === '/repairs') {
        loadRepairs();
        loadFarmers();
        loadTools();
    }
    
    if (currentPage === '/inventory') {
        loadInventory();
        loadTools();
    }
    
    document.querySelectorAll('.modal .close-btn, .modal .modal-content').forEach(el => {
        el.addEventListener('click', (e) => {
            if (el.classList.contains('close-btn') || e.target === el) {
                el.closest('.modal').classList.remove('active');
            }
        });
    });
    
    document.getElementById('purchase-quantity')?.addEventListener('input', calculateTotalPrice);
    document.getElementById('purchase-unit-price')?.addEventListener('input', calculateTotalPrice);
    document.getElementById('inventory-tool')?.addEventListener('change', loadToolStock);
    
    document.getElementById('purchase-form')?.addEventListener('submit', submitPurchaseForm);
    document.getElementById('repair-form')?.addEventListener('submit', submitRepairForm);
    document.getElementById('inventory-form')?.addEventListener('submit', submitInventoryForm);
    
    document.getElementById('filter-category')?.addEventListener('change', (e) => {
        loadTools(e.target.value || null);
    });
    
    document.getElementById('filter-status')?.addEventListener('change', (e) => {
        loadRepairs(e.target.value || null);
    });
});
