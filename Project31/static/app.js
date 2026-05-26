const API = "/api";

function fmtTime(t) {
  if (!t) return "";
  const d = new Date(t);
  return d.toLocaleString("zh-CN", { hour12: false });
}
function fmtDate(t) {
  if (!t) return "";
  const d = new Date(t);
  return d.toLocaleDateString("zh-CN") + " " + d.toTimeString().slice(0, 8);
}

const $ = (sel, el = document) => el.querySelector(sel);
const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];

function switchTab(name) {
  $$(".nav-item").forEach(x => x.classList.toggle("active", x.dataset.tab === name));
  $$(".tab-panel").forEach(x => x.classList.toggle("active", x.id === "tab-" + name));
}

// ------- Tabs -------
$$(".nav-item").forEach(t => t.addEventListener("click", () => switchTab(t.dataset.tab)));

// ------- Today date -------
$("#today-date").textContent = new Date().toLocaleDateString("zh-CN", {
  year: "numeric", month: "long", day: "numeric", weekday: "long"
});

// ============================================================
// Employees
// ============================================================
let allEmployees = [];

async function loadEmployees() {
  const r = await fetch(`${API}/employees`);
  allEmployees = await r.json();
  renderEmployees(allEmployees);

  const sel = $("#access-emp");
  sel.innerHTML = '<option value="">-- 选择员工 --</option>' +
    allEmployees.map(e => `<option value="${e.id}">${e.name} (${e.employee_no || ""})</option>`).join("");
  const fsel = $("#f-emp");
  fsel.innerHTML = '<option value="">全部</option>' +
    allEmployees.map(e => `<option value="${e.id}">${e.name}</option>`).join("");
}

function renderEmployees(list) {
  const tb = $("#emp-tbody");
  if (!list.length) {
    tb.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:30px;color:#94a3b8;">暂无数据</td></tr>`;
    return;
  }
  tb.innerHTML = list.map(e => `
    <tr>
      <td>${e.id}</td>
      <td><strong>${e.name}</strong></td>
      <td>${e.dept || "-"}</td>
      <td>${e.employee_no || "-"}</td>
      <td>${e.phone || "-"}</td>
      <td><button class="btn-link btn-danger" data-del="${e.id}">🗑 删除</button></td>
    </tr>
  `).join("");
}

$("#emp-form").addEventListener("submit", async ev => {
  ev.preventDefault();
  const fd = new FormData(ev.target);
  await fetch(`${API}/employees`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(Object.fromEntries(fd))
  });
  ev.target.reset();
  loadEmployees();
  loadDashboard();
});

document.addEventListener("click", async (e) => {
  const id = e.target?.dataset?.del;
  if (id) {
    if (!confirm("确认删除该员工？相关出入记录也会被清除。")) return;
    const r = await fetch(`${API}/employees/${id}`, { method: "DELETE" });
    if (!r.ok) {
      const err = await r.json().catch(() => ({}));
      alert("删除失败：" + (err.error || "请重试"));
      return;
    }
    loadEmployees();
    loadDashboard();
  }
});

$("#emp-search").addEventListener("input", (e) => {
  const q = e.target.value.trim().toLowerCase();
  if (!q) { renderEmployees(allEmployees); return; }
  renderEmployees(allEmployees.filter(e =>
    e.name.toLowerCase().includes(q) ||
    (e.employee_no || "").toLowerCase().includes(q) ||
    (e.dept || "").toLowerCase().includes(q)
  ));
});

// ============================================================
// Access Records
// ============================================================
let allAccess = [];

async function loadAccess(filter = {}) {
  const p = new URLSearchParams();
  Object.entries(filter).forEach(([k, v]) => { if (v) p.set(k, v); });
  const r = await fetch(`${API}/access?${p.toString()}`);
  allAccess = await r.json();
  renderAccess(allAccess);
}

function renderAccess(list) {
  const tb = $("#access-tbody");
  if (!list.length) {
    tb.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:30px;color:#94a3b8;">暂无记录</td></tr>`;
  } else {
    tb.innerHTML = list.map(a => {
      const name = a.employee ? a.employee.name : "(已删除)";
      const dept = a.employee ? (a.employee.dept || "-") : "-";
      const dir = a.direction === "in" ? "入厂" : "出厂";
      return `
        <tr>
          <td>${a.id}</td>
          <td><strong>${name}</strong></td>
          <td>${dept}</td>
          <td><span class="badge ${a.direction}">${dir}</span></td>
          <td>${a.reason || "-"}</td>
          <td>${fmtDate(a.record_time)}</td>
        </tr>
      `;
    }).join("");
  }
  $("#access-footer").textContent = list.length ? `共 ${list.length} 条记录` : "";
}

