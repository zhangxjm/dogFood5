const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'data.db');
let db = null;

function saveDatabase() {
  if (db) {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);
  }
}

async function init() {
  const SQL = await initSqlJs();
  
  if (fs.existsSync(dbPath)) {
    const fileBuffer = fs.readFileSync(dbPath);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS activities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      location TEXT NOT NULL,
      activity_date TEXT NOT NULL,
      start_time TEXT NOT NULL,
      end_time TEXT NOT NULL,
      max_participants INTEGER DEFAULT 50,
      category TEXT DEFAULT '文娱活动',
      status TEXT DEFAULT 'upcoming',
      created_at TEXT DEFAULT (datetime('now', 'localtime'))
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS participants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      activity_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      gender TEXT DEFAULT 'male',
      age INTEGER,
      phone TEXT,
      id_card TEXT,
      emergency_contact TEXT,
      emergency_phone TEXT,
      health_note TEXT,
      registered_at TEXT DEFAULT (datetime('now', 'localtime'))
    )
  `);

  db.run('CREATE INDEX IF NOT EXISTS idx_participants_activity ON participants(activity_id)');
  
  saveDatabase();
}

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    try {
      const result = db.run(sql, params);
      const lastID = db.exec('SELECT last_insert_rowid() as id')[0].values[0][0];
      saveDatabase();
      resolve({ lastID, changes: result.changes || 0 });
    } catch (err) {
      reject(err);
    }
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    try {
      const results = db.exec(sql, params);
      if (results.length > 0 && results[0].values.length > 0) {
        const columns = results[0].columns;
        const values = results[0].values[0];
        const row = {};
        columns.forEach((col, i) => {
          row[col] = values[i];
        });
        resolve(row);
      } else {
        resolve(null);
      }
    } catch (err) {
      reject(err);
    }
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    try {
      const results = db.exec(sql, params);
      if (results.length > 0) {
        const columns = results[0].columns;
        const rows = results[0].values.map(values => {
          const row = {};
          columns.forEach((col, i) => {
            row[col] = values[i];
          });
          return row;
        });
        resolve(rows);
      } else {
        resolve([]);
      }
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = { init, run, get, all, saveDatabase };
