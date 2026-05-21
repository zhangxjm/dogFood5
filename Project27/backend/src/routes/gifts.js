const express = require('express');
const router = express.Router();
const giftController = require('../controllers/giftController');

router.get('/', giftController.getAllGifts);
router.get('/stats', giftController.getStats);
router.get('/recipients', giftController.getRecipients);
router.get('/categories', giftController.getCategories);
router.get('/reminders', giftController.getUpcomingReminders);
router.get('/:id', giftController.getGiftById);
router.post('/', giftController.createGift);
router.put('/:id', giftController.updateGift);
router.delete('/:id', giftController.deleteGift);

module.exports = router;
