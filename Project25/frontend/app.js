let API_BASE = '';

if (typeof window !== 'undefined' && window.API_BASE) {
    API_BASE = window.API_BASE;
} else if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    const port = window.location.port;
    if (port) {
        API_BASE = `http://localhost:${port}`;
    } else {
        API_BASE = 'http://localhost';
    }
}

let students = [];
let courses = [];
let schedules = [];
let records = [];

document.addEventListener('DOMContentLoaded', function() {
    loadAllData();
    setupNavigation();
    setupForms();
    setDefaultDates();
});

function setDefaultDates() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('student-enrollment-date').value = today;
    document.getElementById('record-date').value = today;
    document.getElementById('schedule-start-date').value = today;
    document.getElementById('filter-date').value = today;
}

function setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            navButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const page = this.dataset.page;
            document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
            document.getElementById('page-' + page).classList.add('active');
            
            if (page === 'schedule') {
                loadScheduleView();
            }
        });
    });
}

function setupForms() {
    document.getElementById('student-form').addEventListener('submit', handleStudentSubmit);
    document.getElementById('course-form').addEventListener('submit', handleCourseSubmit);
    document.getElementById('schedule-form').addEventListener('submit', handleScheduleSubmit);
    document.getElementById('record-form').addEventListener('submit', handleRecordSubmit);
    
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
            }
        });
    });
}

async function loadAllData() {
    await Promise.all([
        loadStudents(),
        loadCourses(),
        loadSchedules(),
        loadRecords()
    ]);
    loadDashboard();
}

async function loadStudents() {
    try {
        const response = await fetch(`${API_BASE}/api/students/`);
        students = await response.json();
        renderStudentsTable();
        updateStudentSelects();
    } catch (error) {
        console.error('加载学员失败:', error);
    }
}

async function loadCourses() {
    try {
        const response = await fetch(`${API_BASE}/api/courses/`);
        courses = await response.json();
        renderCoursesGrid();
        updateCourseSelects();
    } catch (error) {
        console.error('加载课程失败:', error);
    }
}

async function loadSchedules() {
    try {
        const response = await fetch(`${API_BASE}/api/schedules/`);
        schedules = await response.json();
    } catch (error) {
        console.error('加载排班失败:', error);
    }
}

async function loadRecords() {
    try {
        let url = `${API_BASE}/api/classes/`;
        const params = new URLSearchParams();
        
        const studentId = document.getElementById('filter-student').value;
        const date = document.getElementById('filter-date').value;
        
        if (studentId) params.append('student_id', studentId);
        if (date) params.append('start_date', date);
        
        if (params.toString()) {
            url += '?' + params.toString();
        }
        
        const response = await fetch(url);
        records = await response.json();
        renderRecordsTable();
    } catch (error) {
        console.error('加载记录失败:', error);
    }
}

function loadDashboard() {
    const totalStudents = students.length;
    const totalHours = students.reduce((sum, s) => sum + (s.total_hours || 0), 0);
    const usedHours = students.reduce((sum, s) => sum + (s.used_hours || 0), 0);
    const remainingHours = students.reduce((sum, s) => sum + (s.remaining_hours || 0), 0);
    
    document.getElementById('stat-students').textContent = totalStudents;
    document.getElementById('stat-total-hours').textContent = totalHours;
    document.getElementById('stat-used-hours').textContent = usedHours;
    document.getElementById('stat-remaining-hours').textContent = remainingHours;
    
    const warningList = document.getElementById('warning-list');
    const lowHoursStudents = students.filter(s => s.remaining_hours <= 5);
    
    if (lowHoursStudents.length > 0) {
        warningList.innerHTML = lowHoursStudents.map(s => `
            <div class="warning-item ${s.remaining_hours <= 2 ? 'low' : ''}">
                <span>${s.name} (${s.age}岁)</span>
                <span>剩余: ${s.remaining_hours}课时</span>
            </div>
        `).join('');
    } else {
        warningList.innerHTML = '<p class="empty-tip">暂无课时预警</p>';
    }
    
    const today = new Date();
    const dayOfWeek = today.getDay();
    const todaySchedule = schedules.filter(s => s.day_of_week === dayOfWeek && s.is_active);
    
    const todayScheduleEl = document.getElementById('today-schedule');
    if (todaySchedule.length > 0) {
        todayScheduleEl.innerHTML = todaySchedule
            .sort((a, b) => a.start_time.localeCompare(b.start_time))
            .map(s => `
                <div class="schedule-item" style="border-left-color: ${s.course_color}">
                    <div class="schedule-time">${s.start_time} - ${s.end_time}</div>
                    <div class="schedule-info">
                        <div class="schedule-student">${s.student_name}</div>
                        <div class="schedule-course">${s.course_name}</div>
                    </div>
                </div>
            `).join('');
    } else {
        todayScheduleEl.innerHTML = '<p class="empty-tip">今日暂无课程</p>';
    }
}

