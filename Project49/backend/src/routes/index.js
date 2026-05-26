const Router = require('koa-router');
const { MoveRequest, Vehicle, MoveRecord, Rating } = require('../models');

const router = new Router({ prefix: '/api' });

router.get('/health', async (ctx) => {
  ctx.body = { status: 'ok', timestamp: new Date().toISOString() };
});

router.get('/vehicles', async (ctx) => {
  const vehicles = await Vehicle.findAll({
    where: { isActive: true },
    order: [['basePrice', 'ASC']]
  });
  ctx.body = { code: 0, data: vehicles, message: 'success' };
});

router.post('/move-requests', async (ctx) => {
  const {
    customerName, phone, moveFrom, moveTo, moveDate,
    floorFrom, floorTo, hasElevator, distance, description
  } = ctx.request.body;

  if (!customerName || !phone || !moveFrom || !moveTo || !moveDate) {
    ctx.status = 400;
    ctx.body = { code: 400, message: 'Missing required fields' };
    return;
  }

  const request = await MoveRequest.create({
    customerName, phone, moveFrom, moveTo, moveDate,
    floorFrom: floorFrom || 1,
    floorTo: floorTo || 1,
    hasElevator: hasElevator || false,
    distance: distance || 0,
    description: description || ''
  });

  ctx.body = { code: 0, data: request, message: 'Created successfully' };
});

router.get('/move-requests', async (ctx) => {
  const { status, page = 1, pageSize = 10 } = ctx.query;
  const offset = (page - 1) * pageSize;
  const where = {};
  if (status) where.status = status;

  const { count, rows } = await MoveRequest.findAndCountAll({
    where,
    order: [['createdAt', 'DESC']],
    limit: parseInt(pageSize),
    offset: parseInt(offset)
  });

  ctx.body = {
    code: 0,
    data: {
      list: rows,
      total: count,
      page: parseInt(page),
      pageSize: parseInt(pageSize)
    },
    message: 'success'
  };
});

router.get('/move-requests/:id', async (ctx) => {
  const request = await MoveRequest.findByPk(ctx.params.id, {
    include: [
      { model: MoveRecord, as: 'records', include: [{ model: Vehicle, as: 'vehicle' }] },
      { model: Rating, as: 'ratings' }
    ]
  });

  if (!request) {
    ctx.status = 404;
    ctx.body = { code: 404, message: 'Not found' };
    return;
  }

  ctx.body = { code: 0, data: request, message: 'success' };
});

router.put('/move-requests/:id', async (ctx) => {
  const request = await MoveRequest.findByPk(ctx.params.id);
  if (!request) {
    ctx.status = 404;
    ctx.body = { code: 404, message: 'Not found' };
    return;
  }

  await request.update(ctx.request.body);
  ctx.body = { code: 0, data: request, message: 'Updated successfully' };
});

router.delete('/move-requests/:id', async (ctx) => {
  const request = await MoveRequest.findByPk(ctx.params.id);
  if (!request) {
    ctx.status = 404;
    ctx.body = { code: 404, message: 'Not found' };
    return;
  }

  await request.destroy();
  ctx.body = { code: 0, message: 'Deleted successfully' };
});

router.post('/move-records', async (ctx) => {
  const {
    requestId, vehicleId, actualStartTime, actualEndTime,
    actualDistance, totalAmount, paymentStatus, remarks
  } = ctx.request.body;

  if (!requestId || !vehicleId || !totalAmount) {
    ctx.status = 400;
    ctx.body = { code: 400, message: 'Missing required fields' };
    return;
  }

  const record = await MoveRecord.create({
    requestId, vehicleId,
    actualStartTime: actualStartTime || new Date(),
    actualEndTime: actualEndTime || new Date(),
    actualDistance: actualDistance || 0,
    totalAmount,
    paymentStatus: paymentStatus || 'unpaid',
    remarks: remarks || ''
  });

  const request = await MoveRequest.findByPk(requestId);
  if (request) {
    await request.update({ status: 'completed' });
  }

  ctx.body = { code: 0, data: record, message: 'Created successfully' };
});

router.get('/move-records', async (ctx) => {
  const { page = 1, pageSize = 10 } = ctx.query;
  const offset = (page - 1) * pageSize;

  const { count, rows } = await MoveRecord.findAndCountAll({
    include: [
      { model: MoveRequest, as: 'request' },
      { model: Vehicle, as: 'vehicle' },
      { model: Rating, as: 'rating' }
    ],
    order: [['createdAt', 'DESC']],
    limit: parseInt(pageSize),
    offset: parseInt(offset)
  });

  ctx.body = {
    code: 0,
    data: {
      list: rows,
      total: count,
      page: parseInt(page),
      pageSize: parseInt(pageSize)
    },
    message: 'success'
  };
});

