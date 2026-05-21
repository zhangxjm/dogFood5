const Router = require('koa-router');
const serviceController = require('../controllers/serviceController');
const appointmentController = require('../controllers/appointmentController');
const reviewController = require('../controllers/reviewController');

const router = new Router({ prefix: '/api' });

router.get('/', async (ctx) => {
  ctx.body = {
    code: 200,
    message: '同城绿植养护服务预约系统 API'
  };
});

router.get('/services', serviceController.getServices);
router.get('/services/:id', serviceController.getService);
router.post('/services', serviceController.createService);
router.put('/services/:id', serviceController.updateService);
router.delete('/services/:id', serviceController.deleteService);

router.get('/appointments', appointmentController.getAppointments);
router.get('/appointments/:id', appointmentController.getAppointment);
router.post('/appointments', appointmentController.createAppointment);
router.put('/appointments/:id', appointmentController.updateAppointment);
router.put('/appointments/:id/status', appointmentController.updateStatus);

router.get('/reviews', reviewController.getReviews);
router.get('/reviews/:id', reviewController.getReview);
router.post('/reviews', reviewController.createReview);
router.delete('/reviews/:id', reviewController.deleteReview);

module.exports = router;