function renderStudentsTable() {
    const tbody = document.getElementById('students-table-body');
    tbody.innerHTML = students.map(s => `
        <tr>
            <td><strong>${s.name}</strong></td>
            <td>${s.gender}</td>
            <td>${s.age}</td>
            <td>${s.parent_name}</td>
            <td>${s.phone}</td>
            <td>${s.total_hours}</td>
            <td>${s.used_hours}</td>
            <td>
                <span class="hours-badge ${s.remaining_hours <= 2 ? 'danger' : s.remaining_hours <= 5 ? 'warning' : 'normal'}">
                    ${s.remaining_hours}
                </span>
            </td>
            <td>${s.enrollment_date}</td>
            <td>
                <button class="btn-secondary" onclick="editStudent(${s.id})">编辑</button>
                <button class="btn-danger" onclick="deleteStudent(${s.id})">删除</button>
            </td>
        </tr>
    `).join('');
}

function renderCoursesGrid() {
    const grid = document.getElementById('courses-grid');
    grid.innerHTML = courses.map(c => `
        <div class="course-card" style="border-top-color: ${c.color}">
            <h3>${c.name}</h3>
            <p>${c.description || '暂无描述'}</p>
            <div class="course-actions">
                <button class="btn-secondary" onclick="editCourse(${c.id})">编辑</button>
                <button class="btn-danger" onclick="deleteCourse(${c.id})">删除</button>
            </div>
        </div>
    `).join('');
}

function renderRecordsTable() {
    const tbody = document.getElementById('records-table-body');
    tbody.innerHTML = records.map(r => `
        <tr>
            <td>${r.class_date}</td>
            <td><strong>${r.student_name}</strong></td>
            <td>${r.course_name}</td>
            <td>${r.start_time}</td>
            <td>${r.end_time}</td>
            <td>${r.hours}课时</td>
            <td>${r.notes || '-'}</td>
            <td>
                <button class="btn-danger" onclick="deleteRecord(${r.id})">删除</button>
            </td>
        </tr>
    `).join('');
}

function loadScheduleView() {
    const body = document.getElementById('schedule-body');
    body.innerHTML = '';
    
    const timeSlots = [
        '09:00-10:30',
        '10:30-12:00',
        '14:00-15:30',
        '15:30-17:00',
        '17:00-18:30',
        '18:30-20:00'
    ];
    
    timeSlots.forEach(slot => {
        const [start, end] = slot.split('-');
        const row = document.createElement('div');
        row.className = 'schedule-row';
        
        let rowHtml = `<div class="schedule-cell time-cell">${slot}</div>`;
        
        for (let day = 1; day <= 7; day++) {
            const dayOfWeek = day === 7 ? 0 : day;
            const daySchedules = schedules.filter(s => 
                s.day_of_week === dayOfWeek && 
                s.start_time === start && 
                s.end_time === end &&
                s.is_active
            );
            
            rowHtml += `<div class="schedule-cell">`;
            daySchedules.forEach(s => {
                rowHtml += `<div class="schedule-event" style="background: ${s.course_color}">
                    ${s.student_name}<br>
                    <small>${s.course_name}</small>
                </div>`;
            });
            rowHtml += `</div>`;
        }
        
        row.innerHTML = rowHtml;
        body.appendChild(row);
    });
}

