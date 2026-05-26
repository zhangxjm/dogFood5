const API_BASE = '/api';

function loadProducts() {
    const category = document.getElementById('categoryFilter').value;
    const keyword = document.getElementById('searchInput').value;
    const alert = document.getElementById('alertOnly').checked;
    
    let url = `${API_BASE}/products?`;
    if (category) url += `category=${category}&`;
    if (keyword) url += `keyword=${keyword}&`;
    if (alert) url += `alert=true&`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            renderProductTable(data);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('加载数据失败');
        });
}

function renderProductTable(products) {
    const tbody = document.getElementById('productTable');
    
    if (products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="11" style="text-align:center; padding:40px; color:#999;">暂无数据</td></tr>';
        return;
    }

    tbody.innerHTML = products.map(product => {
        let statusClass = 'status-normal';
        let statusText = '正常';
        
        if (product.stock <= product.min_stock) {
            statusClass = product.stock === 0 ? 'status-danger' : 'status-warning';
            statusText = product.stock === 0 ? '缺货' : '库存不足';
        }

        return `
            <tr>
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${product.category || '-'}</td>
                <td>${product.unit || '-'}</td>
                <td>${product.stock}</td>
                <td>${product.min_stock}</td>
                <td>¥${product.purchase_price.toFixed(2)}</td>
                <td>¥${product.sell_price.toFixed(2)}</td>
                <td>${product.supplier || '-'}</td>
                <td class="${statusClass}">${statusText}</td>
                <td class="action-buttons">
                    <a href="/products/edit/${product.id}" class="btn-edit">编辑</a>
                    <button onclick="deleteProduct(${product.id})" class="btn-delete">删除</button>
                    <button onclick="showRestockModal(${product.id})" class="btn-restock">进货</button>
                    <button onclick="showSellModal(${product.id})" class="btn-sell">销售</button>
                </td>
            </tr>
        `;
    }).join('');
}

function saveProduct() {
    const id = document.getElementById('productId').value;
    const product = {
        name: document.getElementById('name').value,
        category: document.getElementById('category').value,
        unit: document.getElementById('unit').value,
        stock: parseInt(document.getElementById('stock').value) || 0,
        min_stock: parseInt(document.getElementById('minStock').value) || 0,
        purchase_price: parseFloat(document.getElementById('purchasePrice').value) || 0,
        sell_price: parseFloat(document.getElementById('sellPrice').value) || 0,
        supplier: document.getElementById('supplier').value,
        remark: document.getElementById('remark').value
    };

    const url = id ? `${API_BASE}/products/${id}` : `${API_BASE}/products`;
    const method = id ? 'PUT' : 'POST';

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
    })
    .then(response => response.json())
    .then(data => {
        if (data.id) {
            alert('保存成功！');
            window.location.href = '/';
        } else {
            alert('保存失败：' + (data.error || '未知错误'));
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('保存失败');
    });
}

