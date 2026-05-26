let currentTripId = null;
let categories = [];

async function loadTrips() {
  try {
    const response = await fetch('/api/trips');
    const trips = await response.json();
    const select = document.getElementById('tripSelect');
    select.innerHTML = '<option value="">请选择旅行...</option>';
    trips.forEach(trip => {
      const option = document.createElement('option');
      option.value = trip.id;
      option.textContent = trip.name;
      select.appendChild(option);
    });
    if (trips.length > 0) {
      select.value = trips[0].id;
      currentTripId = trips[0].id;
      loadTripData();
    }
  } catch (error) {
    console.error('Error loading trips:', error);
  }
}

async function loadCategories() {
  try {
    const response = await fetch('/api/categories');
    categories = await response.json();
    const select = document.getElementById('itemCategory');
    select.innerHTML = '';
    categories.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat.id;
      option.textContent = `${cat.icon} ${cat.name}`;
      select.appendChild(option);
    });
  } catch (error) {
    console.error('Error loading categories:', error);
  }
}

function loadTripData() {
  const select = document.getElementById('tripSelect');
  currentTripId = select.value;
  if (currentTripId) {
    loadItems();
    loadRoutes();
    loadBudget();
  } else {
    document.getElementById('itemsContainer').innerHTML = '<div class="empty-state"><div class="empty-state-icon">🎒</div><div class="empty-state-text">请先选择或创建一个旅行</div></div>';
    document.getElementById('routesContainer').innerHTML = '<div class="empty-state"><div class="empty-state-icon">🗺️</div><div class="empty-state-text">请先选择或创建一个旅行</div></div>';
    document.getElementById('budgetSummary').innerHTML = '';
    document.getElementById('budgetContainer').innerHTML = '<div class="empty-state"><div class="empty-state-icon">💰</div><div class="empty-state-text">请先选择或创建一个旅行</div></div>';
  }
}

async function loadItems() {
  if (!currentTripId) return;
  try {
    const response = await fetch(`/api/trips/${currentTripId}/items`);
    const items = await response.json();
    const container = document.getElementById('itemsContainer');

    if (items.length === 0) {
      container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📦</div><div class="empty-state-text">暂无物品，点击上方按钮添加</div></div>';
      return;
    }

    const grouped = {};
    items.forEach(item => {
      const catName = item.category_name || '其他';
      if (!grouped[catName]) grouped[catName] = [];
      grouped[catName].push(item);
    });

    let html = '';
    for (const [catName, catItems] of Object.entries(grouped)) {
      const cat = categories.find(c => c.name === catName) || { icon: '📦' };
      html += `
        <div class="category-group">
          <div class="category-header">
            <span class="category-icon">${cat.icon}</span>
            <span>${catName}</span>
            <span style="margin-left: auto; font-size: 14px; color: #999;">${catItems.filter(i => i.packed).length}/${catItems.length} 已打包</span>
          </div>
          <div class="item-list">
      `;
      catItems.forEach(item => {
        html += `
          <div class="item ${item.packed ? 'packed' : ''}">
            <input type="checkbox" class="item-checkbox" ${item.packed ? 'checked' : ''} onchange="toggleItem(${item.id})">
            <span class="item-name">${item.name}</span>
            <span class="item-quantity">x${item.quantity}</span>
            <div class="item-actions">
              <button class="btn btn-edit" onclick="editItem(${item.id})">编辑</button>
              <button class="btn btn-danger" onclick="deleteItem(${item.id})">删除</button>
            </div>
          </div>
        `;
      });
      html += '</div></div>';
    }
    container.innerHTML = html;
  } catch (error) {
    console.error('Error loading items:', error);
  }
}

async function loadRoutes() {
  if (!currentTripId) return;
  try {
    const response = await fetch(`/api/trips/${currentTripId}/routes`);
    const routes = await response.json();
    const container = document.getElementById('routesContainer');

    if (routes.length === 0) {
      container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📍</div><div class="empty-state-text">暂无路线，点击上方按钮添加</div></div>';
      return;
    }

    let html = '';
    routes.forEach(route => {
      html += `
        <div class="route-card">
          <div class="route-day">第 ${route.day_number} 天</div>
          <div class="route-actions">
            <button class="btn btn-edit" onclick="editRoute(${route.id})">编辑</button>
            <button class="btn btn-danger" onclick="deleteRoute(${route.id})">删除</button>
          </div>
          <div class="route-location">📍 ${route.location || '未指定地点'}</div>
          <div class="route-description">${route.description || ''}</div>
          <div class="route-details">
            ${route.transportation ? `<div class="route-detail-item">🚗 ${route.transportation}</div>` : ''}
            ${route.accommodation ? `<div class="route-detail-item">🏨 ${route.accommodation}</div>` : ''}
          </div>
          ${route.notes ? `<div class="route-notes">📝 ${route.notes}</div>` : ''}
        </div>
      `;
    });
    container.innerHTML = html;
  } catch (error) {
    console.error('Error loading routes:', error);
  }
}