function updateStudentSelects() {
    const selects = ['schedule-student', 'record-student', 'filter-student'];
    selects.forEach(id => {
        const select = document.getElementById(id);
        if (select) {
            const currentValue = select.value;
            const placeholder = select.querySelector('option:not([value])')?.textContent || '请选择学员';
            
            select.innerHTML = `<option value="">${placeholder === '全部学员' ? '全部学员' : '请选择学员'}</option>` +
                students.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
            select.value = currentValue;
        }
    });
}

function updateCourseSelects() {
    const selects = ['schedule-course', 'record-course'];
    selects.forEach(id => {
        const select = document.getElementById(id);
        if (select) {
            const currentValue = select.value;
            select.innerHTML = '<option value="">请选择课程</option>' +
                courses.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
            select.value = currentValue;
        }
    });
}

function updateStudentCourses() {
    const studentId = document.getElementById('record-student').value;
    const courseSelect = document.getElementById('record-course');
    
    if (studentId) {
        const studentSchedules = schedules.filter(s => s.student_id == studentId);
        const studentCourseIds = [...new Set(studentSchedules.map(s => s.course_id))];
        
        let availableCourses = courses;
        if (studentCourseIds.length > 0) {
            availableCourses = courses.filter(c => studentCourseIds.includes(c.id));
        }
        
        courseSelect.innerHTML = '<option value="">请选择课程</option>' +
            availableCourses.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    } else {
        updateCourseSelects();
    }
}

function openStudentModal(studentId = null) {
    document.getElementById('student-form').reset();
    document.getElementById('student-id').value = '';
    document.getElementById('student-modal-title').textContent = '添加学员';
    setDefaultDates();
    
    if (studentId) {
        const student = students.find(s => s.id === studentId);
        if (student) {
            document.getElementById('student-id').value = student.id;
            document.getElementById('student-name').value = student.name;
            document.getElementById('student-gender').value = student.gender;
            document.getElementById('student-age').value = student.age;
            document.getElementById('student-parent').value = student.parent_name;
            document.getElementById('student-phone').value = student.phone;
            document.getElementById('student-total-hours').value = student.total_hours;
            document.getElementById('student-enrollment-date').value = student.enrollment_date;
            document.getElementById('student-modal-title').textContent = '编辑学员';
        }
    }
    
    document.getElementById('student-modal').classList.add('active');
}

function editStudent(id) {
    openStudentModal(id);
}

async function deleteStudent(id) {
    if (!confirm('确定要删除此学员吗？')) return;
    
    try {
        const response = await fetch(`${API_BASE}/api/students/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showToast('删除成功');
            loadAllData();
        } else {
            showToast('删除失败', true);
        }
    } catch (error) {
        showToast('删除失败', true);
    }
}

async function handleStudentSubmit(e) {
    e.preventDefault();
    
    const id = document.getElementById('student-id').value;
    const data = {
        name: document.getElementById('student-name').value,
        gender: document.getElementById('student-gender').value,
        age: parseInt(document.getElementById('student-age').value),
        parent_name: document.getElementById('student-parent').value,
        phone: document.getElementById('student-phone').value,
        total_hours: parseInt(document.getElementById('student-total-hours').value),
        enrollment_date: document.getElementById('student-enrollment-date').value
    };
    
    try {
        const url = id ? `${API_BASE}/api/students/${id}` : `${API_BASE}/api/students/`;
        const method = id ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            showToast('保存成功');
            closeModal('student-modal');
            loadAllData();
        } else {
            showToast('保存失败', true);
        }
    } catch (error) {
        showToast('保存失败', true);
    }
}

function openCourseModal(courseId = null) {
    document.getElementById('course-form').reset();
    document.getElementById('course-id').value = '';
    document.getElementById('course-modal-title').textContent = '添加课程';
    document.getElementById('course-color').value = '#1890ff';
    
    if (courseId) {
        const course = courses.find(c => c.id === courseId);
        if (course) {
            document.getElementById('course-id').value = course.id;
            document.getElementById('course-name').value = course.name;
            document.getElementById('course-description').value = course.description;
            document.getElementById('course-color').value = course.color;
            document.getElementById('course-modal-title').textContent = '编辑课程';
        }
    }
    
    document.getElementById('course-modal').classList.add('active');
}

function editCourse(id) {
    openCourseModal(id);
}

async function deleteCourse(id) {
    if (!confirm('确定要删除此课程吗？')) return;
    
    try {
        const response = await fetch(`${API_BASE}/api/courses/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showToast('删除成功');
            loadAllData();
        } else {
            showToast('删除失败', true);
        }
    } catch (error) {
        showToast('删除失败', true);
    }
}