function deleteProduct(id) {
    if (!confirm('确定要删除这个货品吗？')) return;

    fetch(`${API_BASE}/products/${id}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert('删除成功！');
            loadProducts();
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('删除失败');
    });
}

function showRestockModal(productId) {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modalBody');
    document.getElementById('modalTitle').textContent = '进货登记';

    modalBody.innerHTML = `
        <div class="form-group">
            <label>数量</label>
            <input type="number" id="restockQty" min="1" placeholder="请输入进货数量">
        </div>
        <div class="form-group">
            <label>单价 (元)</label>
            <input type="number" id="restockPrice" min="0" step="0.01" placeholder="为空则使用原进货价">
        </div>
        <div class="form-group">
            <label>操作员</label>
            <input type="text" id="restockOperator" placeholder="请输入操作员姓名">
        </div>
        <div class="form-group">
            <label>备注</label>
            <input type="text" id="restockRemark" placeholder="可选">
        </div>
        <div class="form-actions">
            <button class="btn-primary" onclick="restock(${productId})">确认进货</button>
        </div>
    `;

    modal.style.display = 'block';
}

function restock(productId) {
    const data = {
        quantity: parseInt(document.getElementById('restockQty').value),
        price: parseFloat(document.getElementById('restockPrice').value) || 0,
        operator: document.getElementById('restockOperator').value,
        remark: document.getElementById('restockRemark').value
    };

    if (!data.quantity || data.quantity <= 0) {
        alert('请输入有效的进货数量');
        return;
    }

    fetch(`${API_BASE}/products/${productId}/restock`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        if (result.message) {
            alert('进货成功！当前库存：' + result.stock);
            closeModal();
            loadProducts();
        } else {
            alert('进货失败：' + (result.error || '未知错误'));
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('进货失败');
    });
}

function showSellModal(productId) {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modalBody');
    document.getElementById('modalTitle').textContent = '销售登记';

    modalBody.innerHTML = `
        <div class="form-group">
            <label>数量</label>
            <input type="number" id="sellQty" min="1" placeholder="请输入销售数量">
        </div>
        <div class="form-group">
            <label>单价 (元)</label>
            <input type="number" id="sellPrice" min="0" step="0.01" placeholder="为空则使用原售价">
        </div>
        <div class="form-group">
            <label>操作员</label>
            <input type="text" id="sellOperator" placeholder="请输入操作员姓名">
        </div>
        <div class="form-group">
            <label>备注</label>
            <input type="text" id="sellRemark" placeholder="可选">
        </div>
        <div class="form-actions">
            <button class="btn-primary" onclick="sell(${productId})">确认销售</button>
        </div>
    `;

    modal.style.display = 'block';
}

function sell(productId) {
    const data = {
        quantity: parseInt(document.getElementById('sellQty').value),
        price: parseFloat(document.getElementById('sellPrice').value) || 0,
        operator: document.getElementById('sellOperator').value,
        remark: document.getElementById('sellRemark').value
    };

    if (!data.quantity || data.quantity <= 0) {
        alert('请输入有效的销售数量');
        return;
    }

    fetch(`${API_BASE}/products/${productId}/sell`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        if (result.message) {
            alert('销售成功！当前库存：' + result.stock);
            closeModal();
            loadProducts();
        } else {
            alert('销售失败：' + (result.error || '未知错误'));
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('销售失败');
    });
}

function loadStockAlerts() {
    fetch(`${API_BASE}/stock/alerts`)
        .then(response => response.json())
        .then(data => {
            renderAlerts(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function renderAlerts(products) {
    const alertList = document.getElementById('alertList');
    
    if (products.length === 0) {
        alertList.innerHTML = '<div class="alert-item-info">所有货品库存充足，暂无缺货提醒</div>';
        return;
    }

    alertList.innerHTML = products.map(product => {
        const dangerClass = product.stock === 0 ? 'alert-item-danger' : '';
        const statusText = product.stock === 0 ? '缺货' : '库存不足';
        
        return `
            <div class="alert-item ${dangerClass}">
                <span><strong>${product.name}</strong> - 当前库存: ${product.stock}${product.unit || ''} (最低: ${product.min_stock})</span>
                <span class="status-${product.stock === 0 ? 'danger' : 'warning'}">${statusText}</span>
            </div>
        `;
    }).join('');
}

function loadStockList() {
    const keyword = document.getElementById('stockSearch').value;
    let url = `${API_BASE}/products?`;
    if (keyword) url += `keyword=${keyword}&`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            renderStockTable(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function renderStockTable(products) {
    const tbody = document.getElementById('stockTable');
    
    if (products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:40px; color:#999;">暂无数据</td></tr>';
        return;
    }

    tbody.innerHTML = products.map(product => {
        let statusClass = 'status-normal';
        let statusText = '正常';
        
        if (product.stock <= product.min_stock) {
            statusClass = product.stock === 0 ? 'status-danger' : 'status-warning';
            statusText = product.stock === 0 ? '缺货' : '库存不足';
        }

        return `
            <tr>
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${product.category || '-'}</td>
                <td>${product.stock}</td>
                <td>${product.min_stock}</td>
                <td class="${statusClass}">${statusText}</td>
                <td class="action-buttons">
                    <button onclick="showRestockModal(${product.id})" class="btn-restock">进货</button>
                    <button onclick="showSellModal(${product.id})" class="btn-sell">销售</button>
                </td>
            </tr>
        `;
    }).join('');
}

function loadLogs() {
    const type = document.getElementById('logTypeFilter').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    let url = `${API_BASE}/logs?`;
    if (type) url += `type=${type}&`;
    if (startDate) url += `start_date=${startDate}&`;
    if (endDate) url += `end_date=${endDate}&`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            renderLogTable(data);
            updateStats(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function renderLogTable(logs) {
    const tbody = document.getElementById('logTable');
    
    if (logs.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" style="text-align:center; padding:40px; color:#999;">暂无数据</td></tr>';
        return;
    }

    tbody.innerHTML = logs.map(log => {
        const typeClass = log.type === '进货' ? 'status-normal' : 'status-warning';
        
        return `
            <tr>
                <td>${log.id}</td>
                <td>${formatDate(log.created_at)}</td>
                <td>${log.product ? log.product.name : '-'}</td>
                <td class="${typeClass}">${log.type}</td>
                <td>${log.quantity}</td>
                <td>¥${log.unit_price.toFixed(2)}</td>
                <td>¥${log.total_price.toFixed(2)}</td>
                <td>${log.operator || '-'}</td>
                <td>${log.remark || '-'}</td>
            </tr>
        `;
    }).join('');
}

function updateStats(logs) {
    let totalIn = 0;
    let totalOut = 0;
    let totalInAmount = 0;
    let totalOutAmount = 0;

    logs.forEach(log => {
        if (log.type === '进货') {
            totalIn += log.quantity;
            totalInAmount += log.total_price;
        } else if (log.type === '销售') {
            totalOut += log.quantity;
            totalOutAmount += log.total_price;
        }
    });

    document.getElementById('totalIn').textContent = totalIn;
    document.getElementById('totalOut').textContent = totalOut;
    document.getElementById('totalInAmount').textContent = '¥' + totalInAmount.toFixed(2);
    document.getElementById('totalOutAmount').textContent = '¥' + totalOutAmount.toFixed(2);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        closeModal();
    }
};

if (document.getElementById('productTable')) {
    loadProducts();
}
