const { all, get, run } = require('../database');

const serviceController = {
  async getAll(ctx) {
    const { status } = ctx.query;
    let sql = 'SELECT * FROM services WHERE 1=1';
    const params = [];
    if (status) {
      sql += ' AND status = ?';
      params.push(status);
    }
    sql += ' ORDER BY created_at DESC';
    const services = await all(sql, params);
    ctx.body = { code: 0, data: services };
  },

  async getById(ctx) {
    const { id } = ctx.params;
    const service = await get('SELECT * FROM services WHERE id = ?', [id]);
    if (!service) {
      ctx.status = 404;
      ctx.body = { code: 1, message: 'Service not found' };
      return;
    }
    ctx.body = { code: 0, data: service };
  },

  async create(ctx) {
    const { name, description, price, duration, image } = ctx.request.body;
    if (!name || price == null) {
      ctx.status = 400;
      ctx.body = { code: 1, message: 'Name and price are required' };
      return;
    }
    const result = await run(
      'INSERT INTO services (name, description, price, duration, image) VALUES (?, ?, ?, ?, ?)',
      [name, description || '', price, duration || 60, image || '']
    );
    const service = await get('SELECT * FROM services WHERE id = ?', [result.lastID]);
    ctx.body = { code: 0, data: service, message: 'Service created successfully' };
  },

  async update(ctx) {
    const { id } = ctx.params;
    const { name, description, price, duration, image, status } = ctx.request.body;
    const fields = [];
    const values = [];
    if (name !== undefined) { fields.push('name = ?'); values.push(name); }
    if (description !== undefined) { fields.push('description = ?'); values.push(description); }
    if (price !== undefined) { fields.push('price = ?'); values.push(price); }
    if (duration !== undefined) { fields.push('duration = ?'); values.push(duration); }
    if (image !== undefined) { fields.push('image = ?'); values.push(image); }
    if (status !== undefined) { fields.push('status = ?'); values.push(status); }
    fields.push("updated_at = datetime('now', 'localtime')");
    values.push(id);
    await run(`UPDATE services SET ${fields.join(', ')} WHERE id = ?`, values);
    const service = await get('SELECT * FROM services WHERE id = ?', [id]);
    ctx.body = { code: 0, data: service, message: 'Service updated successfully' };
  },

  async remove(ctx) {
    const { id } = ctx.params;
    await run('DELETE FROM reviews WHERE appointment_id IN (SELECT id FROM appointments WHERE service_id = ?)', [id]);
    await run('DELETE FROM service_records WHERE service_id = ?', [id]);
    await run('DELETE FROM appointments WHERE service_id = ?', [id]);
    await run('DELETE FROM services WHERE id = ?', [id]);
    ctx.body = { code: 0, message: 'Service deleted successfully' };
  }
};

module.exports = serviceController;
