let currentPage = 'dashboard';
let charts = {};

function showPage(pageId) {
    currentPage = pageId;
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    
    document.getElementById(`page-${pageId}`).classList.add('active');
    document.querySelector(`[data-page="${pageId}"]`).classList.add('active');

    const titles = {
        dashboard: '数据概览',
        points: '巡查点位管理',
        records: '巡查问题记录',
        rectification: '整改情况管理',
        stats: '巡查台账汇总'
    };
    document.getElementById('page-title').textContent = titles[pageId];

    if (pageId === 'dashboard') loadDashboard();
    if (pageId === 'points') loadPoints();
    if (pageId === 'records') loadRecords();
    if (pageId === 'rectification') loadRectificationRecords();
    if (pageId === 'stats') loadStatsPage();
}

async function loadDashboard() {
    try {
        const summary = await API.getStatsSummary();
        document.getElementById('stat-points').textContent = summary.point_count;
        document.getElementById('stat-records').textContent = summary.record_count;
        document.getElementById('stat-pending').textContent = summary.pending_count;
        document.getElementById('stat-completed').textContent = summary.completed_count;
        document.getElementById('stat-processing').textContent = summary.processing_count;
        document.getElementById('stat-month').textContent = summary.month_count;

        await loadDashboardCharts();
    } catch (error) {
        console.error('Failed to load dashboard:', error);
    }
}

async function loadDashboardCharts() {
    const timeData = await API.getStatsByTime();
    const pointData = await API.getStatsByPoint();
    const typeData = await API.getStatsByType();
    const rectData = await API.getRectificationStats();

    if (charts.timeChart) charts.timeChart.dispose();
    charts.timeChart = echarts.init(document.getElementById('chart-time'));
    charts.timeChart.setOption({
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: timeData.map(d => d.date) },
        yAxis: { type: 'value' },
        series: [{
            data: timeData.map(d => d.count),
            type: 'line',
            smooth: true,
            areaStyle: { color: 'rgba(0, 82, 217, 0.1)' },
            lineStyle: { color: '#0052d9' },
            itemStyle: { color: '#0052d9' }
        }]
    });

    if (charts.pointChart) charts.pointChart.dispose();
    charts.pointChart = echarts.init(document.getElementById('chart-point'));
    charts.pointChart.setOption({
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: pointData.map(d => d.point_name), axisLabel: { rotate: 30 } },
        yAxis: { type: 'value' },
        series: [{
            data: pointData.map(d => d.count),
            type: 'bar',
            itemStyle: { color: '#1890ff' }
        }]
    });

    if (charts.typeChart) charts.typeChart.dispose();
    charts.typeChart = echarts.init(document.getElementById('chart-type'));
    charts.typeChart.setOption({
        tooltip: { trigger: 'item' },
        legend: { bottom: '5%' },
        series: [{
            type: 'pie',
            radius: ['40%', '70%'],
            data: typeData.map(d => ({ name: d.problem_type, value: d.count })),
            emphasis: {
                itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' }
            }
        }]
    });

    if (charts.rectChart) charts.rectChart.dispose();
    charts.rectChart = echarts.init(document.getElementById('chart-rect'));
    charts.rectChart.setOption({
        tooltip: { trigger: 'item' },
        series: [{
            type: 'gauge',
            progress: { show: true, width: 18 },
            axisLine: { lineStyle: { width: 18 } },
            axisTick: { show: false },
            splitLine: { length: 15, lineStyle: { width: 2, color: '#999' } },
            axisLabel: { distance: 25, color: '#999', fontSize: 14 },
            anchor: { show: true, showAbove: true, size: 25, itemStyle: { borderWidth: 10 } },
            title: { show: false },
            detail: { valueAnimation: true, fontSize: 30, offsetCenter: [0, '70%'] },
            data: [{ value: Math.round(rectData.completion_rate), name: '整改完成率' }]
        }]
    });
}

let pointsPage = 1;
let pointsTotal = 0;

async function loadPoints() {
    const river = document.getElementById('filter-river').value;
    const area = document.getElementById('filter-area').value;
    const name = document.getElementById('filter-point-name').value;
    
    try {
        const data = await API.getPoints({ page: pointsPage, pageSize: 10, river, area, name });
        pointsTotal = data.total;
        renderPointsTable(data.list);
        renderPagination('points-pagination', pointsPage, Math.ceil(pointsTotal / 10), (page) => {
            pointsPage = page;
            loadPoints();
        });
    } catch (error) {
        console.error('Failed to load points:', error);
    }
}

