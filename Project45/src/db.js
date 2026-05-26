const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

let db;
let SQL;
let saveTimer = null;
let needsSave = false;

async function initDatabase() {
  SQL = await initSqlJs();
  const dbPath = path.join(__dirname, '..', 'travel.db');

  if (fs.existsSync(dbPath)) {
    try {
      const fileBuffer = fs.readFileSync(dbPath);
      db = new SQL.Database(fileBuffer);
    } catch (e) {
      console.warn('Failed to load existing database, creating new one:', e.message);
      db = new SQL.Database();
    }
  } else {
    db = new SQL.Database();
  }

  db.run('PRAGMA foreign_keys = ON');

  db.run(`
    CREATE TABLE IF NOT EXISTS trips (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      destination TEXT,
      start_date TEXT,
      end_date TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      icon TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      trip_id INTEGER NOT NULL,
      category_id INTEGER,
      name TEXT NOT NULL,
      quantity INTEGER DEFAULT 1,
      packed INTEGER DEFAULT 0,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS route_notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      trip_id INTEGER NOT NULL,
      day_number INTEGER,
      location TEXT,
      description TEXT,
      transportation TEXT,
      accommodation TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS budget_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      trip_id INTEGER NOT NULL,
      category TEXT NOT NULL,
      description TEXT,
      estimated_amount REAL DEFAULT 0,
      actual_amount REAL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  initData();
  saveDatabase();
}

function scheduleSave() {
  needsSave = true;
  if (saveTimer) return;
  saveTimer = setTimeout(() => {
    saveTimer = null;
    if (needsSave) {
      saveDatabase();
      needsSave = false;
    }
  }, 500);
}

function saveDatabase() {
  try {
    const data = db.export();
    const buffer = Buffer.from(data);
    const dbPath = path.join(__dirname, '..', 'travel.db');
    fs.writeFileSync(dbPath, buffer);
  } catch (e) {
    console.error('Failed to save database:', e.message);
  }
}

function query(sql, params) {
  const stmt = db.prepare(sql);
  if (params && params.length > 0) {
    stmt.bind(params);
  }
  const results = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject());
  }
  stmt.free();
  return results;
}

function run(sql, params) {
  if (params && params.length > 0) {
    db.run(sql, params);
  } else {
    db.run(sql);
  }
  scheduleSave();
}

function getLastInsertId() {
  const result = query('SELECT last_insert_rowid() as id');
  if (result.length > 0 && result[0].id !== undefined) {
    return result[0].id;
  }
  return null;
}

function initData() {
  const categoryCount = query('SELECT COUNT(*) as count FROM categories');
  if (categoryCount[0].count === 0) {
    const categories = [
      { name: '证件资料', icon: '📋' },
      { name: '电子产品', icon: '📱' },
      { name: '服装鞋帽', icon: '👕' },
      { name: '洗漱用品', icon: '🧴' },
      { name: '药品保健', icon: '💊' },
      { name: '食品饮料', icon: '🍜' },
      { name: '其他', icon: '📦' }
    ];
    categories.forEach(cat => {
      run('INSERT INTO categories (name, icon) VALUES (?, ?)', [cat.name, cat.icon]);
    });
  }

  const tripCount = query('SELECT COUNT(*) as count FROM trips');
  if (tripCount[0].count === 0) {
    run('INSERT INTO trips (name, destination, start_date, end_date, notes) VALUES (?, ?, ?, ?, ?)',
      ['日本东京之旅', '日本东京', '2026-06-15', '2026-06-22', '第一次日本旅行']);
    const tripId = getLastInsertId();

    if (tripId) {
      const items = [
        { category_id: 1, name: '护照', quantity: 1, packed: 1 },
        { category_id: 1, name: '身份证', quantity: 1, packed: 1 },
        { category_id: 1, name: '机票行程单', quantity: 1, packed: 0 },
        { category_id: 2, name: '手机充电器', quantity: 1, packed: 0 },
        { category_id: 2, name: '充电宝', quantity: 1, packed: 0 },
        { category_id: 2, name: '转换插头', quantity: 2, packed: 0 },
        { category_id: 3, name: 'T恤', quantity: 5, packed: 0 },
        { category_id: 3, name: '外套', quantity: 1, packed: 0 },
        { category_id: 3, name: '内衣', quantity: 5, packed: 0 },
        { category_id: 4, name: '牙刷', quantity: 1, packed: 0 },
        { category_id: 4, name: '牙膏', quantity: 1, packed: 0 },
        { category_id: 5, name: '感冒药', quantity: 1, packed: 0 },
        { category_id: 5, name: '创可贴', quantity: 10, packed: 0 }
      ];
      items.forEach(item => {
        run('INSERT INTO items (trip_id, category_id, name, quantity, packed) VALUES (?, ?, ?, ?, ?)',
          [tripId, item.category_id, item.name, item.quantity, item.packed]);
      });

      const routes = [
        { day_number: 1, location: '东京成田机场', description: '抵达东京，前往酒店办理入住', transportation: '机场快线', accommodation: '新宿酒店', notes: '注意机场到市区的末班车时间' },
        { day_number: 2, location: '浅草寺 - 秋叶原', description: '上午参观浅草寺，下午逛秋叶原电器街', transportation: '地铁', accommodation: '新宿酒店', notes: '浅草寺早上人少' },
        { day_number: 3, location: '迪士尼乐园', description: '全天游玩东京迪士尼乐园', transportation: 'JR京叶线', accommodation: '新宿酒店', notes: '建议提前购买门票' }
      ];
      routes.forEach(route => {
        run('INSERT INTO route_notes (trip_id, day_number, location, description, transportation, accommodation, notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [tripId, route.day_number, route.location, route.description, route.transportation, route.accommodation, route.notes]);
      });

      const budgets = [
        { category: '交通', description: '往返机票', estimated_amount: 4000, actual_amount: 3800 },
        { category: '住宿', description: '酒店7晚', estimated_amount: 3500, actual_amount: 0 },
        { category: '餐饮', description: '每日餐饮', estimated_amount: 2000, actual_amount: 0 },
        { category: '门票', description: '景点门票', estimated_amount: 800, actual_amount: 0 },
        { category: '购物', description: '纪念品购物', estimated_amount: 1500, actual_amount: 0 },
        { category: '其他', description: '应急备用', estimated_amount: 500, actual_amount: 0 }
      ];
      budgets.forEach(budget => {
        run('INSERT INTO budget_items (trip_id, category, description, estimated_amount, actual_amount) VALUES (?, ?, ?, ?, ?)',
          [tripId, budget.category, budget.description, budget.estimated_amount, budget.actual_amount]);
      });
    }
  }
}

module.exports = {
  initDatabase,
  query,
  run,
  getLastInsertId
};
