const { all, get } = require('../database');

const recordController = {
  async getAll(ctx) {
    const { user_id, service_id } = ctx.query;
    let sql = `
      SELECT sr.*, s.name as service_name, u.name as user_name, u.phone as user_phone,
             a.appointment_date, a.appointment_time, a.address
      FROM service_records sr
      LEFT JOIN services s ON sr.service_id = s.id
      LEFT JOIN users u ON sr.user_id = u.id
      LEFT JOIN appointments a ON sr.appointment_id = a.id
      WHERE 1=1
    `;
    const params = [];
    if (user_id) {
      sql += ' AND sr.user_id = ?';
      params.push(user_id);
    }
    if (service_id) {
      sql += ' AND sr.service_id = ?';
      params.push(service_id);
    }
    sql += ' ORDER BY sr.created_at DESC';
    const records = await all(sql, params);
    ctx.body = { code: 0, data: records };
  },

  async getById(ctx) {
    const { id } = ctx.params;
    const record = await get(`
      SELECT sr.*, s.name as service_name, u.name as user_name, u.phone as user_phone,
             a.appointment_date, a.appointment_time, a.address
      FROM service_records sr
      LEFT JOIN services s ON sr.service_id = s.id
      LEFT JOIN users u ON sr.user_id = u.id
      LEFT JOIN appointments a ON sr.appointment_id = a.id
      WHERE sr.id = ?
    `, [id]);
    if (!record) {
      ctx.status = 404;
      ctx.body = { code: 1, message: 'Record not found' };
      return;
    }
    ctx.body = { code: 0, data: record };
  }
};

module.exports = recordController;
