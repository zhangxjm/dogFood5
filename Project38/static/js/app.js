let currentPage = 1;

document.addEventListener('DOMContentLoaded', function() {
    loadSpaces();
    loadStats();
    loadRecords();
    
    setInterval(function() {
        loadSpaces();
        loadStats();
    }, 5000);
});

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast ' + type;
    toast.classList.add('show');
    
    setTimeout(function() {
        toast.classList.remove('show');
    }, 3000);
}

function showTab(tab) {
    const tabs = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(t => t.classList.remove('active'));
    contents.forEach(c => c.style.display = 'none');
    
    event.target.classList.add('active');
    
    if (tab === 'spaces') {
        document.getElementById('spacesTab').style.display = 'block';
    } else if (tab === 'records') {
        document.getElementById('recordsTab').style.display = 'block';
        loadRecords();
    }
}

async function loadSpaces() {
    try {
        const response = await fetch('/api/spaces');
        const data = await response.json();
        
        document.getElementById('totalSpaces').textContent = data.total;
        document.getElementById('occupiedSpaces').textContent = data.occupied;
        document.getElementById('availableSpaces').textContent = data.available;
        
        const grid = document.getElementById('parkingGrid');
        grid.innerHTML = '';
        
        data.spaces.forEach(space => {
            const div = document.createElement('div');
            div.className = 'parking-space ' + (space.is_occupied ? 'occupied' : 'free');
            div.innerHTML = '<span>' + space.space_number + '</span>';
            if (space.car_plate) {
                div.innerHTML += '<span class="plate">' + space.car_plate + '</span>';
            }
            grid.appendChild(div);
        });
    } catch (error) {
        console.error('加载车位状态失败:', error);
    }
}

async function loadStats() {
    try {
        const response = await fetch('/api/stats');
        const data = await response.json();
        
        document.getElementById('todayVehicles').textContent = data.today_vehicles;
        document.getElementById('completedVehicles').textContent = data.completed_vehicles;
        document.getElementById('currentlyParked').textContent = data.currently_parked;
        document.getElementById('avgDuration').textContent = data.avg_duration;
    } catch (error) {
        console.error('加载统计数据失败:', error);
    }
}

async function loadRecords(page = 1) {
    try {
        const response = await fetch('/api/records?page=' + page + '&per_page=10');
        const data = await response.json();
        
        currentPage = page;
        
        const tbody = document.getElementById('recordsBody');
        tbody.innerHTML = '';
        
        data.records.forEach(record => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${record.car_plate}</td>
                <td>${record.space_number}</td>
                <td>${record.entry_time}</td>
                <td>${record.exit_time || '-'}</td>
                <td>${record.duration}</td>
            `;
            tbody.appendChild(tr);
        });
        
        const pagination = document.getElementById('pagination');
        pagination.innerHTML = '';
        
        if (data.pages > 1) {
            const prevBtn = document.createElement('button');
            prevBtn.textContent = '上一页';
            prevBtn.disabled = page === 1;
            prevBtn.onclick = function() { loadRecords(page - 1); };
            pagination.appendChild(prevBtn);
            
            const pageInfo = document.createElement('span');
            pageInfo.textContent = page + ' / ' + data.pages;
            pageInfo.style.padding = '8px 15px';
            pagination.appendChild(pageInfo);
            
            const nextBtn = document.createElement('button');
            nextBtn.textContent = '下一页';
            nextBtn.disabled = page === data.pages;
            nextBtn.onclick = function() { loadRecords(page + 1); };
            pagination.appendChild(nextBtn);
        }
    } catch (error) {
        console.error('加载记录失败:', error);
    }
}

async function carEntry() {
    const carPlate = document.getElementById('carPlate').value.trim();
    
    if (!carPlate) {
        showToast('请输入车牌号', 'error');
        return;
    }
    
    try {
        const response = await fetch('/api/entry', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ car_plate: carPlate })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showToast(data.message + '，车位号：' + data.space_number);
            document.getElementById('carPlate').value = '';
            loadSpaces();
            loadStats();
        } else {
            showToast(data.message, 'error');
        }
    } catch (error) {
        showToast('操作失败，请重试', 'error');
        console.error('入场失败:', error);
    }
}

async function carExit() {
    const carPlate = document.getElementById('carPlate').value.trim();
    
    if (!carPlate) {
        showToast('请输入车牌号', 'error');
        return;
    }
    
    try {
        const response = await fetch('/api/exit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ car_plate: carPlate })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showToast(data.message + '，停车时长：' + data.duration);
            document.getElementById('carPlate').value = '';
            loadSpaces();
            loadStats();
            loadRecords(currentPage);
        } else {
            showToast(data.message, 'error');
        }
    } catch (error) {
        showToast('操作失败，请重试', 'error');
        console.error('离场失败:', error);
    }
}

document.getElementById('carPlate').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        carEntry();
    }
});