function renderPointsTable(points) {
    const tbody = document.getElementById('points-table-body');
    tbody.innerHTML = points.map(point => `
        <tr>
            <td>${point.id}</td>
            <td>${point.name}</td>
            <td>${point.river}</td>
            <td>${point.area}</td>
            <td>${point.location}</td>
            <td><span class="status-badge ${point.status === 1 ? 'status-completed' : 'status-pending'}">${point.status === 1 ? '启用' : '禁用'}</span></td>
            <td>
                <button class="btn btn-small btn-primary" onclick="editPoint(${point.id})">编辑</button>
                <button class="btn btn-small btn-danger" onclick="deletePoint(${point.id})">删除</button>
            </td>
        </tr>
    `).join('');
}

function renderPagination(id, current, total, callback) {
    const container = document.getElementById(id);
    let html = `<button onclick="(${callback})(${current - 1})" ${current === 1 ? 'disabled' : ''}>上一页</button>`;
    for (let i = 1; i <= total; i++) {
        if (i === 1 || i === total || (i >= current - 2 && i <= current + 2)) {
            html += `<button class="${i === current ? 'active' : ''}" onclick="(${callback})(${i})">${i}</button>`;
        } else if (i === current - 3 || i === current + 3) {
            html += '<span>...</span>';
        }
    }
    html += `<button onclick="(${callback})(${current + 1})" ${current === total ? 'disabled' : ''}>下一页</button>`;
    container.innerHTML = html;
}

function openPointModal(point = null) {
    document.getElementById('point-modal').classList.add('active');
    document.getElementById('point-form').reset();
    document.getElementById('point-id').value = point?.id || '';
    if (point) {
        document.getElementById('point-name').value = point.name;
        document.getElementById('point-river').value = point.river;
        document.getElementById('point-area').value = point.area;
        document.getElementById('point-location').value = point.location;
        document.getElementById('point-longitude').value = point.longitude;
        document.getElementById('point-latitude').value = point.latitude;
        document.getElementById('point-status').value = point.status;
        document.getElementById('point-description').value = point.description;
    }
}

function closePointModal() {
    document.getElementById('point-modal').classList.remove('active');
}

async function savePoint() {
    const id = document.getElementById('point-id').value;
    const data = {
        name: document.getElementById('point-name').value,
        river: document.getElementById('point-river').value,
        area: document.getElementById('point-area').value,
        location: document.getElementById('point-location').value,
        longitude: parseFloat(document.getElementById('point-longitude').value) || 0,
        latitude: parseFloat(document.getElementById('point-latitude').value) || 0,
        status: parseInt(document.getElementById('point-status').value),
        description: document.getElementById('point-description').value
    };

    try {
        if (id) {
            await API.updatePoint(id, data);
        } else {
            await API.createPoint(data);
        }
        closePointModal();
        loadPoints();
    } catch (error) {
        alert('保存失败: ' + error.message);
    }
}

async function editPoint(id) {
    const point = await API.getPoint(id);
    openPointModal(point);
}

async function deletePoint(id) {
    if (confirm('确定要删除该点位吗？')) {
        await API.deletePoint(id);
        loadPoints();
    }
}

let recordsPage = 1;
let recordsTotal = 0;

async function loadRecords() {
    const pointId = document.getElementById('filter-record-point').value;
    const status = document.getElementById('filter-record-status').value;
    const startDate = document.getElementById('filter-start-date').value;
    const endDate = document.getElementById('filter-end-date').value;

    try {
        const data = await API.getRecords({ 
            page: recordsPage, 
            pageSize: 10, 
            point_id: pointId, 
            status, 
            start_date: startDate, 
            end_date: endDate 
        });
        recordsTotal = data.total;
        renderRecordsTable(data.list);
        renderPagination('records-pagination', recordsPage, Math.ceil(recordsTotal / 10), (page) => {
            recordsPage = page;
            loadRecords();
        });
    } catch (error) {
        console.error('Failed to load records:', error);
    }
}

function renderRecordsTable(records) {
    const statusMap = { pending: '待整改', processing: '整改中', completed: '已完成' };
    const statusClass = { pending: 'status-pending', processing: 'status-processing', completed: 'status-completed' };
    const severityMap = { '轻微': 'severity-low', '一般': 'severity-medium', '严重': 'severity-high' };

    const tbody = document.getElementById('records-table-body');
    tbody.innerHTML = records.map(record => `
        <tr>
            <td>${record.id}</td>
            <td>${record.point?.name || '-'}</td>
            <td>${new Date(record.inspection_time).toLocaleString()}</td>
            <td>${record.inspector}</td>
            <td>${record.problem_type}</td>
            <td><span class="status-badge ${severityMap[record.severity] || ''}">${record.severity}</span></td>
            <td><span class="status-badge ${statusClass[record.status]}">${statusMap[record.status]}</span></td>
            <td>
                <button class="btn btn-small btn-primary" onclick="viewRecordDetail(${record.id})">详情</button>
                <button class="btn btn-small btn-warning" onclick="addRectification(${record.id})">整改</button>
                <button class="btn btn-small btn-danger" onclick="deleteRecord(${record.id})">删除</button>
            </td>
        </tr>
    `).join('');
}

