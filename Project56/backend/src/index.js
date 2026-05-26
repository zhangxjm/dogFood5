const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('craft_course.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      description TEXT,
      price REAL,
      originalPrice REAL,
      image TEXT,
      category TEXT,
      duration TEXT,
      ageRange TEXT,
      materials TEXT,
      difficulty TEXT,
      teacher TEXT,
      tags TEXT,
      scheduleCount INTEGER DEFAULT 0,
      enrolledCount INTEGER DEFAULT 0,
      rating REAL DEFAULT 5.0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS schedules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      courseId INTEGER,
      courseName TEXT,
      date TEXT,
      startTime TEXT,
      endTime TEXT,
      capacity INTEGER DEFAULT 12,
      enrolled INTEGER DEFAULT 0,
      classroom TEXT,
      teacher TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS enrollments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      courseId INTEGER,
      courseName TEXT,
      courseImage TEXT,
      scheduleId INTEGER,
      scheduleDate TEXT,
      scheduleTime TEXT,
      childName TEXT,
      childAge INTEGER,
      parentName TEXT,
      parentPhone TEXT,
      amount REAL,
      status TEXT DEFAULT 'pending',
      payTime DATETIME,
      createTime DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS attendances (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      enrollmentId INTEGER,
      courseId INTEGER,
      courseName TEXT,
      scheduleId INTEGER,
      scheduleDate TEXT,
      childName TEXT,
      status TEXT DEFAULT 'present',
      checkInTime TEXT,
      remark TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Craft Course API',
      version: '1.0.0',
      description: 'Parent-Child Craft Course Registration System API',
    },
  },
  apis: ['./src/index.js'],
};

const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.get('/api/courses', (req, res) => {
  const { category } = req.query;
  let sql = 'SELECT * FROM courses';
  let params = [];
  if (category && category !== '全部') {
    sql += ' WHERE category = ?';
    params.push(category);
  }
  db.all(sql, params, (err, courses) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    courses.forEach(c => {
      c.materials = c.materials ? JSON.parse(c.materials) : [];
      c.tags = c.tags ? JSON.parse(c.tags) : [];
    });
    res.json(courses);
  });
});

app.get('/api/courses/:id', (req, res) => {
  db.get('SELECT * FROM courses WHERE id = ?', [req.params.id], (err, course) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (course) {
      course.materials = course.materials ? JSON.parse(course.materials) : [];
      course.tags = course.tags ? JSON.parse(course.tags) : [];
      db.all('SELECT * FROM schedules WHERE courseId = ?', [req.params.id], (err, schedules) => {
        course.schedules = schedules || [];
        res.json(course);
      });
    } else {
      res.json({});
    }
  });
});

app.post('/api/courses', (req, res) => {
  const { name, description, price, originalPrice, image, category, duration, ageRange, materials, difficulty, teacher, tags } = req.body;
  const stmt = db.prepare(`
    INSERT INTO courses (name, description, price, originalPrice, image, category, duration, ageRange, materials, difficulty, teacher, tags)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(name, description, price, originalPrice, image, category, duration, ageRange, JSON.stringify(materials), difficulty, teacher, JSON.stringify(tags), function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, ...req.body });
  });
});

app.get('/api/schedules', (req, res) => {
  const { courseId } = req.query;
  let sql = 'SELECT * FROM schedules';
  let params = [];
  if (courseId) {
    sql += ' WHERE courseId = ?';
    params.push(courseId);
  }
  db.all(sql, params, (err, schedules) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(schedules);
  });
});

app.get('/api/schedules/:id', (req, res) => {
  db.get('SELECT * FROM schedules WHERE id = ?', [req.params.id], (err, schedule) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(schedule || {});
  });
});

app.post('/api/schedules', (req, res) => {
  const { courseId, courseName, date, startTime, endTime, capacity, classroom, teacher } = req.body;
  const stmt = db.prepare(`
    INSERT INTO schedules (courseId, courseName, date, startTime, endTime, capacity, classroom, teacher)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(courseId, courseName, date, startTime, endTime, capacity, classroom, teacher, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, ...req.body });
  });
});

