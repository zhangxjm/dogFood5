const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const path = require('path');
const { init, run, get, all } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
  if (req.query && '_method' in req.query) {
    return req.query._method;
  }
}));

app.use((req, res, next) => {
  res.locals.currentYear = new Date().getFullYear();
  res.locals.pageTitle = '';
  res.locals.activeNav = '';
  next();
});

app.get('/', async (req, res) => {
  try {
    const activities = await all(`
      SELECT a.*, COUNT(p.id) as registered_count
      FROM activities a
      LEFT JOIN participants p ON a.id = p.activity_id
      GROUP BY a.id
      ORDER BY 
        CASE a.status 
          WHEN 'upcoming' THEN 1 
          WHEN 'ongoing' THEN 2 
          WHEN 'completed' THEN 3 
          ELSE 4 
        END,
        a.activity_date DESC,
        a.created_at DESC
    `);

    const stats = await get(`
      SELECT 
        COUNT(DISTINCT a.id) as total_activities,
        COUNT(p.id) as total_registrations,
        COUNT(DISTINCT p.id) as total_participants,
        SUM(CASE WHEN a.status = 'upcoming' THEN 1 ELSE 0 END) as upcoming_count,
        SUM(CASE WHEN a.status = 'ongoing' THEN 1 ELSE 0 END) as ongoing_count,
        SUM(CASE WHEN a.status = 'completed' THEN 1 ELSE 0 END) as completed_count
      FROM activities a
      LEFT JOIN participants p ON a.id = p.activity_id
    `);

    res.render('index', { activities, stats });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/activities', async (req, res) => {
  try {
    const { status, category } = req.query;
    let query = `
      SELECT a.*, COUNT(p.id) as registered_count
      FROM activities a
      LEFT JOIN participants p ON a.id = p.activity_id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      query += ' AND a.status = ?';
      params.push(status);
    }
    if (category) {
      query += ' AND a.category = ?';
      params.push(category);
    }

    query += `
      GROUP BY a.id
      ORDER BY 
        CASE a.status 
          WHEN 'upcoming' THEN 1 
          WHEN 'ongoing' THEN 2 
          WHEN 'completed' THEN 3 
          ELSE 4 
        END,
        a.activity_date DESC
    `;

    const activities = await all(query, params);
    res.render('activities/list', { activities, filters: { status, category } });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/activities/new', (req, res) => {
  res.render('activities/new', { activity: null, errors: {} });
});

app.post('/activities', async (req, res) => {
  try {
    const { title, description, location, activity_date, start_time, end_time, max_participants, category } = req.body;
    const errors = {};

    if (!title) errors.title = '活动标题不能为空';
    if (!location) errors.location = '活动地点不能为空';
    if (!activity_date) errors.activity_date = '活动日期不能为空';
    if (!start_time) errors.start_time = '开始时间不能为空';
    if (!end_time) errors.end_time = '结束时间不能为空';

    if (Object.keys(errors).length > 0) {
      return res.render('activities/new', { activity: req.body, errors });
    }

    const result = await run(`
      INSERT INTO activities (title, description, location, activity_date, start_time, end_time, max_participants, category)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      title, description || '', location, activity_date, 
      start_time, end_time, 
      max_participants ? parseInt(max_participants) : 50, 
      category || '文娱活动'
    ]);

    res.redirect('/activities/' + result.lastID);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/activities/:id', async (req, res) => {
  try {
    const activity = await get(`
      SELECT a.*, COUNT(p.id) as registered_count
      FROM activities a
      LEFT JOIN participants p ON a.id = p.activity_id
      WHERE a.id = ?
      GROUP BY a.id
    `, [req.params.id]);

    if (!activity) {
      return res.status(404).render('404');
    }

    const participants = await all('SELECT * FROM participants WHERE activity_id = ? ORDER BY registered_at DESC', [req.params.id]);
    res.render('activities/detail', { activity, participants });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/activities/:id/edit', async (req, res) => {
  try {
    const activity = await get('SELECT * FROM activities WHERE id = ?', [req.params.id]);
    if (!activity) {
      return res.status(404).render('404');
    }
    res.render('activities/edit', { activity, errors: {} });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.put('/activities/:id', async (req, res) => {
  try {
    const { title, description, location, activity_date, start_time, end_time, max_participants, category, status } = req.body;
    const errors = {};

    if (!title) errors.title = '活动标题不能为空';
    if (!location) errors.location = '活动地点不能为空';

    if (Object.keys(errors).length > 0) {
      return res.render('activities/edit', { activity: { ...req.body, id: req.params.id }, errors });
    }

    await run(`
      UPDATE activities 
      SET title = ?, description = ?, location = ?, activity_date = ?, 
          start_time = ?, end_time = ?, max_participants = ?, category = ?, status = ?
      WHERE id = ?
    `, [
      title, description || '', location, activity_date,
      start_time, end_time,
      max_participants ? parseInt(max_participants) : 50,
      category || '文娱活动',
      status || 'upcoming',
      req.params.id
    ]);

    res.redirect('/activities/' + req.params.id);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.delete('/activities/:id/participants/:pid', async (req, res) => {
  try {
    await run('DELETE FROM participants WHERE id = ? AND activity_id = ?', [req.params.pid, req.params.id]);
    res.redirect('/activities/' + req.params.id);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.delete('/activities/:id', async (req, res) => {
  try {
    await run('DELETE FROM activities WHERE id = ?', [req.params.id]);
    res.redirect('/activities');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/activities/:id/register', async (req, res) => {
  try {
    const activity = await get('SELECT * FROM activities WHERE id = ?', [req.params.id]);
    if (!activity) {
      return res.status(404).render('404');
    }

    const countResult = await get('SELECT COUNT(*) as count FROM participants WHERE activity_id = ?', [req.params.id]);
    const registered = countResult.count;
    
    if (registered >= activity.max_participants) {
      return res.redirect('/activities/' + req.params.id + '?error=full');
    }

    const { name, gender, age, phone, id_card, emergency_contact, emergency_phone, health_note } = req.body;
    const errors = {};

    if (!name) errors.name = '姓名不能为空';
    if (!phone) errors.phone = '联系电话不能为空';

    if (Object.keys(errors).length > 0) {
      const participants = await all('SELECT * FROM participants WHERE activity_id = ? ORDER BY registered_at DESC', [req.params.id]);
      return res.render('activities/detail', { 
        activity: { ...activity, registered_count: registered },
        participants,
        registerErrors: errors,
        registerData: req.body
      });
    }

    await run(`
      INSERT INTO participants (activity_id, name, gender, age, phone, id_card, emergency_contact, emergency_phone, health_note)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      req.params.id,
      name,
      gender || 'male',
      age ? parseInt(age) : null,
      phone,
      id_card || '',
      emergency_contact || '',
      emergency_phone || '',
      health_note || ''
    ]);

    res.redirect('/activities/' + req.params.id + '?success=registered');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/statistics', async (req, res) => {
  try {
    const overallStats = await get(`
      SELECT 
        COUNT(DISTINCT a.id) as total_activities,
        COUNT(DISTINCT p.id) as total_participants,
        COUNT(p.id) as total_registrations,
        AVG(p.age) as avg_age,
        SUM(CASE WHEN p.gender = 'male' THEN 1 ELSE 0 END) as male_count,
        SUM(CASE WHEN p.gender = 'female' THEN 1 ELSE 0 END) as female_count
      FROM activities a
      LEFT JOIN participants p ON a.id = p.activity_id
    `);

    const categoryStats = await all(`
      SELECT a.category, 
             COUNT(DISTINCT a.id) as activity_count,
             COUNT(p.id) as registration_count
      FROM activities a
      LEFT JOIN participants p ON a.id = p.activity_id
      GROUP BY a.category
      ORDER BY activity_count DESC
    `);

    const activityStats = await all(`
      SELECT a.id, a.title, a.max_participants, 
             COUNT(p.id) as registered_count,
             ROUND(COUNT(p.id) * 100.0 / a.max_participants, 1) as fill_rate
      FROM activities a
      LEFT JOIN participants p ON a.id = p.activity_id
      GROUP BY a.id
      ORDER BY registered_count DESC
      LIMIT 10
    `);

    const statusStats = await all(`
      SELECT status, COUNT(*) as count
      FROM activities
      GROUP BY status
    `);

    const genderDist = await all(`
      SELECT gender, COUNT(*) as count
      FROM participants
      GROUP BY gender
    `);

    res.render('statistics', { 
      overallStats, 
      categoryStats, 
      activityStats, 
      statusStats,
      genderDist 
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/participants', async (req, res) => {
  try {
    const { activity_id, search } = req.query;
    let query = `
      SELECT p.*, a.title as activity_title, a.activity_date
      FROM participants p
      JOIN activities a ON p.activity_id = a.id
      WHERE 1=1
    `;
    const params = [];

    if (activity_id) {
      query += ' AND p.activity_id = ?';
      params.push(activity_id);
    }
    if (search) {
      query += ' AND (p.name LIKE ? OR p.phone LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY p.registered_at DESC';

    const participants = await all(query, params);
    const activities = await all('SELECT id, title FROM activities ORDER BY activity_date DESC');

    res.render('participants/list', { participants, activities, filters: { activity_id, search } });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.use((req, res) => {
  res.status(404).render('404');
});

async function startServer() {
  try {
    await init();
    app.listen(PORT, () => {
      console.log('========================================');
      console.log('  Elderly Activity System');
      console.log('  Server running at: http://localhost:' + PORT);
      console.log('========================================');
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