async function loadPointSelects() {
    const points = await API.getAllPoints();
    const options = '<option value="">全部点位</option>' + points.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
    document.getElementById('filter-record-point').innerHTML = options;
    document.getElementById('record-point').innerHTML = points.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
}

function openRecordModal() {
    document.getElementById('record-modal').classList.add('active');
    document.getElementById('record-form').reset();
    document.getElementById('record-inspection-time').value = new Date().toISOString().slice(0, 16);
}

function closeRecordModal() {
    document.getElementById('record-modal').classList.remove('active');
}

async function saveRecord() {
    const data = {
        point_id: parseInt(document.getElementById('record-point').value),
        inspection_time: document.getElementById('record-inspection-time').value,
        inspector: document.getElementById('record-inspector').value,
        problem_type: document.getElementById('record-problem-type').value,
        severity: document.getElementById('record-severity').value,
        description: document.getElementById('record-description').value
    };

    try {
        await API.createRecord(data);
        closeRecordModal();
        loadRecords();
    } catch (error) {
        alert('保存失败: ' + error.message);
    }
}

async function viewRecordDetail(id) {
    const record = await API.getRecord(id);
    const statusMap = { pending: '待整改', processing: '整改中', completed: '已完成' };
    const statusClass = { pending: 'status-pending', processing: 'status-processing', completed: 'status-completed' };

    document.getElementById('record-detail-modal').classList.add('active');
    document.getElementById('detail-point-name').textContent = record.point?.name || '-';
    document.getElementById('detail-inspection-time').textContent = new Date(record.inspection_time).toLocaleString();
    document.getElementById('detail-inspector').textContent = record.inspector;
    document.getElementById('detail-problem-type').textContent = record.problem_type;
    document.getElementById('detail-severity').textContent = record.severity;
    document.getElementById('detail-status').innerHTML = `<span class="status-badge ${statusClass[record.status]}">${statusMap[record.status]}</span>`;
    document.getElementById('detail-description').textContent = record.description;

    const rectList = document.getElementById('detail-rectifications');
    if (record.rectifications && record.rectifications.length > 0) {
        rectList.innerHTML = record.rectifications.map(r => `
            <div class="rectification-item ${r.status === 'completed' ? 'completed' : ''}">
                <div class="header">
                    <span class="status-badge ${r.status === 'completed' ? 'status-completed' : 'status-processing'}">${r.status === 'completed' ? '整改完成' : '整改中'}</span>
                    <span class="time">${new Date(r.created_at).toLocaleString()}</span>
                </div>
                <div class="content">
                    <p><strong>整改措施：</strong>${r.measures}</p>
                    <p><strong>责任人：</strong>${r.person_in_charge || '-'}</p>
                    <p><strong>备注：</strong>${r.remarks || '-'}</p>
                </div>
            </div>
        `).join('');
    } else {
        rectList.innerHTML = '<div class="empty-state">暂无整改记录</div>';
    }
}

function closeRecordDetailModal() {
    document.getElementById('record-detail-modal').classList.remove('active');
}

async function addRectification(recordId) {
    document.getElementById('current-record-id').value = recordId;
    document.getElementById('rectification-modal').classList.add('active');
    document.getElementById('rectification-form').reset();
}

function closeRectificationModal() {
    document.getElementById('rectification-modal').classList.remove('active');
}

async function saveRectification() {
    const recordId = document.getElementById('current-record-id').value;
    const data = {
        measures: document.getElementById('rect-measures').value,
        person_in_charge: document.getElementById('rect-person').value,
        status: document.getElementById('rect-status').value,
        remarks: document.getElementById('rect-remarks').value
    };
    if (document.getElementById('rect-time').value) {
        data.rectification_time = document.getElementById('rect-time').value;
    }

    try {
        await API.createRectification(recordId, data);
        closeRectificationModal();
        loadRecords();
        if (currentPage === 'rectification') loadRectificationRecords();
    } catch (error) {
        alert('保存失败: ' + error.message);
    }
}