async function loadBudget() {
  if (!currentTripId) return;
  try {
    const response = await fetch(`/api/trips/${currentTripId}/budget/summary`);
    const summary = await response.json();
    const summaryContainer = document.getElementById('budgetSummary');
    const container = document.getElementById('budgetContainer');

    summaryContainer.innerHTML = `
      <div class="budget-summary-item">
        <div class="budget-summary-label">总预算</div>
        <div class="budget-summary-value">¥${summary.total_estimated.toFixed(2)}</div>
      </div>
      <div class="budget-summary-item">
        <div class="budget-summary-label">已花费</div>
        <div class="budget-summary-value">¥${summary.total_actual.toFixed(2)}</div>
      </div>
      <div class="budget-summary-item">
        <div class="budget-summary-label">剩余</div>
        <div class="budget-summary-value" style="color: ${summary.remaining >= 0 ? '#4ade80' : '#f87171'}">
          ¥${summary.remaining.toFixed(2)}
        </div>
      </div>
    `;

    if (summary.items.length === 0) {
      container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">💳</div><div class="empty-state-text">暂无预算项，点击上方按钮添加</div></div>';
      return;
    }

    const categoryIcons = {
      '交通': '🚗',
      '住宿': '🏨',
      '餐饮': '🍽️',
      '门票': '🎫',
      '购物': '🛍️',
      '娱乐': '🎮',
      '其他': '📦'
    };

    let html = '';
    summary.items.forEach(item => {
      const icon = categoryIcons[item.category] || '📦';
      html += `
        <div class="budget-item">
          <div class="budget-category">${icon}</div>
          <div class="budget-info">
            <div class="budget-description">${item.category} - ${item.description || '无描述'}</div>
            <div class="budget-amounts">
              <span class="budget-estimated">预算: ¥${item.estimated_amount.toFixed(2)}</span>
              <span class="budget-actual">实际: ¥${item.actual_amount.toFixed(2)}</span>
            </div>
          </div>
          <div class="budget-actions">
            <button class="btn btn-edit" onclick="editBudget(${item.id})">编辑</button>
            <button class="btn btn-danger" onclick="deleteBudget(${item.id})">删除</button>
          </div>
        </div>
      `;
    });
    container.innerHTML = html;
  } catch (error) {
    console.error('Error loading budget:', error);
  }
}

function switchTab(tabName) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
  event.target.classList.add('active');
  document.getElementById(`tab-${tabName}`).classList.add('active');
}

function showTripModal(trip = null) {
  document.getElementById('tripModalTitle').textContent = trip ? '编辑旅行' : '新建旅行';
  document.getElementById('tripId').value = trip ? trip.id : '';
  document.getElementById('tripName').value = trip ? trip.name : '';
  document.getElementById('tripDestination').value = trip ? trip.destination : '';
  document.getElementById('tripStartDate').value = trip ? trip.start_date : '';
  document.getElementById('tripEndDate').value = trip ? trip.end_date : '';
  document.getElementById('tripNotes').value = trip ? trip.notes : '';
  document.getElementById('tripModal').classList.add('show');
}

