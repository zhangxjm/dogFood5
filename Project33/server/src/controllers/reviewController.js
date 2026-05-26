const { all, get, run } = require('../database');

const reviewController = {
  async getAll(ctx) {
    const { service_id, user_id } = ctx.query;
    let sql = `
      SELECT r.*, s.name as service_name, u.name as user_name
      FROM reviews r
      LEFT JOIN services s ON r.service_id = s.id
      LEFT JOIN users u ON r.user_id = u.id
      WHERE 1=1
    `;
    const params = [];
    if (service_id) {
      sql += ' AND r.service_id = ?';
      params.push(service_id);
    }
    if (user_id) {
      sql += ' AND r.user_id = ?';
      params.push(user_id);
    }
    sql += ' ORDER BY r.created_at DESC';
    const reviews = await all(sql, params);
    ctx.body = { code: 0, data: reviews };
  },

  async getByAppointmentId(ctx) {
    const { appointment_id } = ctx.params;
    const review = await get(`
      SELECT r.*, s.name as service_name, u.name as user_name
      FROM reviews r
      LEFT JOIN services s ON r.service_id = s.id
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.appointment_id = ?
    `, [appointment_id]);
    if (!review) {
      ctx.body = { code: 0, data: null };
      return;
    }
    ctx.body = { code: 0, data: review };
  },

  async create(ctx) {
    const { appointment_id, service_id, user_id, rating, content, images } = ctx.request.body;
    if (!appointment_id || !service_id || !user_id || !rating) {
      ctx.status = 400;
      ctx.body = { code: 1, message: 'Missing required fields' };
      return;
    }
    const appointment = await get('SELECT * FROM appointments WHERE id = ? AND status = ?', [appointment_id, 'completed']);
    if (!appointment) {
      ctx.status = 400;
      ctx.body = { code: 1, message: 'Cannot review an uncompleted appointment' };
      return;
    }
    const existingReview = await get('SELECT * FROM reviews WHERE appointment_id = ?', [appointment_id]);
    if (existingReview) {
      ctx.status = 400;
      ctx.body = { code: 1, message: 'Review already exists for this appointment' };
      return;
    }
    await run(
      'INSERT INTO reviews (appointment_id, service_id, user_id, rating, content, images) VALUES (?, ?, ?, ?, ?, ?)',
      [appointment_id, service_id, user_id, rating, content || '', images || '']
    );
    const review = await get('SELECT * FROM reviews WHERE appointment_id = ?', [appointment_id]);
    ctx.body = { code: 0, data: review, message: 'Review created successfully' };
  }
};

module.exports = reviewController;