async function handleCourseSubmit(e) {
    e.preventDefault();
    
    const id = document.getElementById('course-id').value;
    const data = {
        name: document.getElementById('course-name').value,
        description: document.getElementById('course-description').value,
        color: document.getElementById('course-color').value
    };
    
    try {
        const url = id ? `${API_BASE}/api/courses/${id}` : `${API_BASE}/api/courses/`;
        const method = id ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            showToast('保存成功');
            closeModal('course-modal');
            loadAllData();
        } else {
            showToast('保存失败', true);
        }
    } catch (error) {
        showToast('保存失败', true);
    }
}

function openScheduleModal() {
    document.getElementById('schedule-form').reset();
    setDefaultDates();
    document.getElementById('schedule-modal').classList.add('active');
}

async function handleScheduleSubmit(e) {
    e.preventDefault();
    
    const data = {
        student_id: parseInt(document.getElementById('schedule-student').value),
        course_id: parseInt(document.getElementById('schedule-course').value),
        day_of_week: parseInt(document.getElementById('schedule-day').value),
        start_time: document.getElementById('schedule-start').value,
        end_time: document.getElementById('schedule-end').value,
        start_date: document.getElementById('schedule-start-date').value,
        end_date: document.getElementById('schedule-end-date').value || null
    };
    
    try {
        const response = await fetch(`${API_BASE}/api/schedules/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            showToast('排班成功');
            closeModal('schedule-modal');
            loadAllData();
            loadScheduleView();
        } else {
            showToast('排班失败', true);
        }
    } catch (error) {
        showToast('排班失败', true);
    }
}

function openRecordModal() {
    document.getElementById('record-form').reset();
    setDefaultDates();
    document.getElementById('record-modal').classList.add('active');
}

async function handleRecordSubmit(e) {
    e.preventDefault();
    
    const data = {
        student_id: parseInt(document.getElementById('record-student').value),
        course_id: parseInt(document.getElementById('record-course').value),
        class_date: document.getElementById('record-date').value,
        start_time: document.getElementById('record-start').value,
        end_time: document.getElementById('record-end').value,
        hours: parseInt(document.getElementById('record-hours').value),
        notes: document.getElementById('record-notes').value
    };
    
    try {
        const response = await fetch(`${API_BASE}/api/classes/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            showToast('登记成功');
            closeModal('record-modal');
            loadAllData();
        } else {
            const error = await response.json();
            showToast(error.error || '登记失败', true);
        }
    } catch (error) {
        showToast('登记失败', true);
    }
}

async function deleteRecord(id) {
    if (!confirm('确定要删除此记录吗？删除后课时将返还。')) return;
    
    try {
        const response = await fetch(`${API_BASE}/api/classes/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showToast('删除成功');
            loadAllData();
        } else {
            showToast('删除失败', true);
        }
    } catch (error) {
        showToast('删除失败', true);
    }
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function showToast(message, isError = false) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast show' + (isError ? ' error' : '');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