async function saveTrip(event) {
  event.preventDefault();
  const id = document.getElementById('tripId').value;
  const data = {
    name: document.getElementById('tripName').value,
    destination: document.getElementById('tripDestination').value,
    start_date: document.getElementById('tripStartDate').value,
    end_date: document.getElementById('tripEndDate').value,
    notes: document.getElementById('tripNotes').value
  };

  try {
    let response;
    if (id) {
      response = await fetch(`/api/trips/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } else {
      response = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    }
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      alert('保存失败: ' + (err.error || '服务器错误'));
      return;
    }
    await response.json();
    closeModal('tripModal');
    loadTrips();
  } catch (error) {
    console.error('Error saving trip:', error);
    alert('保存失败: ' + error.message);
  }
}

function showItemModal(item = null) {
  document.getElementById('itemModalTitle').textContent = item ? '编辑物品' : '添加物品';
  document.getElementById('itemId').value = item ? item.id : '';
  document.getElementById('itemName').value = item ? item.name : '';
  document.getElementById('itemQuantity').value = item ? item.quantity : 1;
  document.getElementById('itemNotes').value = item ? item.notes || '' : '';
  if (item && item.category_id) {
    document.getElementById('itemCategory').value = item.category_id;
  }
  document.getElementById('itemModal').classList.add('show');
}

async function saveItem(event) {
  event.preventDefault();
  if (!currentTripId) {
    alert('请先选择一个旅行');
    return;
  }
  const id = document.getElementById('itemId').value;
  const data = {
    category_id: parseInt(document.getElementById('itemCategory').value),
    name: document.getElementById('itemName').value,
    quantity: parseInt(document.getElementById('itemQuantity').value),
    notes: document.getElementById('itemNotes').value
  };

  try {
    let response;
    if (id) {
      response = await fetch(`/api/items/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, packed: 0 })
      });
    } else {
      response = await fetch(`/api/trips/${currentTripId}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    }
    closeModal('itemModal');
    loadItems();
  } catch (error) {
    console.error('Error saving item:', error);
  }
}

async function editItem(id) {
  try {
    const response = await fetch(`/api/trips/${currentTripId}/items`);
    const items = await response.json();
    const item = items.find(i => i.id === id);
    if (item) showItemModal(item);
  } catch (error) {
    console.error('Error loading item:', error);
  }
}

async function toggleItem(id) {
  try {
    await fetch(`/api/items/${id}/toggle`, { method: 'PUT' });
    loadItems();
  } catch (error) {
    console.error('Error toggling item:', error);
  }
}

async function deleteItem(id) {
  if (!confirm('确定要删除这个物品吗？')) return;
  try {
    await fetch(`/api/items/${id}`, { method: 'DELETE' });
    loadItems();
  } catch (error) {
    console.error('Error deleting item:', error);
  }
}

function showRouteModal(route = null) {
  document.getElementById('routeModalTitle').textContent = route ? '编辑路线' : '添加路线';
  document.getElementById('routeId').value = route ? route.id : '';
  document.getElementById('routeDay').value = route ? route.day_number : 1;
  document.getElementById('routeLocation').value = route ? route.location : '';
  document.getElementById('routeDescription').value = route ? route.description : '';
  document.getElementById('routeTransportation').value = route ? route.transportation : '';
  document.getElementById('routeAccommodation').value = route ? route.accommodation : '';
  document.getElementById('routeNotes').value = route ? route.notes : '';
  document.getElementById('routeModal').classList.add('show');
}

async function saveRoute(event) {
  event.preventDefault();
  if (!currentTripId) {
    alert('请先选择一个旅行');
    return;
  }
  const id = document.getElementById('routeId').value;
  const data = {
    day_number: parseInt(document.getElementById('routeDay').value),
    location: document.getElementById('routeLocation').value,
    description: document.getElementById('routeDescription').value,
    transportation: document.getElementById('routeTransportation').value,
    accommodation: document.getElementById('routeAccommodation').value,
    notes: document.getElementById('routeNotes').value
  };

  try {
    let response;
    if (id) {
      response = await fetch(`/api/routes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } else {
      response = await fetch(`/api/trips/${currentTripId}/routes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    }
    closeModal('routeModal');
    loadRoutes();
  } catch (error) {
    console.error('Error saving route:', error);
  }
}

async function editRoute(id) {
  try {
    const response = await fetch(`/api/trips/${currentTripId}/routes`);
    const routes = await response.json();
    const route = routes.find(r => r.id === id);
    if (route) showRouteModal(route);
  } catch (error) {
    console.error('Error loading route:', error);
  }
}

async function deleteRoute(id) {
  if (!confirm('确定要删除这条路线吗？')) return;
  try {
    await fetch(`/api/routes/${id}`, { method: 'DELETE' });
    loadRoutes();
  } catch (error) {
    console.error('Error deleting route:', error);
  }
}

function showBudgetModal(budget = null) {
  document.getElementById('budgetModalTitle').textContent = budget ? '编辑预算' : '添加预算';
  document.getElementById('budgetId').value = budget ? budget.id : '';
  document.getElementById('budgetCategory').value = budget ? budget.category : '交通';
  document.getElementById('budgetDescription').value = budget ? budget.description : '';
  document.getElementById('budgetEstimated').value = budget ? budget.estimated_amount : 0;
  document.getElementById('budgetActual').value = budget ? budget.actual_amount : 0;
  document.getElementById('budgetModal').classList.add('show');
}

async function saveBudget(event) {
  event.preventDefault();
  if (!currentTripId) {
    alert('请先选择一个旅行');
    return;
  }
  const id = document.getElementById('budgetId').value;
  const data = {
    category: document.getElementById('budgetCategory').value,
    description: document.getElementById('budgetDescription').value,
    estimated_amount: parseFloat(document.getElementById('budgetEstimated').value),
    actual_amount: parseFloat(document.getElementById('budgetActual').value)
  };

  try {
    let response;
    if (id) {
      response = await fetch(`/api/budget/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } else {
      response = await fetch(`/api/trips/${currentTripId}/budget`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    }
    closeModal('budgetModal');
    loadBudget();
  } catch (error) {
    console.error('Error saving budget:', error);
  }
}

async function editBudget(id) {
  try {
    const response = await fetch(`/api/trips/${currentTripId}/budget`);
    const budgets = await response.json();
    const budget = budgets.find(b => b.id === id);
    if (budget) showBudgetModal(budget);
  } catch (error) {
    console.error('Error loading budget:', error);
  }
}

async function deleteBudget(id) {
  if (!confirm('确定要删除这条预算吗？')) return;
  try {
    await fetch(`/api/budget/${id}`, { method: 'DELETE' });
    loadBudget();
  } catch (error) {
    console.error('Error deleting budget:', error);
  }
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('show');
}

window.onclick = function(event) {
  if (event.target.classList.contains('modal')) {
    event.target.classList.remove('show');
  }
};

loadTrips();
loadCategories();
