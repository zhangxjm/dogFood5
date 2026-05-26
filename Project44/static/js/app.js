let courts = [];
let timeSlots = [];
let selectedTimeSlotId = null;
let currentPage = 1;

document.addEventListener('DOMContentLoaded', function() {
    initDefaults();
    loadCourts();
    loadTimeSlots();
    setupEventListeners();
});

function initDefaults() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('reserveDate').value = today;
    document.getElementById('queryDate').value = today;
    document.getElementById('reserveDate').min = today;
    document.getElementById('queryDate').min = today;
}

function setupEventListeners() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tab = this.dataset.tab;
            switchTab(tab);
        });
    });

    document.getElementById('reserveDate').addEventListener('change', loadAvailableSlots);
    document.getElementById('courtSelect').addEventListener('change', loadAvailableSlots);
    document.getElementById('reserveBtn').addEventListener('click', makeReservation);
    document.getElementById('queryBtn').addEventListener('click', queryReservations);
    document.getElementById('historyBtn').addEventListener('click', searchHistory);
}

function switchTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tab);
    });
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.toggle('active', content.id === tab);
    });
    if (tab === 'history') {
        searchHistory();
    }
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    setTimeout(() => {
        toast.className = 'toast';
    }, 3000);
}

async function loadCourts() {
    try {
        const response = await fetch('/api/courts');
        const result = await response.json();
        if (result.code === 200) {
            courts = result.data;
            const select = document.getElementById('courtSelect');
            const querySelect = document.getElementById('queryCourt');
            courts.forEach(court => {
                const option1 = document.createElement('option');
                option1.value = court.id;
                option1.textContent = court.name;
                select.appendChild(option1);

                const option2 = document.createElement('option');
                option2.value = court.id;
                option2.textContent = court.name;
                querySelect.appendChild(option2);
            });
        }
    } catch (error) {
        console.error('Error loading courts:', error);
    }
}

async function loadTimeSlots() {
    try {
        const response = await fetch('/api/time_slots');
        const result = await response.json();
        if (result.code === 200) {
            timeSlots = result.data;
        }
    } catch (error) {
        console.error('Error loading time slots:', error);
    }
}

async function loadAvailableSlots() {
    const date = document.getElementById('reserveDate').value;
    const courtId = document.getElementById('courtSelect').value;
    const container = document.getElementById('timeSlotContainer');

    if (!date || !courtId) {
        container.innerHTML = '<p class="hint">Please select date and court first</p>';
        return;
    }

    try {
        const response = await fetch(`/api/available_slots?date=${date}&court_id=${courtId}`);
        const result = await response.json();
        if (result.code === 200) {
            container.innerHTML = '';
            selectedTimeSlotId = null;
            result.data.forEach(slot => {
                const div = document.createElement('div');
                div.className = `time-slot ${slot.available ? 'available' : 'reserved'}`;
                div.textContent = `${slot.start_time}-${slot.end_time}`;
                if (slot.available) {
                    div.addEventListener('click', function() {
                        document.querySelectorAll('.time-slot.selected').forEach(el => {
                            el.classList.remove('selected');
                        });
                        this.classList.add('selected');
                        selectedTimeSlotId = slot.id;
                    });
                }
                container.appendChild(div);
            });
        }
    } catch (error) {
        console.error('Error loading available slots:', error);
        container.innerHTML = '<p class="hint">Error loading time slots</p>';
    }
}

async function makeReservation() {
    const courtId = document.getElementById('courtSelect').value;
    const date = document.getElementById('reserveDate').value;
    const userName = document.getElementById('userName').value.trim();
    const userPhone = document.getElementById('userPhone').value.trim();

    if (!courtId) {
        showToast('Please select a court', 'error');
        return;
    }
    if (!date) {
        showToast('Please select a date', 'error');
        return;
    }
    if (!selectedTimeSlotId) {
        showToast('Please select a time slot', 'error');
        return;
    }
    if (!userName) {
        showToast('Please enter your name', 'error');
        return;
    }
    if (!userPhone) {
        showToast('Please enter your phone number', 'error');
        return;
    }

    try {
        const response = await fetch('/api/reserve', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                court_id: parseInt(courtId),
                time_slot_id: selectedTimeSlotId,
                date: date,
                user_name: userName,
                user_phone: userPhone
            })
        });
        const result = await response.json();
        if (result.code === 200) {
            showToast('Reservation successful!', 'success');
            document.getElementById('userName').value = '';
            document.getElementById('userPhone').value = '';
            selectedTimeSlotId = null;
            loadAvailableSlots();
        } else {
            showToast(result.message || 'Reservation failed', 'error');
        }
    } catch (error) {
        console.error('Error making reservation:', error);
        showToast('Reservation failed, please try again', 'error');
    }
}

