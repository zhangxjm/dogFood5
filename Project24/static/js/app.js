const API_BASE = '/api';

let categories = [];
let products = [];
let customers = [];

document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    loadDashboard();
    loadCategories();
    loadProducts();
    loadCustomers();
    loadPurchases();
    loadAlerts();
});

function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(btn.dataset.tab).classList.add('active');
        });
    });
}

async function apiRequest(url, options = {}) {
    try {
        const response = await fetch(API_BASE + url, {
            headers: { 'Content-Type': 'application/json' },
            ...options
        });
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        return { code: 500, message: '请求失败' };
    }
}

async function loadDashboard() {
    const result = await apiRequest('/dashboard/stats');
    if (result.code === 200 && result.data) {
        document.getElementById('statCategories').textContent = result.data.category_count || 0;
        document.getElementById('statProducts').textContent = result.data.product_count || 0;
        document.getElementById('statCustomers').textContent = result.data.customer_count || 0;
        document.getElementById('statSales').textContent = '¥' + (result.data.total_sales || 0).toFixed(2);
        document.getElementById('statLowStock').textContent = result.data.low_stock_count || 0;
    }
}

async function loadCategories() {
    const result = await apiRequest('/categories');
    if (result.code === 200) {
        categories = result.data || [];
        renderCategories();
    }
}

function renderCategories() {
    const tbody = document.getElementById('categoriesTable');
    tbody.innerHTML = categories.map(cat => `
        <tr>
            <td>${cat.id}</td>
            <td>${cat.name}</td>
            <td>${cat.description || '-'}</td>
            <td>${formatDate(cat.created_at)}</td>
            <td>
                <button class="btn-edit" onclick="editCategory(${cat.id})">编辑</button>
                <button class="btn-danger" onclick="deleteCategory(${cat.id})">删除</button>
            </td>
        </tr>
    `).join('');
}

async function loadProducts() {
    const result = await apiRequest('/products');
    if (result.code === 200) {
        products = result.data || [];
        renderProducts();
    }
}

function renderProducts() {
    const tbody = document.getElementById('productsTable');
    tbody.innerHTML = products.map(p => `
        <tr>
            <td>${p.id}</td>
            <td>${p.name}</td>
            <td>${p.category ? p.category.name : '-'}</td>
            <td>${p.specification || '-'}</td>
            <td>¥${p.price.toFixed(2)}</td>
            <td class="${p.stock_quantity <= p.warning_quantity ? 'low-stock' : ''}">${p.stock_quantity}</td>
            <td>${p.warning_quantity}</td>
            <td>${p.supplier || '-'}</td>
            <td>
                <button class="btn-edit" onclick="editProduct(${p.id})">编辑</button>
                <button class="btn-success" onclick="restockProduct(${p.id})">补货</button>
                <button class="btn-danger" onclick="deleteProduct(${p.id})">删除</button>
            </td>
        </tr>
    `).join('');
}

async function loadCustomers() {
    const result = await apiRequest('/customers');
    if (result.code === 200) {
        customers = result.data || [];
        renderCustomers();
    }
}

function renderCustomers() {
    const tbody = document.getElementById('customersTable');
    tbody.innerHTML = customers.map(c => `
        <tr>
            <td>${c.id}</td>
            <td>${c.name}</td>
            <td>${c.phone || '-'}</td>
            <td>${c.address || '-'}</td>
            <td>${formatDate(c.created_at)}</td>
            <td>
                <button class="btn-edit" onclick="editCustomer(${c.id})">编辑</button>
                <button class="btn-danger" onclick="deleteCustomer(${c.id})">删除</button>
            </td>
        </tr>
    `).join('');
}

async function loadPurchases() {
    const result = await apiRequest('/purchases');
    if (result.code === 200) {
        const records = result.data || [];
        renderPurchases(records);
    }
}

function renderPurchases(records) {
    const tbody = document.getElementById('purchasesTable');
    tbody.innerHTML = records.map(p => `
        <tr>
            <td>${p.id}</td>
            <td>${p.customer ? p.customer.name : '-'}</td>
            <td>${p.product ? p.product.name : '-'}</td>
            <td>${p.quantity}</td>
            <td>¥${p.unit_price.toFixed(2)}</td>
            <td>¥${p.total_price.toFixed(2)}</td>
            <td>${formatDate(p.purchase_date)}</td>
            <td>${p.remark || '-'}</td>
        </tr>
    `).join('');
}

async function loadAlerts() {
    const result = await apiRequest('/alerts/restock');
    if (result.code === 200) {
        const alerts = result.data || [];
        renderAlerts(alerts);
    }
}