async function deleteRecord(id) {
    if (confirm('确定要删除该记录吗？')) {
        await API.deleteRecord(id);
        loadRecords();
        if (currentPage === 'rectification') loadRectificationRecords();
    }
}

let rectPage = 1;
let rectTotal = 0;

async function loadRectificationRecords() {
    const status = document.getElementById('filter-rect-status').value;
    
    try {
        const data = await API.getRecords({ 
            page: rectPage, 
            pageSize: 10, 
            status
        });
        rectTotal = data.total;
        renderRectificationTable(data.list);
        renderPagination('rect-pagination', rectPage, Math.ceil(rectTotal / 10), (page) => {
            rectPage = page;
            loadRectificationRecords();
        });
    } catch (error) {
        console.error('Failed to load rectification records:', error);
    }
}

function renderRectificationTable(records) {
    const statusMap = { pending: '待整改', processing: '整改中', completed: '已完成' };
    const statusClass = { pending: 'status-pending', processing: 'status-processing', completed: 'status-completed' };

    const tbody = document.getElementById('rect-table-body');
    tbody.innerHTML = records.map(record => `
        <tr>
            <td>${record.id}</td>
            <td>${record.point?.name || '-'}</td>
            <td>${record.problem_type}</td>
            <td>${record.description.substring(0, 30)}...</td>
            <td><span class="status-badge ${statusClass[record.status]}">${statusMap[record.status]}</span></td>
            <td>${new Date(record.created_at).toLocaleString()}</td>
            <td>
                <button class="btn btn-small btn-primary" onclick="viewRecordDetail(${record.id})">详情</button>
                <button class="btn btn-small btn-warning" onclick="addRectification(${record.id})">处理</button>
            </td>
        </tr>
    `).join('');
}

async function loadStatsPage() {
    const startDate = document.getElementById('stats-start-date').value;
    const endDate = document.getElementById('stats-end-date').value;

    try {
        const rectData = await API.getRectificationStats();
        document.getElementById('stats-total').textContent = rectData.total;
        document.getElementById('stats-pending').textContent = rectData.pending;
        document.getElementById('stats-processing').textContent = rectData.processing;
        document.getElementById('stats-completed').textContent = rectData.completed;
        document.getElementById('stats-rate').textContent = rectData.completion_rate.toFixed(1) + '%';

        const timeData = await API.getStatsByTime({ start_date: startDate, end_date: endDate });
        const pointData = await API.getStatsByPoint();
        const typeData = await API.getStatsByType();

        if (charts.statsTimeChart) charts.statsTimeChart.dispose();
        charts.statsTimeChart = echarts.init(document.getElementById('stats-time-chart'));
        charts.statsTimeChart.setOption({
            title: { text: '巡查趋势', left: 'center' },
            tooltip: { trigger: 'axis' },
            xAxis: { type: 'category', data: timeData.map(d => d.date) },
            yAxis: { type: 'value' },
            series: [{
                data: timeData.map(d => d.count),
                type: 'bar',
                itemStyle: { color: '#0052d9' }
            }]
        });

        if (charts.statsPointChart) charts.statsPointChart.dispose();
        charts.statsPointChart = echarts.init(document.getElementById('stats-point-chart'));
        charts.statsPointChart.setOption({
            title: { text: '各点位问题分布', left: 'center' },
            tooltip: { trigger: 'axis' },
            xAxis: { type: 'value' },
            yAxis: { type: 'category', data: pointData.map(d => d.point_name) },
            series: [{
                type: 'bar',
                data: pointData.map(d => d.count),
                itemStyle: { color: '#52c41a' }
            }]
        });

        if (charts.statsTypeChart) charts.statsTypeChart.dispose();
        charts.statsTypeChart = echarts.init(document.getElementById('stats-type-chart'));
        charts.statsTypeChart.setOption({
            title: { text: '问题类型分布', left: 'center' },
            tooltip: { trigger: 'item' },
            legend: { bottom: '5%' },
            series: [{
                type: 'pie',
                radius: '60%',
                data: typeData.map(d => ({ name: d.problem_type, value: d.count }))
            }]
        });
    } catch (error) {
        console.error('Failed to load stats:', error);
    }
}

function exportData() {
    const startDate = document.getElementById('stats-start-date').value;
    const endDate = document.getElementById('stats-end-date').value;
    API.exportRecords({ start_date: startDate, end_date: endDate });
}

window.addEventListener('resize', () => {
    Object.values(charts).forEach(chart => chart && chart.resize());
});

document.addEventListener('DOMContentLoaded', async () => {
    await loadPointSelects();
    showPage('dashboard');
});