async function queryReservations() {
    const date = document.getElementById('queryDate').value;
    const courtId = document.getElementById('queryCourt').value;
    const container = document.getElementById('queryResults');

    if (!date) {
        showToast('Please select a date', 'error');
        return;
    }

    let url = `/api/reservations?date=${date}`;
    if (courtId) {
        url += `&court_id=${courtId}`;
    }

    try {
        const response = await fetch(url);
        const result = await response.json();
        if (result.code === 200) {
            if (result.data.length === 0) {
                container.innerHTML = '<p class="hint">No reservation records found</p>';
            } else {
                container.innerHTML = renderReservationTable(result.data, false);
            }
        }
    } catch (error) {
        console.error('Error querying reservations:', error);
        container.innerHTML = '<p class="hint">Error querying reservations</p>';
    }
}

async function searchHistory() {
    const keyword = document.getElementById('historyKeyword').value.trim();
    const container = document.getElementById('historyResults');
    const pagination = document.getElementById('pagination');

    let url = `/api/reservations/history?page=${currentPage}&per_page=10`;
    if (keyword) {
        url += `&keyword=${encodeURIComponent(keyword)}`;
    }

    try {
        const response = await fetch(url);
        const result = await response.json();
        if (result.code === 200) {
            if (result.data.length === 0) {
                container.innerHTML = '<p class="hint">No history records found</p>';
                pagination.innerHTML = '';
            } else {
                container.innerHTML = renderReservationTable(result.data, true);
                pagination.innerHTML = renderPagination(result.pages, currentPage);
                setupPaginationEvents();
            }
        }
    } catch (error) {
        console.error('Error searching history:', error);
        container.innerHTML = '<p class="hint">Error searching history</p>';
    }
}

function renderReservationTable(data, showCancel) {
    let html = `
        <table class="result-table">
            <thead>
                <tr>
                    <th>Court</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Created Time</th>
                    ${showCancel ? '<th>Action</th>' : ''}
                </tr>
            </thead>
            <tbody>
    `;

    data.forEach(item => {
        const statusClass = item.status === 'reserved' ? 'reserved' : 'cancelled';
        const statusText = item.status === 'reserved' ? 'Reserved' : 'Cancelled';
        html += `
            <tr>
                <td>${item.court_name}</td>
                <td>${item.date}</td>
                <td>${item.time_range}</td>
                <td>${item.user_name}</td>
                <td>${item.user_phone}</td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                <td>${item.created_at}</td>
                ${showCancel ? `<td>${item.status === 'reserved' ? `<button class="btn-cancel" onclick="cancelReservation(${item.id})">Cancel</button>` : '-'}</td>` : ''}
            </tr>
        `;
    });

    html += '</tbody></table>';
    return html;
}

function renderPagination(totalPages, current) {
    let html = '';
    if (totalPages > 1) {
        html += `<button class="page-btn" data-page="1" ${current === 1 ? 'disabled' : ''}>&laquo; First</button>`;
        html += `<button class="page-btn" data-page="${current - 1}" ${current === 1 ? 'disabled' : ''}>Previous</button>`;
        
        const start = Math.max(1, current - 2);
        const end = Math.min(totalPages, current + 2);
        
        for (let i = start; i <= end; i++) {
            html += `<button class="page-btn ${i === current ? 'active' : ''}" data-page="${i}">${i}</button>`;
        }
        
        html += `<button class="page-btn" data-page="${current + 1}" ${current === totalPages ? 'disabled' : ''}>Next</button>`;
        html += `<button class="page-btn" data-page="${totalPages}" ${current === totalPages ? 'disabled' : ''}>Last &raquo;</button>`;
    }
    return html;
}

function setupPaginationEvents() {
    document.querySelectorAll('.page-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.disabled) return;
            currentPage = parseInt(this.dataset.page);
            searchHistory();
        });
    });
}

async function cancelReservation(id) {
    if (!confirm('Are you sure you want to cancel this reservation?')) {
        return;
    }
    try {
        const response = await fetch(`/api/reservations/${id}/cancel`, {
            method: 'POST'
        });
        const result = await response.json();
        if (result.code === 200) {
            showToast('Cancellation successful!', 'success');
            searchHistory();
        } else {
            showToast(result.message || 'Cancellation failed', 'error');
        }
    } catch (error) {
        console.error('Error cancelling reservation:', error);
        showToast('Cancellation failed', 'error');
    }
}
