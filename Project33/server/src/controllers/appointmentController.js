const { all, get, run } = require('../database');

const appointmentController = {
  async getAll(ctx) {
    const { status, user_id } = ctx.query;
    let sql = `
      SELECT a.*, s.name as service_name, s.price as service_price, s.duration as service_duration,
             u.name as user_name, u.phone as user_phone
      FROM appointments a
      LEFT JOIN services s ON a.service_id = s.id
      LEFT JOIN users u ON a.user_id = u.id
      WHERE 1=1
    `;
    const params = [];
    if (status) {
      sql += ' AND a.status = ?';
      params.push(status);
    }
    if (user_id) {
      sql += ' AND a.user_id = ?';
      params.push(user_id);
    }
    sql += ' ORDER BY a.created_at DESC';
    const appointments = await all(sql, params);
    ctx.body = { code: 0, data: appointments };
  },

  async getById(ctx) {
    const { id } = ctx.params;
    const appointment = await get(`
      SELECT a.*, s.name as service_name, s.price as service_price, s.duration as service_duration,
             s.description as service_description, u.name as user_name, u.phone as user_phone
      FROM appointments a
      LEFT JOIN services s ON a.service_id = s.id
      LEFT JOIN users u ON a.user_id = u.id
      WHERE a.id = ?
    `, [id]);
    if (!appointment) {
      ctx.status = 404;
      ctx.body = { code: 1, message: 'Appointment not found' };
      return;
    }
    ctx.body = { code: 0, data: appointment };
  },

  async create(ctx) {
    const { user_name, phone, service_id, appointment_date, appointment_time, address, remark } = ctx.request.body;
    if (!user_name || !phone || !service_id || !appointment_date || !appointment_time || !address) {
      ctx.status = 400;
      ctx.body = { code: 1, message: 'Missing required fields' };
      return;
    }
    const service = await get('SELECT * FROM services WHERE id = ?', [service_id]);
    if (!service) {
      ctx.status = 404;
      ctx.body = { code: 1, message: 'Service not found' };
      return;
    }
    let user = await get('SELECT * FROM users WHERE phone = ?', [phone]);
    if (!user) {
      const result = await run('INSERT INTO users (name, phone, address) VALUES (?, ?, ?)', [user_name, phone, address || '']);
      user = await get('SELECT * FROM users WHERE id = ?', [result.lastID]);
    } else {
      await run('UPDATE users SET name = ?, address = ? WHERE id = ?', [user_name, address || user.address, user.id]);
      user = await get('SELECT * FROM users WHERE id = ?', [user.id]);
    }
    const result = await run(
      'INSERT INTO appointments (user_id, service_id, appointment_date, appointment_time, address, phone, remark) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [user.id, service_id, appointment_date, appointment_time, address, phone, remark || '']
    );
    const appointment = await get('SELECT * FROM appointments WHERE id = ?', [result.lastID]);
    ctx.body = { code: 0, data: appointment, message: 'Appointment created successfully' };
  },

  async update(ctx) {
    const { id } = ctx.params;
    const { appointment_date, appointment_time, address, phone, status, remark } = ctx.request.body;
    const fields = [];
    const values = [];
    if (appointment_date !== undefined) { fields.push('appointment_date = ?'); values.push(appointment_date); }
    if (appointment_time !== undefined) { fields.push('appointment_time = ?'); values.push(appointment_time); }
    if (address !== undefined) { fields.push('address = ?'); values.push(address); }
    if (phone !== undefined) { fields.push('phone = ?'); values.push(phone); }
    if (status !== undefined) { fields.push('status = ?'); values.push(status); }
    if (remark !== undefined) { fields.push('remark = ?'); values.push(remark); }
    fields.push("updated_at = datetime('now', 'localtime')");
    values.push(id);
    await run(`UPDATE appointments SET ${fields.join(', ')} WHERE id = ?`, values);
    const appointment = await get('SELECT * FROM appointments WHERE id = ?', [id]);
    ctx.body = { code: 0, data: appointment, message: 'Appointment updated successfully' };
  },

  async complete(ctx) {
    const { id } = ctx.params;
    const { actual_start_time, actual_end_time, service_content } = ctx.request.body;
    const appointment = await get('SELECT * FROM appointments WHERE id = ?', [id]);
    if (!appointment) {
      ctx.status = 404;
      ctx.body = { code: 1, message: 'Appointment not found' };
      return;
    }
    await run("UPDATE appointments SET status = 'completed', updated_at = datetime('now', 'localtime') WHERE id = ?", [id]);
    const existingRecord = await get('SELECT * FROM service_records WHERE appointment_id = ?', [id]);
    if (existingRecord) {
      await run(
        'UPDATE service_records SET actual_start_time = ?, actual_end_time = ?, service_content = ? WHERE appointment_id = ?',
        [actual_start_time || null, actual_end_time || null, service_content || '', id]
      );
    } else {
      await run(
        'INSERT INTO service_records (appointment_id, service_id, user_id, actual_start_time, actual_end_time, service_content) VALUES (?, ?, ?, ?, ?, ?)',
        [id, appointment.service_id, appointment.user_id, actual_start_time || null, actual_end_time || null, service_content || '']
      );
    }
    ctx.body = { code: 0, message: 'Service completed successfully' };
  },

  async remove(ctx) {
    const { id } = ctx.params;
    await run('DELETE FROM reviews WHERE appointment_id = ?', [id]);
    await run('DELETE FROM service_records WHERE appointment_id = ?', [id]);
    await run('DELETE FROM appointments WHERE id = ?', [id]);
    ctx.body = { code: 0, message: 'Appointment deleted successfully' };
  }
};

module.exports = appointmentController;
