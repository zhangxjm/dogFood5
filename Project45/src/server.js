const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { initDatabase, query, run, getLastInsertId } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/api/trips', (req, res) => {
  try {
    const trips = query('SELECT * FROM trips ORDER BY created_at DESC');
    res.json(trips);
  } catch (err) {
    console.error('GET /api/trips error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/trips/:id', (req, res) => {
  try {
    const trip = query('SELECT * FROM trips WHERE id = ?', [req.params.id]);
    if (trip.length === 0) return res.status(404).json({ error: 'Trip not found' });
    res.json(trip[0]);
  } catch (err) {
    console.error('GET /api/trips/:id error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/trips', (req, res) => {
  try {
    const { name, destination, start_date, end_date, notes } = req.body;
    if (!name) return res.status(400).json({ error: 'Trip name is required' });
    run('INSERT INTO trips (name, destination, start_date, end_date, notes) VALUES (?, ?, ?, ?, ?)',
      [name, destination || '', start_date || '', end_date || '', notes || '']);
    const id = getLastInsertId();
    const trip = query('SELECT * FROM trips WHERE id = ?', [id]);
    res.status(201).json(trip[0] || { id, name, destination, start_date, end_date, notes });
  } catch (err) {
    console.error('POST /api/trips error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/trips/:id', (req, res) => {
  try {
    const { name, destination, start_date, end_date, notes } = req.body;
    run('UPDATE trips SET name = ?, destination = ?, start_date = ?, end_date = ?, notes = ? WHERE id = ?',
      [name, destination || '', start_date || '', end_date || '', notes || '', req.params.id]);
    const trip = query('SELECT * FROM trips WHERE id = ?', [req.params.id]);
    if (trip.length === 0) return res.status(404).json({ error: 'Trip not found' });
    res.json(trip[0]);
  } catch (err) {
    console.error('PUT /api/trips/:id error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/trips/:id', (req, res) => {
  try {
    run('DELETE FROM items WHERE trip_id = ?', [req.params.id]);
    run('DELETE FROM route_notes WHERE trip_id = ?', [req.params.id]);
    run('DELETE FROM budget_items WHERE trip_id = ?', [req.params.id]);
    run('DELETE FROM trips WHERE id = ?', [req.params.id]);
    res.json({ message: 'Trip deleted successfully' });
  } catch (err) {
    console.error('DELETE /api/trips/:id error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/categories', (req, res) => {
  try {
    const categories = query('SELECT * FROM categories ORDER BY id');
    res.json(categories);
  } catch (err) {
    console.error('GET /api/categories error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/trips/:tripId/items', (req, res) => {
  try {
    const items = query(`
      SELECT items.*, categories.name as category_name, categories.icon as category_icon
      FROM items LEFT JOIN categories ON items.category_id = categories.id
      WHERE items.trip_id = ? ORDER BY items.category_id, items.id
    `, [req.params.tripId]);
    res.json(items);
  } catch (err) {
    console.error('GET items error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/trips/:tripId/items', (req, res) => {
  try {
    const { category_id, name, quantity, notes } = req.body;
    if (!name) return res.status(400).json({ error: 'Item name is required' });
    run('INSERT INTO items (trip_id, category_id, name, quantity, notes) VALUES (?, ?, ?, ?, ?)',
      [req.params.tripId, category_id || null, name, quantity || 1, notes || '']);
    const id = getLastInsertId();
    const item = query(`
      SELECT items.*, categories.name as category_name, categories.icon as category_icon
      FROM items LEFT JOIN categories ON items.category_id = categories.id
      WHERE items.id = ?
    `, [id]);
    res.status(201).json(item[0] || { id, trip_id: req.params.tripId, name, quantity: quantity || 1, packed: 0 });
  } catch (err) {
    console.error('POST items error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/items/:id', (req, res) => {
  try {
    const { category_id, name, quantity, packed, notes } = req.body;
    run('UPDATE items SET category_id = ?, name = ?, quantity = ?, packed = ?, notes = ? WHERE id = ?',
      [category_id || null, name, quantity, packed || 0, notes || '', req.params.id]);
    const item = query(`
      SELECT items.*, categories.name as category_name, categories.icon as category_icon
      FROM items LEFT JOIN categories ON items.category_id = categories.id
      WHERE items.id = ?
    `, [req.params.id]);
    if (item.length === 0) return res.status(404).json({ error: 'Item not found' });
    res.json(item[0]);
  } catch (err) {
    console.error('PUT /api/items/:id error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/items/:id/toggle', (req, res) => {
  try {
    const item = query('SELECT * FROM items WHERE id = ?', [req.params.id]);
    if (item.length === 0) return res.status(404).json({ error: 'Item not found' });
    const newPacked = item[0].packed ? 0 : 1;
    run('UPDATE items SET packed = ? WHERE id = ?', [newPacked, req.params.id]);
    res.json({ packed: newPacked });
  } catch (err) {
    console.error('PUT /api/items/:id/toggle error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/items/:id', (req, res) => {
  try {
    run('DELETE FROM items WHERE id = ?', [req.params.id]);
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    console.error('DELETE /api/items/:id error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/trips/:tripId/routes', (req, res) => {
  try {
    const routes = query('SELECT * FROM route_notes WHERE trip_id = ? ORDER BY day_number, id', [req.params.tripId]);
    res.json(routes);
  } catch (err) {
    console.error('GET routes error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/trips/:tripId/routes', (req, res) => {
  try {
    const { day_number, location, description, transportation, accommodation, notes } = req.body;
    run('INSERT INTO route_notes (trip_id, day_number, location, description, transportation, accommodation, notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [req.params.tripId, day_number || 1, location || '', description || '', transportation || '', accommodation || '', notes || '']);
    const id = getLastInsertId();
    const route = query('SELECT * FROM route_notes WHERE id = ?', [id]);
    res.status(201).json(route[0] || { id, trip_id: req.params.tripId, day_number: day_number || 1, location: location || '' });
  } catch (err) {
    console.error('POST routes error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/routes/:id', (req, res) => {
  try {
    const { day_number, location, description, transportation, accommodation, notes } = req.body;
    run('UPDATE route_notes SET day_number = ?, location = ?, description = ?, transportation = ?, accommodation = ?, notes = ? WHERE id = ?',
      [day_number || 1, location || '', description || '', transportation || '', accommodation || '', notes || '', req.params.id]);
    const route = query('SELECT * FROM route_notes WHERE id = ?', [req.params.id]);
    if (route.length === 0) return res.status(404).json({ error: 'Route not found' });
    res.json(route[0]);
  } catch (err) {
    console.error('PUT /api/routes/:id error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/routes/:id', (req, res) => {
  try {
    run('DELETE FROM route_notes WHERE id = ?', [req.params.id]);
    res.json({ message: 'Route note deleted successfully' });
  } catch (err) {
    console.error('DELETE /api/routes/:id error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/trips/:tripId/budget', (req, res) => {
  try {
    const budget = query('SELECT * FROM budget_items WHERE trip_id = ? ORDER BY id', [req.params.tripId]);
    res.json(budget);
  } catch (err) {
    console.error('GET budget error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/trips/:tripId/budget/summary', (req, res) => {
  try {
    const budget = query('SELECT * FROM budget_items WHERE trip_id = ?', [req.params.tripId]);
    const totalEstimated = budget.reduce((sum, item) => sum + (item.estimated_amount || 0), 0);
    const totalActual = budget.reduce((sum, item) => sum + (item.actual_amount || 0), 0);
    res.json({
      total_estimated: totalEstimated,
      total_actual: totalActual,
      remaining: totalEstimated - totalActual,
      items: budget
    });
  } catch (err) {
    console.error('GET budget/summary error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/trips/:tripId/budget', (req, res) => {
  try {
    const { category, description, estimated_amount, actual_amount } = req.body;
    if (!category) return res.status(400).json({ error: 'Category is required' });
    run('INSERT INTO budget_items (trip_id, category, description, estimated_amount, actual_amount) VALUES (?, ?, ?, ?, ?)',
      [req.params.tripId, category, description || '', estimated_amount || 0, actual_amount || 0]);
    const id = getLastInsertId();
    const budget = query('SELECT * FROM budget_items WHERE id = ?', [id]);
    res.status(201).json(budget[0] || { id, trip_id: req.params.tripId, category, estimated_amount: estimated_amount || 0, actual_amount: actual_amount || 0 });
  } catch (err) {
    console.error('POST budget error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/budget/:id', (req, res) => {
  try {
    const { category, description, estimated_amount, actual_amount } = req.body;
    run('UPDATE budget_items SET category = ?, description = ?, estimated_amount = ?, actual_amount = ? WHERE id = ?',
      [category, description || '', estimated_amount || 0, actual_amount || 0, req.params.id]);
    const budget = query('SELECT * FROM budget_items WHERE id = ?', [req.params.id]);
    if (budget.length === 0) return res.status(404).json({ error: 'Budget item not found' });
    res.json(budget[0]);
  } catch (err) {
    console.error('PUT /api/budget/:id error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/budget/:id', (req, res) => {
  try {
    run('DELETE FROM budget_items WHERE id = ?', [req.params.id]);
    res.json({ message: 'Budget item deleted successfully' });
  } catch (err) {
    console.error('DELETE /api/budget/:id error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

async function startServer() {
  await initDatabase();
  app.listen(PORT, () => {
    console.log(`Travel Planner Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);
