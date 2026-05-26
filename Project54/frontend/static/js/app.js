const API_BASE = '/api';

let currentPage = 'dashboard';
let selectedBedId = null;

document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    renderPage('dashboard');
});

function initNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.dataset.page;
            document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            renderPage(page);
        });
    });
}

function renderPage(page) {
    currentPage = page;
    const titles = {
        dashboard: '数据概览',
        dormitories: '宿舍管理',
        workers: '工人信息',
        checkin: '入住登记',
        checkout: '退宿登记',
        statistics: '人员统计'
    };
    document.getElementById('page-title').textContent = titles[page] || '数据概览';

    switch(page) {
        case 'dashboard':
            renderDashboard();
            break;
        case 'dormitories':
            renderDormitories();
            break;
        case 'workers':
            renderWorkers();
            break;
        case 'checkin':
            renderCheckIn();
            break;
        case 'checkout':
            renderCheckOut();
            break;
        case 'statistics':
            renderStatistics();
            break;
    }
}

async function apiGet(url) {
    const response = await fetch(API_BASE + url);
    return await response.json();
}

async function apiPost(url, data) {
    const response = await fetch(API_BASE + url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return await response.json();
}

async function apiPut(url, data) {
    const response = await fetch(API_BASE + url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return await response.json();
}

async function apiDelete(url) {
    const response = await fetch(API_BASE + url, {
        method: 'DELETE'
    });
    return await response.json();
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function showModal(title, bodyHtml, footerHtml = '') {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-body').innerHTML = bodyHtml;
    document.getElementById('modal-footer').innerHTML = footerHtml;
    document.getElementById('modal').classList.add('show');
}

function closeModal() {
    document.getElementById('modal').classList.remove('show');
}

document.getElementById('modal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});

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

async function renderDashboard() {
    const content = document.getElementById('content');
    content.innerHTML = '<div class="empty-state"><div class="icon">⏳</div><p>加载中...</p></div>';

    try {
        const [overviewRes, recentCheckInsRes, recentCheckOutsRes] = await Promise.all([
            apiGet('/statistics/overview'),
            apiGet('/statistics/recent-checkins'),
            apiGet('/statistics/recent-checkouts')
        ]);

        const stats = overviewRes.data;
        const recentCheckIns = recentCheckInsRes.data || [];
        const recentCheckOuts = recentCheckOutsRes.data || [];

        content.innerHTML = `
            <div class="stats-grid">
                <div class="stat-card blue">
                    <div class="stat-icon">🏢</div>
                    <div class="stat-label">宿舍楼数量</div>
                    <div class="stat-value">${stats.total_dormitories}</div>
                </div>
                <div class="stat-card cyan">
                    <div class="stat-icon">🚪</div>
                    <div class="stat-label">房间总数</div>
                    <div class="stat-value">${stats.total_rooms}</div>
                </div>
                <div class="stat-card purple">
                    <div class="stat-icon">🛏️</div>
                    <div class="stat-label">床位总数</div>
                    <div class="stat-value">${stats.total_beds}</div>
                </div>
                <div class="stat-card green">
                    <div class="stat-icon">✅</div>
                    <div class="stat-label">空闲床位</div>
                    <div class="stat-value">${stats.available_beds}</div>
                </div>
                <div class="stat-card orange">
                    <div class="stat-icon">👥</div>
                    <div class="stat-label">已入住床位</div>
                    <div class="stat-value">${stats.occupied_beds}</div>
                </div>
                <div class="stat-card red">
                    <div class="stat-icon">📊</div>
                    <div class="stat-label">入住率</div>
                    <div class="stat-value">${stats.occupancy_rate.toFixed(1)}%</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">👷</div>
                    <div class="stat-label">工人总数</div>
                    <div class="stat-value">${stats.total_workers}</div>
                </div>
                <div class="stat-card green">
                    <div class="stat-icon">🏠</div>
                    <div class="stat-label">当前在住</div>
                    <div class="stat-value">${stats.living_workers}</div>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
                <div class="card">
                    <div class="card-header">
                        <h2>最近入住记录</h2>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>工人姓名</th>
                                <th>房间床位</th>
                                <th>入住日期</th>
                                <th>状态</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${recentCheckIns.map(r => `
                                <tr>
                                    <td>${r.worker?.name || '-'}</td>
                                    <td>${r.bed?.room?.dormitory?.name || ''} ${r.bed?.room?.room_no || ''} ${r.bed?.bed_no || ''}</td>
                                    <td>${formatDate(r.check_in_date)}</td>
                                    <td>${r.has_checked_out ? 
                                        '<span class="status-tag checked-out">已退宿</span>' : 
                                        '<span class="status-tag living">在住</span>'}</td>
                                </tr>
                            `).join('')}
                            ${recentCheckIns.length === 0 ? '<tr><td colspan="4" style="text-align:center;color:#999;">暂无记录</td></tr>' : ''}
                        </tbody>
                    </table>
                </div>

                <div class="card">
                    <div class="card-header">
                        <h2>最近退宿记录</h2>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>工人姓名</th>
                                <th>房间床位</th>
                                <th>退宿日期</th>
                                <th>入住天数</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${recentCheckOuts.map(r => `
                                <tr>
                                    <td>${r.worker?.name || '-'}</td>
                                    <td>${r.bed?.room?.dormitory?.name || ''} ${r.bed?.room?.room_no || ''} ${r.bed?.bed_no || ''}</td>
                                    <td>${formatDate(r.check_out_date)}</td>
                                    <td>${r.actual_stay_days} 天</td>
                                </tr>
                            `).join('')}
                            ${recentCheckOuts.length === 0 ? '<tr><td colspan="4" style="text-align:center;color:#999;">暂无记录</td></tr>' : ''}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    } catch (err) {
        content.innerHTML = '<div class="empty-state"><div class="icon">❌</div><p>加载失败，请刷新页面重试</p></div>';
        console.error(err);
    }
}

async function renderDormitories() {
    const content = document.getElementById('content');
    content.innerHTML = '<div class="empty-state"><div class="icon">⏳</div><p>加载中...</p></div>';

    try {
        const res = await apiGet('/dormitories');
        const dormitories = res.data || [];

        content.innerHTML = `
            <div class="card">
                <div class="card-header">
                    <h2>宿舍楼列表</h2>
                    <div>
                        <button class="btn btn-primary" onclick="showAddDormitoryModal()">+ 添加宿舍楼</button>
                        <button class="btn btn-success" onclick="showAddRoomModal()" style="margin-left: 8px;">+ 添加房间</button>
                    </div>
                </div>
                <div class="dormitory-list">
                    ${dormitories.map(d => {
                        const totalBeds = d.rooms?.reduce((sum, r) => sum + r.beds?.length, 0) || 0;
                        const occupiedBeds = d.rooms?.reduce((sum, r) => sum + (r.beds?.filter(b => b.status === '已入住').length || 0), 0) || 0;
                        const rate = totalBeds > 0 ? (occupiedBeds / totalBeds * 100).toFixed(1) : 0;
                        return `
                            <div class="dormitory-card" onclick="showDormitoryDetail(${d.id})">
                                <h3>${d.name}</h3>
                                <div class="info">楼层数：${d.floor_count} 层</div>
                                <div class="info">房间数：${d.rooms?.length || 0} 间</div>
                                <div class="info">床位数：${totalBeds} 个 (已住 ${occupiedBeds} 个)</div>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${rate}%"></div>
                                </div>
                                <div class="progress-text">入住率 ${rate}%</div>
                            </div>
                        `;
                    }).join('')}
                </div>
                ${dormitories.length === 0 ? '<div class="empty-state"><div class="icon">🏢</div><p>暂无宿舍楼，请先添加</p></div>' : ''}
            </div>
        `;
    } catch (err) {
        console.error(err);
    }
}

function showAddDormitoryModal() {
    const body = `
        <div class="form-group">
            <label>宿舍楼名称</label>
            <input type="text" id="dorm-name" placeholder="如：1号楼">
        </div>
        <div class="form-group">
            <label>楼层数</label>
            <input type="number" id="dorm-floors" value="6">
        </div>
        <div class="form-group">
            <label>描述</label>
            <textarea id="dorm-desc" rows="3" placeholder="请输入描述信息"></textarea>
        </div>
    `;
    const footer = `
        <button class="btn btn-default" onclick="closeModal()">取消</button>
        <button class="btn btn-primary" onclick="addDormitory()">确认添加</button>
    `;
    showModal('添加宿舍楼', body, footer);
}

async function addDormitory() {
    const name = document.getElementById('dorm-name').value.trim();
    const floorCount = parseInt(document.getElementById('dorm-floors').value);
    const description = document.getElementById('dorm-desc').value.trim();

    if (!name) {
        showToast('请输入宿舍楼名称', 'error');
        return;
    }

    const res = await apiPost('/dormitories', { name, floor_count: floorCount, description });
    if (res.code === 200) {
        showToast('添加成功');
        closeModal();
        renderDormitories();
    } else {
        showToast(res.message, 'error');
    }
}

function showAddRoomModal() {
    apiGet('/dormitories').then(res => {
        const dormitories = res.data || [];
        const body = `
            <div class="form-group">
                <label>所属宿舍楼</label>
                <select id="room-dormitory">
                    ${dormitories.map(d => `<option value="${d.id}">${d.name}</option>`).join('')}
                </select>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>楼层</label>
                    <input type="number" id="room-floor" value="1">
                </div>
                <div class="form-group">
                    <label>房间号</label>
                    <input type="text" id="room-no" placeholder="如：101">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>床位数</label>
                    <input type="number" id="room-beds" value="4">
                </div>
                <div class="form-group">
                    <label>房间类型</label>
                    <input type="text" id="room-type" value="标准间">
                </div>
            </div>
        `;
        const footer = `
            <button class="btn btn-default" onclick="closeModal()">取消</button>
            <button class="btn btn-primary" onclick="addRoom()">确认添加</button>
        `;
        showModal('添加房间', body, footer);
    });
}

async function addRoom() {
    const dormitoryId = parseInt(document.getElementById('room-dormitory').value);
    const floor = parseInt(document.getElementById('room-floor').value);
    const roomNo = document.getElementById('room-no').value.trim();
    const bedCount = parseInt(document.getElementById('room-beds').value);
    const roomType = document.getElementById('room-type').value.trim();

    if (!roomNo) {
        showToast('请输入房间号', 'error');
        return;
    }

    const res = await apiPost('/rooms', { 
        dormitory_id: dormitoryId, 
        floor, 
        room_no: roomNo, 
        bed_count: bedCount, 
        room_type: roomType 
    });
    if (res.code === 200) {
        showToast('添加成功');
        closeModal();
        renderDormitories();
    } else {
        showToast(res.message, 'error');
    }
}

async function showDormitoryDetail(dormitoryId) {
    try {
        const roomsRes = await apiGet(`/rooms?dormitory_id=${dormitoryId}`);
        const rooms = roomsRes.data || [];
        const dormRes = await apiGet(`/dormitories/${dormitoryId}`);
        const dormitory = dormRes.data;

        let roomsHtml = rooms.map(room => {
            const occupiedCount = room.beds?.filter(b => b.status === '已入住').length || 0;
            return `
                <div class="room-item">
                    <div class="room-info">
                        <h4>${room.room_no} (${room.room_type})</h4>
                        <div>
                            <span class="status-tag ${occupiedCount < (room.beds?.length || 0) ? 'available' : 'occupied'}">
                                ${occupiedCount}/${room.beds?.length || 0} 人
                            </span>
                        </div>
                    </div>
                    <div class="bed-grid">
                        ${room.beds?.map(bed => `
                            <div class="bed-item ${bed.status === '空闲' ? 'available' : 'occupied'}">
                                <div class="bed-no">${bed.bed_no}</div>
                                <div class="bed-status">${bed.status}</div>
                                ${bed.current_worker ? `<div class="worker-name">${bed.current_worker.name}</div>` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }).join('');

        const body = `
            <div class="form-group">
                <label>宿舍楼信息</label>
                <p style="color:#666;">${dormitory.name} - ${dormitory.floor_count}层楼</p>
            </div>
            <div style="max-height: 400px; overflow-y: auto;">
                ${roomsHtml || '<div class="empty-state">暂无房间</div>'}
            </div>
        `;
        showModal('宿舍楼详情', body);
    } catch (err) {
        console.error(err);
    }
}

async function renderWorkers() {
    const content = document.getElementById('content');
    content.innerHTML = '<div class="empty-state"><div class="icon">⏳</div><p>加载中...</p></div>';

    try {
        const res = await apiGet('/workers');
        const workers = res.data || [];

        content.innerHTML = `
            <div class="card">
                <div class="card-header">
                    <h2>工人信息列表</h2>
                    <button class="btn btn-primary" onclick="showAddWorkerModal()">+ 添加工人</button>
                </div>
                <div class="filter-bar">
                    <input type="text" id="worker-keyword" placeholder="搜索姓名/电话/身份证" onkeyup="filterWorkers()">
                    <select id="worker-status" onchange="filterWorkers()">
                        <option value="">全部状态</option>
                        <option value="在住">在住</option>
                        <option value="已退宿">已退宿</option>
                    </select>
                    <select id="worker-worktype" onchange="filterWorkers()">
                        <option value="">全部工种</option>
                        <option value="钢筋工">钢筋工</option>
                        <option value="木工">木工</option>
                        <option value="瓦工">瓦工</option>
                        <option value="架子工">架子工</option>
                        <option value="水电工">水电工</option>
                        <option value="焊工">焊工</option>
                        <option value="油漆工">油漆工</option>
                        <option value="杂工">杂工</option>
                    </select>
                </div>
                <div id="workers-table-container">
                    ${renderWorkersTable(workers)}
                </div>
            </div>
        `;
        window.allWorkers = workers;
    } catch (err) {
        console.error(err);
    }
}

function renderWorkersTable(workers) {
    if (!workers || workers.length === 0) {
        return '<div class="empty-state"><div class="icon">👷</div><p>暂无工人信息</p></div>';
    }

    return `
        <table>
            <thead>
                <tr>
                    <th>姓名</th>
                    <th>性别</th>
                    <th>年龄</th>
                    <th>身份证号</th>
                    <th>联系电话</th>
                    <th>工种</th>
                    <th>班组</th>
                    <th>入住信息</th>
                    <th>状态</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                ${workers.map(w => `
                    <tr>
                        <td>${w.name}</td>
                        <td>${w.gender}</td>
                        <td>${w.age}</td>
                        <td>${w.id_card}</td>
                        <td>${w.phone}</td>
                        <td>${w.work_type || '-'}</td>
                        <td>${w.team_name || '-'}</td>
                        <td>
                            ${w.current_bed ? 
                                `${w.current_bed.room?.dormitory?.name || ''} ${w.current_bed.room?.room_no || ''} ${w.current_bed.bed_no || ''}` : 
                                '<span style="color:#999;">未入住</span>'}
                        </td>
                        <td>
                            <span class="status-tag ${w.status === '在住' ? 'living' : 'checked-out'}">${w.status}</span>
                        </td>
                        <td class="actions">
                            <button class="btn btn-sm btn-primary" onclick="showWorkerDetail(${w.id})">详情</button>
                            <button class="btn btn-sm btn-warning" onclick="showEditWorkerModal(${w.id})">编辑</button>
                            ${!w.current_bed_id ? `<button class="btn btn-sm btn-danger" onclick="deleteWorker(${w.id})">删除</button>` : ''}
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function filterWorkers() {
    const keyword = document.getElementById('worker-keyword').value.trim().toLowerCase();
    const status = document.getElementById('worker-status').value;
    const workType = document.getElementById('worker-worktype').value;

    let filtered = window.allWorkers || [];
    if (keyword) {
        filtered = filtered.filter(w => 
            w.name.toLowerCase().includes(keyword) ||
            w.phone.includes(keyword) ||
            w.id_card.includes(keyword)
        );
    }
    if (status) {
        filtered = filtered.filter(w => w.status === status);
    }
    if (workType) {
        filtered = filtered.filter(w => w.work_type === workType);
    }

    document.getElementById('workers-table-container').innerHTML = renderWorkersTable(filtered);
}

function showAddWorkerModal() {
    const body = `
        <div class="form-row">
            <div class="form-group">
                <label>姓名 *</label>
                <input type="text" id="worker-name">
            </div>
            <div class="form-group">
                <label>性别 *</label>
                <select id="worker-gender">
                    <option value="男">男</option>
                    <option value="女">女</option>
                </select>
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>年龄</label>
                <input type="number" id="worker-age">
            </div>
            <div class="form-group">
                <label>身份证号</label>
                <input type="text" id="worker-idcard">
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>联系电话</label>
                <input type="text" id="worker-phone">
            </div>
            <div class="form-group">
                <label>工种</label>
                <select id="worker-worktype-add">
                    <option value="">请选择</option>
                    <option value="钢筋工">钢筋工</option>
                    <option value="木工">木工</option>
                    <option value="瓦工">瓦工</option>
                    <option value="架子工">架子工</option>
                    <option value="水电工">水电工</option>
                    <option value="焊工">焊工</option>
                    <option value="油漆工">油漆工</option>
                    <option value="杂工">杂工</option>
                </select>
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>所属班组</label>
                <input type="text" id="worker-team">
            </div>
            <div class="form-group">
                <label>籍贯</label>
                <input type="text" id="worker-hometown">
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>紧急联系人</label>
                <input type="text" id="worker-emergency-contact">
            </div>
            <div class="form-group">
                <label>紧急联系电话</label>
                <input type="text" id="worker-emergency-phone">
            </div>
        </div>
    `;
    const footer = `
        <button class="btn btn-default" onclick="closeModal()">取消</button>
        <button class="btn btn-primary" onclick="addWorker()">确认添加</button>
    `;
    showModal('添加工人', body, footer);
}

async function addWorker() {
    const data = {
        name: document.getElementById('worker-name').value.trim(),
        gender: document.getElementById('worker-gender').value,
        age: parseInt(document.getElementById('worker-age').value) || 0,
        id_card: document.getElementById('worker-idcard').value.trim(),
        phone: document.getElementById('worker-phone').value.trim(),
        work_type: document.getElementById('worker-worktype-add').value,
        team_name: document.getElementById('worker-team').value.trim(),
        hometown: document.getElementById('worker-hometown').value.trim(),
        emergency_contact: document.getElementById('worker-emergency-contact').value.trim(),
        emergency_phone: document.getElementById('worker-emergency-phone').value.trim()
    };

    if (!data.name) {
        showToast('请输入姓名', 'error');
        return;
    }

    const res = await apiPost('/workers', data);
    if (res.code === 200) {
        showToast('添加成功');
        closeModal();
        renderWorkers();
    } else {
        showToast(res.message, 'error');
    }
}

async function showWorkerDetail(id) {
    try {
        const res = await apiGet(`/workers/${id}`);
        const w = res.data;
        const body = `
            <table style="width:100%;">
                <tr><td style="padding:8px; font-weight:bold;">姓名：</td><td>${w.name}</td>
                    <td style="padding:8px; font-weight:bold;">性别：</td><td>${w.gender}</td></tr>
                <tr><td style="padding:8px; font-weight:bold;">年龄：</td><td>${w.age || '-'}</td>
                    <td style="padding:8px; font-weight:bold;">身份证：</td><td>${w.id_card || '-'}</td></tr>
                <tr><td style="padding:8px; font-weight:bold;">电话：</td><td>${w.phone || '-'}</td>
                    <td style="padding:8px; font-weight:bold;">工种：</td><td>${w.work_type || '-'}</td></tr>
                <tr><td style="padding:8px; font-weight:bold;">班组：</td><td>${w.team_name || '-'}</td>
                    <td style="padding:8px; font-weight:bold;">籍贯：</td><td>${w.hometown || '-'}</td></tr>
                <tr><td style="padding:8px; font-weight:bold;">紧急联系人：</td><td>${w.emergency_contact || '-'}</td>
                    <td style="padding:8px; font-weight:bold;">紧急电话：</td><td>${w.emergency_phone || '-'}</td></tr>
                <tr><td style="padding:8px; font-weight:bold;">入住状态：</td><td colspan="3">
                    <span class="status-tag ${w.status === '在住' ? 'living' : 'checked-out'}">${w.status}</span>
                </td></tr>
                ${w.current_bed ? `
                <tr><td style="padding:8px; font-weight:bold;">当前床位：</td><td colspan="3">
                    ${w.current_bed.room?.dormitory?.name || ''} ${w.current_bed.room?.room_no || ''} ${w.current_bed.bed_no || ''}
                </td></tr>
                ` : ''}
            </table>
        `;
        showModal('工人详情', body);
    } catch (err) {
        console.error(err);
    }
}

async function showEditWorkerModal(id) {
    try {
        const res = await apiGet(`/workers/${id}`);
        const w = res.data;
        window.editingWorkerId = id;

        const body = `
            <div class="form-row">
                <div class="form-group">
                    <label>姓名 *</label>
                    <input type="text" id="edit-worker-name" value="${w.name}">
                </div>
                <div class="form-group">
                    <label>性别 *</label>
                    <select id="edit-worker-gender">
                        <option value="男" ${w.gender === '男' ? 'selected' : ''}>男</option>
                        <option value="女" ${w.gender === '女' ? 'selected' : ''}>女</option>
                    </select>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>年龄</label>
                    <input type="number" id="edit-worker-age" value="${w.age || ''}">
                </div>
                <div class="form-group">
                    <label>身份证号</label>
                    <input type="text" id="edit-worker-idcard" value="${w.id_card || ''}">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>联系电话</label>
                    <input type="text" id="edit-worker-phone" value="${w.phone || ''}">
                </div>
                <div class="form-group">
                    <label>工种</label>
                    <select id="edit-worker-worktype">
                        <option value="">请选择</option>
                        <option value="钢筋工" ${w.work_type === '钢筋工' ? 'selected' : ''}>钢筋工</option>
                        <option value="木工" ${w.work_type === '木工' ? 'selected' : ''}>木工</option>
                        <option value="瓦工" ${w.work_type === '瓦工' ? 'selected' : ''}>瓦工</option>
                        <option value="架子工" ${w.work_type === '架子工' ? 'selected' : ''}>架子工</option>
                        <option value="水电工" ${w.work_type === '水电工' ? 'selected' : ''}>水电工</option>
                        <option value="焊工" ${w.work_type === '焊工' ? 'selected' : ''}>焊工</option>
                        <option value="油漆工" ${w.work_type === '油漆工' ? 'selected' : ''}>油漆工</option>
                        <option value="杂工" ${w.work_type === '杂工' ? 'selected' : ''}>杂工</option>
                    </select>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>所属班组</label>
                    <input type="text" id="edit-worker-team" value="${w.team_name || ''}">
                </div>
                <div class="form-group">
                    <label>籍贯</label>
                    <input type="text" id="edit-worker-hometown" value="${w.hometown || ''}">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>紧急联系人</label>
                    <input type="text" id="edit-worker-emergency-contact" value="${w.emergency_contact || ''}">
                </div>
                <div class="form-group">
                    <label>紧急联系电话</label>
                    <input type="text" id="edit-worker-emergency-phone" value="${w.emergency_phone || ''}">
                </div>
            </div>
        `;
        const footer = `
            <button class="btn btn-default" onclick="closeModal()">取消</button>
            <button class="btn btn-primary" onclick="updateWorker()">保存修改</button>
        `;
        showModal('编辑工人信息', body, footer);
    } catch (err) {
        console.error(err);
    }
}

async function updateWorker() {
    const data = {
        name: document.getElementById('edit-worker-name').value.trim(),
        gender: document.getElementById('edit-worker-gender').value,
        age: parseInt(document.getElementById('edit-worker-age').value) || 0,
        id_card: document.getElementById('edit-worker-idcard').value.trim(),
        phone: document.getElementById('edit-worker-phone').value.trim(),
        work_type: document.getElementById('edit-worker-worktype').value,
        team_name: document.getElementById('edit-worker-team').value.trim(),
        hometown: document.getElementById('edit-worker-hometown').value.trim(),
        emergency_contact: document.getElementById('edit-worker-emergency-contact').value.trim(),
        emergency_phone: document.getElementById('edit-worker-emergency-phone').value.trim()
    };

    if (!data.name) {
        showToast('请输入姓名', 'error');
        return;
    }

    const res = await apiPut(`/workers/${window.editingWorkerId}`, data);
    if (res.code === 200) {
        showToast('修改成功');
        closeModal();
        renderWorkers();
    } else {
        showToast(res.message, 'error');
    }
}

async function deleteWorker(id) {
    if (!confirm('确定要删除该工人信息吗？')) return;

    const res = await apiDelete(`/workers/${id}`);
    if (res.code === 200) {
        showToast('删除成功');
        renderWorkers();
    } else {
        showToast(res.message, 'error');
    }
}

async function renderCheckIn() {
    const content = document.getElementById('content');
    content.innerHTML = '<div class="empty-state"><div class="icon">⏳</div><p>加载中...</p></div>';

    try {
        const [workersRes, bedsRes, recordsRes] = await Promise.all([
            apiGet('/workers'),
            apiGet('/beds?status=空闲'),
            apiGet('/checkins?has_checked_out=false')
        ]);

        const availableWorkers = (workersRes.data || []).filter(w => !w.current_bed_id);
        const availableBeds = bedsRes.data || [];
        const records = recordsRes.data || [];

        const today = new Date().toISOString().split('T')[0];

        const body = `
            <div class="card">
                <div class="card-header">
                    <h2>办理入住</h2>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>选择工人 *</label>
                        <select id="checkin-worker">
                            <option value="">请选择工人</option>
                            ${availableWorkers.map(w => `<option value="${w.id}">${w.name} - ${w.work_type || '未设置'}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>入住日期 *</label>
                        <input type="date" id="checkin-date" value="${today}">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>选择床位 *</label>
                        <select id="checkin-bed-filter" onchange="renderBedSelection()">
                            <option value="">全部宿舍楼</option>
                            ${[...new Set(availableBeds.map(b => b.room?.dormitory?.name).filter(Boolean))].map(name => 
                                `<option value="${name}">${name}</option>`
                            ).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>预计入住天数</label>
                        <input type="number" id="checkin-days" value="30" min="1">
                    </div>
                </div>
                <div class="form-group">
                    <label>选择床位 (点击选择)</label>
                    <div id="bed-selection" style="max-height: 300px; overflow-y: auto;"></div>
                </div>
                <div class="form-group">
                    <label>备注</label>
                    <textarea id="checkin-remark" rows="2" placeholder="请输入备注信息"></textarea>
                </div>
                <button class="btn btn-primary" onclick="submitCheckIn()" style="margin-top: 16px;">确认入住</button>
            </div>

            <div class="card">
                <div class="card-header">
                    <h2>当前入住记录</h2>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>工人姓名</th>
                            <th>工种</th>
                            <th>宿舍楼</th>
                            <th>房间</th>
                            <th>床位</th>
                            <th>入住日期</th>
                            <th>预计天数</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${records.map(r => `
                            <tr>
                                <td>${r.worker?.name || '-'}</td>
                                <td>${r.worker?.work_type || '-'}</td>
                                <td>${r.bed?.room?.dormitory?.name || '-'}</td>
                                <td>${r.bed?.room?.room_no || '-'}</td>
                                <td>${r.bed?.bed_no || '-'}</td>
                                <td>${formatDate(r.check_in_date)}</td>
                                <td>${r.expected_stay_days || '-'} 天</td>
                            </tr>
                        `).join('')}
                        ${records.length === 0 ? '<tr><td colspan="7" style="text-align:center;color:#999;">暂无入住记录</td></tr>' : ''}
                    </tbody>
                </table>
            </div>
        `;

        content.innerHTML = body;
        window.availableBeds = availableBeds;
        renderBedSelection();
    } catch (err) {
        console.error(err);
    }
}

function renderBedSelection() {
    const filter = document.getElementById('checkin-bed-filter').value;
    let beds = window.availableBeds || [];
    if (filter) {
        beds = beds.filter(b => b.room?.dormitory?.name === filter);
    }

    const container = document.getElementById('bed-selection');
    if (beds.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="icon">🛏️</div><p>暂无空闲床位</p></div>';
        return;
    }

    container.innerHTML = `
        <div class="bed-grid">
            ${beds.map(bed => `
                <div class="bed-item available ${selectedBedId === bed.id ? 'selected' : ''}" 
                     onclick="selectBed(${bed.id}, this)" 
                     style="${selectedBedId === bed.id ? 'border-color: #1a4d8f; background-color: #e6f7ff;' : ''}">
                    <div class="bed-no">${bed.room?.dormitory?.name || ''} ${bed.room?.room_no || ''} ${bed.bed_no}</div>
                    <div class="bed-status">${bed.status}</div>
                </div>
            `).join('')}
        </div>
    `;
}

function selectBed(id, element) {
    selectedBedId = id;
    document.querySelectorAll('#bed-selection .bed-item').forEach(el => {
        el.style.borderColor = '#b7eb8f';
        el.style.backgroundColor = '#f6ffed';
    });
    element.style.borderColor = '#1a4d8f';
    element.style.backgroundColor = '#e6f7ff';
}

async function submitCheckIn() {
    const workerId = parseInt(document.getElementById('checkin-worker').value);
    const checkInDate = document.getElementById('checkin-date').value;
    const expectedStayDays = parseInt(document.getElementById('checkin-days').value);
    const remark = document.getElementById('checkin-remark').value.trim();

    if (!workerId) {
        showToast('请选择工人', 'error');
        return;
    }
    if (!selectedBedId) {
        showToast('请选择床位', 'error');
        return;
    }
    if (!checkInDate) {
        showToast('请选择入住日期', 'error');
        return;
    }

    const res = await apiPost('/checkins', {
        worker_id: workerId,
        bed_id: selectedBedId,
        check_in_date: checkInDate,
        expected_stay_days: expectedStayDays,
        remark
    });

    if (res.code === 200) {
        showToast('入住登记成功');
        selectedBedId = null;
        renderCheckIn();
    } else {
        showToast(res.message, 'error');
    }
}

async function renderCheckOut() {
    const content = document.getElementById('content');
    content.innerHTML = '<div class="empty-state"><div class="icon">⏳</div><p>加载中...</p></div>';

    try {
        const [workersRes, recordsRes] = await Promise.all([
            apiGet('/workers?status=在住'),
            apiGet('/checkouts')
        ]);

        const livingWorkers = (workersRes.data || []).filter(w => w.current_bed_id);
        const records = recordsRes.data || [];

        const body = `
            <div class="card">
                <div class="card-header">
                    <h2>办理退宿</h2>
                </div>
                <div class="form-group">
                    <label>选择在住工人 *</label>
                    <select id="checkout-worker">
                        <option value="">请选择工人</option>
                        ${livingWorkers.map(w => `
                            <option value="${w.id}">${w.name} - ${w.work_type || '未设置'} - ${w.current_bed?.room?.dormitory?.name || ''} ${w.current_bed?.room?.room_no || ''} ${w.current_bed?.bed_no || ''}</option>
                        `).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label>退宿原因</label>
                    <select id="checkout-reason">
                        <option value="">请选择</option>
                        <option value="工程完工">工程完工</option>
                        <option value="返乡">返乡</option>
                        <option value="调往其他工地">调往其他工地</option>
                        <option value="个人原因">个人原因</option>
                        <option value="其他">其他</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>备注</label>
                    <textarea id="checkout-remark" rows="2" placeholder="请输入备注信息"></textarea>
                </div>
                <button class="btn btn-danger" onclick="submitCheckOut()">确认退宿</button>
            </div>

            <div class="card">
                <div class="card-header">
                    <h2>退宿记录</h2>
                </div>
                <div class="filter-bar">
                    <input type="date" id="checkout-start" onchange="filterCheckOutRecords()" placeholder="开始日期">
                    <input type="date" id="checkout-end" onchange="filterCheckOutRecords()" placeholder="结束日期">
                </div>
                <div id="checkout-records-container">
                    ${renderCheckOutTable(records)}
                </div>
            </div>
        `;

        content.innerHTML = body;
        window.allCheckOutRecords = records;
    } catch (err) {
        console.error(err);
    }
}

function renderCheckOutTable(records) {
    if (!records || records.length === 0) {
        return '<div class="empty-state"><div class="icon">📋</div><p>暂无退宿记录</p></div>';
    }

    return `
        <table>
            <thead>
                <tr>
                    <th>工人姓名</th>
                    <th>工种</th>
                    <th>宿舍楼</th>
                    <th>房间</th>
                    <th>床位</th>
                    <th>退宿日期</th>
                    <th>入住天数</th>
                    <th>退宿原因</th>
                </tr>
            </thead>
            <tbody>
                ${records.map(r => `
                    <tr>
                        <td>${r.worker?.name || '-'}</td>
                        <td>${r.worker?.work_type || '-'}</td>
                        <td>${r.bed?.room?.dormitory?.name || '-'}</td>
                        <td>${r.bed?.room?.room_no || '-'}</td>
                        <td>${r.bed?.bed_no || '-'}</td>
                        <td>${formatDate(r.check_out_date)}</td>
                        <td>${r.actual_stay_days || 0} 天</td>
                        <td>${r.reason || '-'}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function filterCheckOutRecords() {
    const startDate = document.getElementById('checkout-start').value;
    const endDate = document.getElementById('checkout-end').value;

    let filtered = window.allCheckOutRecords || [];
    if (startDate) {
        filtered = filtered.filter(r => new Date(r.check_out_date) >= new Date(startDate));
    }
    if (endDate) {
        filtered = filtered.filter(r => new Date(r.check_out_date) <= new Date(endDate + 'T23:59:59'));
    }

    document.getElementById('checkout-records-container').innerHTML = renderCheckOutTable(filtered);
}

async function submitCheckOut() {
    const workerId = parseInt(document.getElementById('checkout-worker').value);
    const reason = document.getElementById('checkout-reason').value;
    const remark = document.getElementById('checkout-remark').value.trim();

    if (!workerId) {
        showToast('请选择工人', 'error');
        return;
    }

    if (!confirm('确认该工人办理退宿吗？')) return;

    const res = await apiPost('/checkouts', {
        worker_id: workerId,
        reason,
        remark
    });

    if (res.code === 200) {
        showToast('退宿登记成功');
        renderCheckOut();
    } else {
        showToast(res.message, 'error');
    }
}

async function renderStatistics() {
    const content = document.getElementById('content');
    content.innerHTML = '<div class="empty-state"><div class="icon">⏳</div><p>加载中...</p></div>';

    try {
        const [dormStatsRes, workTypeRes, genderRes, floorStatsRes] = await Promise.all([
            apiGet('/statistics/by-dormitory'),
            apiGet('/statistics/by-work-type'),
            apiGet('/statistics/by-gender'),
            apiGet('/statistics/by-floor')
        ]);

        const dormStats = dormStatsRes.data || [];
        const workTypeStats = workTypeRes.data || [];
        const genderStats = genderRes.data || [];
        const floorStats = floorStatsRes.data || [];

        const genderColors = { '男': '#1890ff', '女': '#eb2f96' };
        const workTypeColors = ['#52c41a', '#1890ff', '#fa8c16', '#722ed1', '#13c2c2', '#f5222d', '#eb2f96', '#faad14'];

        const totalLiving = genderStats.reduce((sum, g) => sum + g.count, 0);

        content.innerHTML = `
            <div class="card">
                <div class="card-header">
                    <h2>各宿舍楼入住情况</h2>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>宿舍楼</th>
                            <th>房间数</th>
                            <th>总床位</th>
                            <th>已入住</th>
                            <th>空闲床位</th>
                            <th>入住率</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${dormStats.map(d => `
                            <tr>
                                <td>${d.name}</td>
                                <td>${d.total_rooms}</td>
                                <td>${d.total_beds}</td>
                                <td>${d.occupied_beds}</td>
                                <td>${d.available_beds}</td>
                                <td>
                                    <div style="display:flex;align-items:center;gap:8px;">
                                        <div style="flex:1;height:8px;background:#f0f0f0;border-radius:4px;overflow:hidden;">
                                            <div style="height:100%;width:${d.occupancy_rate}%;background:linear-gradient(90deg,#52c41a,#1890ff);"></div>
                                        </div>
                                        <span style="color:#1a4d8f;font-weight:600;">${d.occupancy_rate.toFixed(1)}%</span>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>

            <div class="stats-charts">
                <div class="chart-box">
                    <h3>工种分布</h3>
                    ${workTypeStats.length > 0 ? `
                        ${workTypeStats.map((w, i) => {
                            const maxCount = Math.max(...workTypeStats.map(x => x.count));
                            const percent = maxCount > 0 ? (w.count / maxCount * 100) : 0;
                            return `
                                <div class="chart-bar">
                                    <div class="label">${w.work_type || '未设置'}</div>
                                    <div class="bar-container">
                                        <div class="bar" style="width: ${percent}%; background: ${workTypeColors[i % workTypeColors.length]};"></div>
                                    </div>
                                    <div class="value">${w.count}人</div>
                                </div>
                            `;
                        }).join('')}
                    ` : '<div class="empty-state">暂无数据</div>'}
                </div>

                <div class="chart-box">
                    <h3>性别分布 (共 ${totalLiving} 人)</h3>
                    <div style="display:flex;align-items:center;gap:40px;padding:20px 0;">
                        <div style="width:150px;height:150px;border-radius:50%;background:conic-gradient(
                            ${genderStats.map((g, i) => {
                                const angle = totalLiving > 0 ? (g.count / totalLiving * 360) : 0;
                                const prevAngle = i > 0 ? genderStats.slice(0, i).reduce((s, x) => s + x.count / totalLiving * 360, 0) : 0;
                                return `${genderColors[g.gender] || '#999'} ${prevAngle}deg ${prevAngle + angle}deg`;
                            }).join(', ')}
                        );">
                        </div>
                        <div class="pie-legend">
                            ${genderStats.map(g => `
                                <div class="pie-legend-item">
                                    <div class="pie-legend-color" style="background: ${genderColors[g.gender] || '#999'};"></div>
                                    <span class="pie-legend-text">${g.gender}: ${g.count}人 (${totalLiving > 0 ? (g.count / totalLiving * 100).toFixed(1) : 0}%)</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h2>各楼层入住情况</h2>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>楼层</th>
                            <th>房间数</th>
                            <th>总床位</th>
                            <th>已入住</th>
                            <th>空闲床位</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${floorStats.map(f => `
                            <tr>
                                <td>${f.floor} 楼</td>
                                <td>${f.total_rooms}</td>
                                <td>${f.total_beds}</td>
                                <td>${f.occupied_beds}</td>
                                <td>${f.available_beds}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    } catch (err) {
        console.error(err);
    }
}
