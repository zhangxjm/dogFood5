const Router = require('@koa/router');
const serviceController = require('../controllers/serviceController');
const appointmentController = require('../controllers/appointmentController');
const recordController = require('../controllers/recordController');
const reviewController = require('../controllers/reviewController');

const router = new Router({ prefix: '/api' });

router.get('/services', serviceController.getAll);
router.get('/services/:id', serviceController.getById);
router.post('/services', serviceController.create);
router.put('/services/:id', serviceController.update);
router.delete('/services/:id', serviceController.remove);

router.get('/appointments', appointmentController.getAll);
router.get('/appointments/:id', appointmentController.getById);
router.post('/appointments', appointmentController.create);
router.put('/appointments/:id', appointmentController.update);
router.put('/appointments/:id/complete', appointmentController.complete);
router.delete('/appointments/:id', appointmentController.remove);

router.get('/records', recordController.getAll);
router.get('/records/:id', recordController.getById);

router.get('/reviews', reviewController.getAll);
router.get('/reviews/appointment/:appointment_id', reviewController.getByAppointmentId);
router.post('/reviews', reviewController.create);

router.get('/stats', async (ctx) => {
  const { get } = require('../database');
  const totalServices = (await get("SELECT COUNT(*) as count FROM services WHERE status = 'active'")).count;
  const totalAppointments = (await get('SELECT COUNT(*) as count FROM appointments')).count;
  const completedAppointments = (await get("SELECT COUNT(*) as count FROM appointments WHERE status = 'completed'")).count;
  const totalReviews = (await get('SELECT COUNT(*) as count FROM reviews')).count;
  const avgRatingResult = await get('SELECT AVG(rating) as avg FROM reviews');
  const avgRating = avgRatingResult.avg || 0;
  ctx.body = {
    code: 0,
    data: {
      totalServices,
      totalAppointments,
      completedAppointments,
      totalReviews,
      avgRating: Math.round(avgRating * 10) / 10
    }
  };
});

module.exports = router;