app.get('/api/enrollments', (req, res) => {
  const { status } = req.query;
  let sql = 'SELECT * FROM enrollments ORDER BY createTime DESC';
  let params = [];
  if (status && status !== 'all') {
    sql = 'SELECT * FROM enrollments WHERE status = ? ORDER BY createTime DESC';
    params.push(status);
  }
  db.all(sql, params, (err, enrollments) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(enrollments);
  });
});

app.get('/api/enrollments/:id', (req, res) => {
  db.get('SELECT * FROM enrollments WHERE id = ?', [req.params.id], (err, enrollment) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(enrollment || {});
  });
});

app.post('/api/enrollments', (req, res) => {
  const { courseId, courseName, courseImage, scheduleId, scheduleDate, scheduleTime, childName, childAge, parentName, parentPhone, amount } = req.body;
  const stmt = db.prepare(`
    INSERT INTO enrollments (courseId, courseName, courseImage, scheduleId, scheduleDate, scheduleTime, childName, childAge, parentName, parentPhone, amount)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(courseId, courseName, courseImage, scheduleId, scheduleDate, scheduleTime, childName, childAge, parentName, parentPhone, amount, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    db.run('UPDATE schedules SET enrolled = enrolled + 1 WHERE id = ?', [scheduleId]);
    res.json({ id: this.lastID, ...req.body, status: 'pending' });
  });
});

app.post('/api/enrollments/:id/pay', (req, res) => {
  db.run('UPDATE enrollments SET status = ?, payTime = CURRENT_TIMESTAMP WHERE id = ?', ['paid', req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    db.get('SELECT * FROM enrollments WHERE id = ?', [req.params.id], (err, enrollment) => {
      res.json(enrollment);
    });
  });
});

app.post('/api/enrollments/:id/cancel', (req, res) => {
  db.run('UPDATE enrollments SET status = ? WHERE id = ?', ['cancelled', req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    db.get('SELECT * FROM enrollments WHERE id = ?', [req.params.id], (err, enrollment) => {
      res.json(enrollment);
    });
  });
});

app.get('/api/attendances', (req, res) => {
  const { enrollmentId } = req.query;
  let sql = 'SELECT * FROM attendances ORDER BY scheduleDate DESC';
  let params = [];
  if (enrollmentId) {
    sql = 'SELECT * FROM attendances WHERE enrollmentId = ? ORDER BY scheduleDate DESC';
    params.push(enrollmentId);
  }
  db.all(sql, params, (err, attendances) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(attendances);
  });
});

app.post('/api/attendances', (req, res) => {
  const { enrollmentId, courseId, courseName, scheduleId, scheduleDate, childName, status, checkInTime, remark } = req.body;
  const stmt = db.prepare(`
    INSERT INTO attendances (enrollmentId, courseId, courseName, scheduleId, scheduleDate, childName, status, checkInTime, remark)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(enrollmentId, courseId, courseName, scheduleId, scheduleDate, childName, status, checkInTime, remark, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, ...req.body });
  });
});

app.post('/api/attendances/checkin', (req, res) => {
  const { enrollmentId, checkInTime } = req.body;
  db.get('SELECT * FROM enrollments WHERE id = ?', [enrollmentId], (err, enrollment) => {
    if (err || !enrollment) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }
    const stmt = db.prepare(`
      INSERT INTO attendances (enrollmentId, courseId, courseName, scheduleId, scheduleDate, childName, status, checkInTime)
      VALUES (?, ?, ?, ?, ?, ?, 'present', ?)
    `);
    stmt.run(enrollmentId, enrollment.courseId, enrollment.courseName, enrollment.scheduleId, enrollment.scheduleDate, enrollment.childName, checkInTime, function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, status: 'present', checkInTime });
    });
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`API docs: http://localhost:${PORT}/api-docs`);
});