function renderAlerts(alerts) {
    const container = document.getElementById('alertsContainer');
    
    if (alerts.length === 0) {
        container.innerHTML = `
            <div class="alert-empty">
                <div class="icon">🎉</div>
                <h3>太棒了！</h3>
                <p>当前没有需要补货的商品</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = alerts.map(alert => `
        <div class="alert-card">
            <div class="alert-info">
                <h4>${alert.product_name}</h4>
                <p>品类: ${alert.category_name} | 当前库存: ${alert.current_stock} | 预警值: ${alert.warning_quantity}</p>
                <p>建议补货: ${alert.need_restock} 件 | 供应商: ${alert.supplier || '未设置'}</p>
            </div>
            <div class="alert-actions">
                <button class="btn-success" onclick="restockProduct(${alert.product_id})">立即补货</button>
            </div>
        </div>
    `).join('');
}

function showModal(title, content) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalBody').innerHTML = content;
    document.getElementById('modal').classList.add('show');
}

function closeModal() {
    document.getElementById('modal').classList.remove('show');
}

function showCategoryModal(id = null) {
    const cat = id ? categories.find(c => c.id === id) : null;
    const title = id ? '编辑品类' : '新增品类';
    const content = `
        <form onsubmit="saveCategory(event, ${id})">
            <div class="form-group">
                <label>品类名称</label>
                <input type="text" id="catName" value="${cat ? cat.name : ''}" required>
            </div>
            <div class="form-group">
                <label>描述</label>
                <textarea id="catDesc" rows="3">${cat ? cat.description || '' : ''}</textarea>
            </div>
            <div class="form-actions">
                <button type="button" class="btn-cancel" onclick="closeModal()">取消</button>
                <button type="submit" class="btn-submit">保存</button>
            </div>
        </form>
    `;
    showModal(title, content);
}

async function saveCategory(event, id) {
    event.preventDefault();
    const data = {
        name: document.getElementById('catName').value,
        description: document.getElementById('catDesc').value
    };
    
    const result = await apiRequest(id ? `/categories/${id}` : '/categories', {
        method: id ? 'PUT' : 'POST',
        body: JSON.stringify(data)
    });
    
    if (result.code === 200 || result.code === 201) {
        closeModal();
        loadCategories();
        loadDashboard();
    } else {
        alert(result.message);
    }
}

function editCategory(id) {
    showCategoryModal(id);
}

async function deleteCategory(id) {
    if (confirm('确定要删除这个品类吗？')) {
        await apiRequest(`/categories/${id}`, { method: 'DELETE' });
        loadCategories();
        loadDashboard();
    }
}

function showProductModal(id = null) {
    const p = id ? products.find(x => x.id === id) : null;
    const title = id ? '编辑商品' : '新增商品';
    const categoryOptions = categories.map(c => 
        `<option value="${c.id}" ${p && p.category_id === c.id ? 'selected' : ''}>${c.name}</option>`
    ).join('');
    
    const content = `
        <form onsubmit="saveProduct(event, ${id})">
            <div class="form-group">
                <label>所属品类</label>
                <select id="prodCategory" required>${categoryOptions}</select>
            </div>
            <div class="form-group">
                <label>商品名称</label>
                <input type="text" id="prodName" value="${p ? p.name : ''}" required>
            </div>
            <div class="form-group">
                <label>规格型号</label>
                <input type="text" id="prodSpec" value="${p ? p.specification || '' : ''}">
            </div>
            <div class="form-group">
                <label>单价</label>
                <input type="number" id="prodPrice" step="0.01" value="${p ? p.price : ''}" required>
            </div>
            <div class="form-group">
                <label>库存数量</label>
                <input type="number" id="prodStock" value="${p ? p.stock_quantity : 0}" required>
            </div>
            <div class="form-group">
                <label>预警数量</label>
                <input type="number" id="prodWarning" value="${p ? p.warning_quantity : 10}" required>
            </div>
            <div class="form-group">
                <label>供应商</label>
                <input type="text" id="prodSupplier" value="${p ? p.supplier || '' : ''}">
            </div>
            <div class="form-actions">
                <button type="button" class="btn-cancel" onclick="closeModal()">取消</button>
                <button type="submit" class="btn-submit">保存</button>
            </div>
        </form>
    `;
    showModal(title, content);
}

async function saveProduct(event, id) {
    event.preventDefault();
    const data = {
        category_id: parseInt(document.getElementById('prodCategory').value),
        name: document.getElementById('prodName').value,
        specification: document.getElementById('prodSpec').value,
        price: parseFloat(document.getElementById('prodPrice').value),
        stock_quantity: parseInt(document.getElementById('prodStock').value),
        warning_quantity: parseInt(document.getElementById('prodWarning').value),
        supplier: document.getElementById('prodSupplier').value
    };
    
    const result = await apiRequest(id ? `/products/${id}` : '/products', {
        method: id ? 'PUT' : 'POST',
        body: JSON.stringify(data)
    });
    
    if (result.code === 200 || result.code === 201) {
        closeModal();
        loadProducts();
        loadAlerts();
        loadDashboard();
    } else {
        alert(result.message);
    }
}

function editProduct(id) {
    showProductModal(id);
}

async function deleteProduct(id) {
    if (confirm('确定要删除这个商品吗？')) {
        await apiRequest(`/products/${id}`, { method: 'DELETE' });
        loadProducts();
        loadAlerts();
        loadDashboard();
    }
}

function restockProduct(id) {
    const content = `
        <form onsubmit="doRestock(event, ${id})">
            <div class="form-group">
                <label>补货数量</label>
                <input type="number" id="restockQty" value="10" required>
            </div>
            <div class="form-actions">
                <button type="button" class="btn-cancel" onclick="closeModal()">取消</button>
                <button type="submit" class="btn-submit">确认补货</button>
            </div>
        </form>
    `;
    showModal('商品补货', content);
}

async function doRestock(event, id) {
    event.preventDefault();
    const quantity = parseInt(document.getElementById('restockQty').value);
    
    const result = await apiRequest(`/products/${id}/restock`, {
        method: 'POST',
        body: JSON.stringify({ quantity })
    });
    
    if (result.code === 200) {
        closeModal();
        loadProducts();
        loadAlerts();
        loadDashboard();
    } else {
        alert(result.message);
    }
}

function showCustomerModal(id = null) {
    const c = id ? customers.find(x => x.id === id) : null;
    const title = id ? '编辑客户' : '新增客户';
    const content = `
        <form onsubmit="saveCustomer(event, ${id})">
            <div class="form-group">
                <label>客户姓名</label>
                <input type="text" id="custName" value="${c ? c.name : ''}" required>
            </div>
            <div class="form-group">
                <label>联系电话</label>
                <input type="tel" id="custPhone" value="${c ? c.phone || '' : ''}">
            </div>
            <div class="form-group">
                <label>地址</label>
                <textarea id="custAddr" rows="3">${c ? c.address || '' : ''}</textarea>
            </div>
            <div class="form-actions">
                <button type="button" class="btn-cancel" onclick="closeModal()">取消</button>
                <button type="submit" class="btn-submit">保存</button>
            </div>
        </form>
    `;
    showModal(title, content);
}

async function saveCustomer(event, id) {
    event.preventDefault();
    const data = {
        name: document.getElementById('custName').value,
        phone: document.getElementById('custPhone').value,
        address: document.getElementById('custAddr').value
    };
    
    const result = await apiRequest(id ? `/customers/${id}` : '/customers', {
        method: id ? 'PUT' : 'POST',
        body: JSON.stringify(data)
    });
    
    if (result.code === 200 || result.code === 201) {
        closeModal();
        loadCustomers();
        loadDashboard();
    } else {
        alert(result.message);
    }
}

function editCustomer(id) {
    showCustomerModal(id);
}

async function deleteCustomer(id) {
    if (confirm('确定要删除这个客户吗？')) {
        await apiRequest(`/customers/${id}`, { method: 'DELETE' });
        loadCustomers();
        loadDashboard();
    }
}

function showPurchaseModal() {
    const customerOptions = customers.map(c => 
        `<option value="${c.id}">${c.name}</option>`
    ).join('');
    
    const productOptions = products.map(p => 
        `<option value="${p.id}" data-price="${p.price}" data-stock="${p.stock_quantity}">${p.name} (库存: ${p.stock_quantity})</option>`
    ).join('');
    
    const content = `
        <form onsubmit="savePurchase(event)">
            <div class="form-group">
                <label>选择客户</label>
                <select id="purCustomer" required>${customerOptions}</select>
            </div>
            <div class="form-group">
                <label>选择商品</label>
                <select id="purProduct" required onchange="updateTotalPrice()">${productOptions}</select>
            </div>
            <div class="form-group">
                <label>购买数量</label>
                <input type="number" id="purQty" value="1" min="1" required onchange="updateTotalPrice()">
            </div>
            <div class="form-group">
                <label>总价</label>
                <input type="text" id="purTotal" readonly>
            </div>
            <div class="form-group">
                <label>备注</label>
                <textarea id="purRemark" rows="2"></textarea>
            </div>
            <div class="form-actions">
                <button type="button" class="btn-cancel" onclick="closeModal()">取消</button>
                <button type="submit" class="btn-submit">确认采购</button>
            </div>
        </form>
    `;
    showModal('新增采购', content);
    setTimeout(updateTotalPrice, 100);
}

function updateTotalPrice() {
    const select = document.getElementById('purProduct');
    const qty = parseInt(document.getElementById('purQty').value) || 0;
    const price = parseFloat(select.options[select.selectedIndex].dataset.price) || 0;
    document.getElementById('purTotal').value = '¥' + (price * qty).toFixed(2);
}

async function savePurchase(event) {
    event.preventDefault();
    const data = {
        customer_id: parseInt(document.getElementById('purCustomer').value),
        product_id: parseInt(document.getElementById('purProduct').value),
        quantity: parseInt(document.getElementById('purQty').value),
        remark: document.getElementById('purRemark').value
    };
    
    const result = await apiRequest('/purchases', {
        method: 'POST',
        body: JSON.stringify(data)
    });
    
    if (result.code === 201) {
        closeModal();
        loadPurchases();
        loadProducts();
        loadAlerts();
        loadDashboard();
    } else {
        alert(result.message);
    }
}

function formatDate(dateStr) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

document.getElementById('modal').addEventListener('click', (e) => {
    if (e.target.id === 'modal') {
        closeModal();
    }
});