router.get('/move-records/:id', async (ctx) => {
  const record = await MoveRecord.findByPk(ctx.params.id, {
    include: [
      { model: MoveRequest, as: 'request' },
      { model: Vehicle, as: 'vehicle' },
      { model: Rating, as: 'rating' }
    ]
  });

  if (!record) {
    ctx.status = 404;
    ctx.body = { code: 404, message: 'Not found' };
    return;
  }

  ctx.body = { code: 0, data: record, message: 'success' };
});

router.post('/ratings', async (ctx) => {
  const {
    recordId, requestId, overallRating, serviceRating,
    timelinessRating, careRating, comment, reviewerName
  } = ctx.request.body;

  if (!recordId || !requestId || !overallRating || !serviceRating || !timelinessRating || !careRating) {
    ctx.status = 400;
    ctx.body = { code: 400, message: 'Missing required fields' };
    return;
  }

  const rating = await Rating.create({
    recordId, requestId,
    overallRating, serviceRating, timelinessRating, careRating,
    comment: comment || '',
    reviewerName: reviewerName || ''
  });

  ctx.body = { code: 0, data: rating, message: 'Created successfully' };
});

router.get('/ratings', async (ctx) => {
  const { page = 1, pageSize = 10 } = ctx.query;
  const offset = (page - 1) * pageSize;

  const { count, rows } = await Rating.findAndCountAll({
    include: [
      { model: MoveRecord, as: 'record', include: [{ model: Vehicle, as: 'vehicle' }] },
      { model: MoveRequest, as: 'request' }
    ],
    order: [['createdAt', 'DESC']],
    limit: parseInt(pageSize),
    offset: parseInt(offset)
  });

  ctx.body = {
    code: 0,
    data: {
      list: rows,
      total: count,
      page: parseInt(page),
      pageSize: parseInt(pageSize)
    },
    message: 'success'
  };
});

router.get('/stats', async (ctx) => {
  const totalRequests = await MoveRequest.count();
  const pendingRequests = await MoveRequest.count({ where: { status: 'pending' } });
  const completedRequests = await MoveRequest.count({ where: { status: 'completed' } });
  const totalRecords = await MoveRecord.count();
  const totalRatings = await Rating.count();

  const ratings = await Rating.findAll({
    attributes: ['overallRating', 'serviceRating', 'timelinessRating', 'careRating']
  });

  let avgOverall = 0, avgService = 0, avgTimeliness = 0, avgCare = 0;
  if (ratings.length > 0) {
    avgOverall = ratings.reduce((sum, r) => sum + r.overallRating, 0) / ratings.length;
    avgService = ratings.reduce((sum, r) => sum + r.serviceRating, 0) / ratings.length;
    avgTimeliness = ratings.reduce((sum, r) => sum + r.timelinessRating, 0) / ratings.length;
    avgCare = ratings.reduce((sum, r) => sum + r.careRating, 0) / ratings.length;
  }

  ctx.body = {
    code: 0,
    data: {
      totalRequests,
      pendingRequests,
      completedRequests,
      totalRecords,
      totalRatings,
      avgOverall: parseFloat(avgOverall.toFixed(1)),
      avgService: parseFloat(avgService.toFixed(1)),
      avgTimeliness: parseFloat(avgTimeliness.toFixed(1)),
      avgCare: parseFloat(avgCare.toFixed(1))
    },
    message: 'success'
  };
});

router.get('/vehicles/:id', async (ctx) => {
  const vehicle = await Vehicle.findByPk(ctx.params.id);
  if (!vehicle) {
    ctx.status = 404;
    ctx.body = { code: 404, message: 'Not found' };
    return;
  }
  ctx.body = { code: 0, data: vehicle, message: 'success' };
});

router.put('/vehicles/:id', async (ctx) => {
  const vehicle = await Vehicle.findByPk(ctx.params.id);
  if (!vehicle) {
    ctx.status = 404;
    ctx.body = { code: 404, message: 'Not found' };
    return;
  }
  await vehicle.update(ctx.request.body);
  ctx.body = { code: 0, data: vehicle, message: 'Updated successfully' };
});

router.post('/vehicles', async (ctx) => {
  const { name, size, capacity, pricePerKm, basePrice, floorPrice, description } = ctx.request.body;

  if (!name || !size || !pricePerKm || !basePrice) {
    ctx.status = 400;
    ctx.body = { code: 400, message: 'Missing required fields' };
    return;
  }

  const vehicle = await Vehicle.create({
    name, size,
    capacity: capacity || '',
    pricePerKm, basePrice,
    floorPrice: floorPrice || 0,
    description: description || '',
    isActive: true
  });

  ctx.body = { code: 0, data: vehicle, message: 'Created successfully' };
});

router.delete('/vehicles/:id', async (ctx) => {
  const vehicle = await Vehicle.findByPk(ctx.params.id);
  if (!vehicle) {
    ctx.status = 404;
    ctx.body = { code: 404, message: 'Not found' };
    return;
  }
  await vehicle.update({ isActive: false });
  ctx.body = { code: 0, message: 'Deleted successfully' };
});

module.exports = router;