$("#access-form").addEventListener("submit", async ev => {
  ev.preventDefault();
  const fd = new FormData(ev.target);
  const data = {
    employee_id: parseInt(fd.get("employee_id")),
    direction: fd.get("direction"),
    reason: fd.get("reason")
  };
  await fetch(`${API}/access`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  ev.target.reset();
  loadAccess();
  loadDashboard();
});

$("#f-apply").addEventListener("click", () => {
  loadAccess({
    start: $("#f-start").value ? new Date($("#f-start").value).toISOString() : "",
    end: $("#f-end").value ? new Date($("#f-end").value).toISOString() : "",
    direction: $("#f-dir").value,
    employee_id: $("#f-emp").value
  });
});
$("#f-reset").addEventListener("click", () => {
  ["#f-start", "#f-end"].forEach(s => $(s).value = "");
  $("#f-dir").value = "";
  $("#f-emp").value = "";
  loadAccess();
});

// ============================================================
// Visitors
// ============================================================
let allVisitors = [];
let visitorStatusFilter = "";

async function loadVisitors() {
  const r = await fetch(`${API}/visitors`);
  allVisitors = await r.json();
  renderVisitors();
}

function renderVisitors() {
  const tb = $("#vis-tbody");
  let list = allVisitors;
  if (visitorStatusFilter) {
    list = list.filter(v => v.status === visitorStatusFilter);
  }
  if (!list.length) {
    tb.innerHTML = `<tr><td colspan="9" style="text-align:center;padding:30px;color:#94a3b8;">暂无访客记录</td></tr>`;
    return;
  }
  tb.innerHTML = list.map(v => {
    const statusText = v.status === "visiting" ? "在场" : "已离开";
    const action = v.status === "visiting"
      ? `<button class="btn-link" data-leave="${v.id}">✓ 签离</button>`
      : "-";
    return `
      <tr>
        <td>${v.id}</td>
        <td><strong>${v.name}</strong></td>
        <td>${v.company || "-"}</td>
        <td>${v.purpose || "-"}</td>
        <td>${v.contact || "-"}</td>
        <td>${fmtDate(v.visit_time)}</td>
        <td>${v.leave_time ? fmtDate(v.leave_time) : "-"}</td>
        <td><span class="badge ${v.status}">${statusText}</span></td>
        <td>${action}</td>
      </tr>
    `;
  }).join("");
}

$("#visitor-form").addEventListener("submit", async ev => {
  ev.preventDefault();
  const fd = new FormData(ev.target);
  await fetch(`${API}/visitors`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(Object.fromEntries(fd))
  });
  ev.target.reset();
  loadVisitors();
  loadDashboard();
});

document.addEventListener("click", async (e) => {
  const id = e.target?.dataset?.leave;
  if (id) {
    await fetch(`${API}/visitors/${id}/leave`, { method: "POST" });
    loadVisitors();
    loadDashboard();
  }
});

$$(".chip").forEach(c => c.addEventListener("click", () => {
  $$(".chip").forEach(x => x.classList.remove("active"));
  c.classList.add("active");
  visitorStatusFilter = c.dataset.visStatus;
  renderVisitors();
}));

// ============================================================
// Dashboard
// ============================================================
async function loadDashboard() {
  // stat cards
  $("#stat-emp").textContent = allEmployees.length;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayISO = today.toISOString();

  let inCount = 0, outCount = 0;
  try {
    const r = await fetch(`${API}/access?start=${todayISO}`);
    const todayAccess = await r.json();
    inCount = todayAccess.filter(a => a.direction === "in").length;
    outCount = todayAccess.filter(a => a.direction === "out").length;
  } catch (e) {}
  $("#stat-in").textContent = inCount;
  $("#stat-out").textContent = outCount;

  const visitingCount = allVisitors.filter(v => v.status === "visiting").length;
  $("#stat-vis").textContent = visitingCount;

  // recent access
  const dashTb = $("#dash-access-tbody");
  const recent = allAccess.slice(0, 6);
  if (!recent.length) {
    dashTb.innerHTML = `<tr><td colspan="4" style="text-align:center;padding:20px;color:#94a3b8;">暂无记录</td></tr>`;
  } else {
    dashTb.innerHTML = recent.map(a => {
      const name = a.employee ? a.employee.name : "(已删除)";
      const dept = a.employee ? (a.employee.dept || "-") : "-";
      const dir = a.direction === "in" ? "入厂" : "出厂";
      return `
        <tr>
          <td><strong>${name}</strong></td>
          <td>${dept}</td>
          <td><span class="badge ${a.direction}">${dir}</span></td>
          <td>${fmtDate(a.record_time)}</td>
        </tr>
      `;
    }).join("");
  }

  // current visitors
  const visTb = $("#dash-vis-tbody");
  const curVis = allVisitors.filter(v => v.status === "visiting").slice(0, 6);
  if (!curVis.length) {
    visTb.innerHTML = `<tr><td colspan="4" style="text-align:center;padding:20px;color:#94a3b8;">暂无在场访客</td></tr>`;
  } else {
    visTb.innerHTML = curVis.map(v => `
      <tr>
        <td><strong>${v.name}</strong></td>
        <td>${v.company || "-"}</td>
        <td>${v.purpose || "-"}</td>
        <td>${fmtDate(v.visit_time)}</td>
      </tr>
    `).join("");
  }
}

// ============================================================
// Init
// ============================================================
async function init() {
  await Promise.all([loadEmployees(), loadAccess(), loadVisitors()]);
  loadDashboard();
}
init();
