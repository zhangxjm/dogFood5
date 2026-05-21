const API_BASE = '/api/expenses';

let currentMonth = new Date().toISOString().slice(0, 7);

document.addEventListener('DOMContentLoaded', () => {
  initMonthSelector();
  loadExpenses();
  loadSummary();
  setupFormHandlers();
  setupModalHandlers();
});

function initMonthSelector() {
  const monthSelect = document.getElementById('monthSelect');
  monthSelect.value = currentMonth;
  monthSelect.addEventListener('change', (e) => {
    currentMonth = e.target.value;
    loadExpenses();
    loadSummary();
  });
}

async function loadExpenses() {
  try {
    const [year, month] = currentMonth.split('-');
    const response = await fetch(`${API_BASE}?year=${year}&month=${month}`);
    const expenses = await response.json();
    renderExpenseList(expenses);
  } catch (error) {
    console.error('加载记录失败:', error);
  }
}

async function loadSummary() {
  try {
    const [year, month] = currentMonth.split('-');
    const response = await fetch(`${API_BASE}/summary?year=${year}&month=${month}`);
    const summary = await response.json();
    renderSummary(summary);
  } catch (error) {
    console.error('加载汇总失败:', error);
  }
}

function renderSummary(summary) {
  document.getElementById('totalIncome').textContent = `¥${summary.totalIncome.toFixed(2)}`;
  document.getElementById('totalExpense').textContent = `¥${summary.totalExpense.toFixed(2)}`;
  document.getElementById('balance').textContent = `¥${summary.balance.toFixed(2)}`;

  const categorySection = document.getElementById('categorySection');
  const categoryList = document.getElementById('categoryList');
  
  if (Object.keys(summary.categorySummary).length > 0) {
    categorySection.style.display = 'block';
    categoryList.innerHTML = Object.entries(summary.categorySummary)
      .map(([category, amount]) => `
        <div class="category-item">
          <span class="category-name">${category}</span>
          <span class="category-amount">¥${amount.toFixed(2)}</span>
        </div>
      `).join('');
  } else {
    categorySection.style.display = 'none';
  }
}

function renderExpenseList(expenses) {
  const list = document.getElementById('expenseList');
  
  if (expenses.length === 0) {
    list.innerHTML = '<div class="empty-state">暂无记录，开始添加你的第一笔收支吧！</div>';
    return;
  }

  list.innerHTML = expenses.map(expense => {
    const date = new Date(expense.date).toLocaleDateString('zh-CN');
    const icon = expense.type === 'income' ? '💰' : '💸';
    const amountPrefix = expense.type === 'income' ? '+' : '-';
    
    return `
      <div class="expense-item ${expense.type}" data-id="${expense._id}">
        <div class="expense-icon">${icon}</div>
        <div class="expense-info">
          <div class="expense-category">${expense.category}</div>
          <div class="expense-description">${expense.description || '无备注'}</div>
          <div class="expense-date">${date}</div>
        </div>
        <div class="expense-amount">${amountPrefix}¥${expense.amount.toFixed(2)}</div>
        <div class="expense-actions">
          <button class="btn btn-edit" onclick="editExpense('${expense._id}')">编辑</button>
          <button class="btn btn-delete" onclick="deleteExpense('${expense._id}')">删除</button>
        </div>
      </div>
    `;
  }).join('');
}

function setupFormHandlers() {
  const dateInput = document.getElementById('date');
  dateInput.value = new Date().toISOString().slice(0, 10);

  const expenseForm = document.getElementById('expenseForm');
  expenseForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const type = document.querySelector('input[name="type"]:checked').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;
    const description = document.getElementById('description').value;
    const date = document.getElementById('date').value;

    try {
      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, amount, category, description, date })
      });

      if (response.ok) {
        expenseForm.reset();
        dateInput.value = new Date().toISOString().slice(0, 10);
        loadExpenses();
        loadSummary();
      }
    } catch (error) {
      console.error('添加记录失败:', error);
    }
  });
}

function setupModalHandlers() {
  const modal = document.getElementById('editModal');
  const closeBtn = modal.querySelector('.close');
  
  closeBtn.onclick = () => {
    modal.style.display = 'none';
  };

  window.onclick = (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  };

  const editForm = document.getElementById('editForm');
  editForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('editId').value;
    const type = document.querySelector('input[name="editType"]:checked').value;
    const amount = parseFloat(document.getElementById('editAmount').value);
    const category = document.getElementById('editCategory').value;
    const description = document.getElementById('editDescription').value;
    const date = document.getElementById('editDate').value;

    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, amount, category, description, date })
      });

      if (response.ok) {
        modal.style.display = 'none';
        loadExpenses();
        loadSummary();
      }
    } catch (error) {
      console.error('更新记录失败:', error);
    }
  });
}

async function editExpense(id) {
  try {
    const response = await fetch(`${API_BASE}/${id}`);
    const expense = await response.json();
    
    document.getElementById('editId').value = expense._id;
    document.querySelector(`input[name="editType"][value="${expense.type}"]`).checked = true;
    document.getElementById('editAmount').value = expense.amount;
    document.getElementById('editCategory').value = expense.category;
    document.getElementById('editDescription').value = expense.description || '';
    document.getElementById('editDate').value = expense.date.slice(0, 10);
    
    document.getElementById('editModal').style.display = 'flex';
  } catch (error) {
    console.error('加载记录详情失败:', error);
  }
}

async function deleteExpense(id) {
  if (!confirm('确定要删除这条记录吗？')) {
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      loadExpenses();
      loadSummary();
    }
  } catch (error) {
    console.error('删除记录失败:', error);
  }
}
