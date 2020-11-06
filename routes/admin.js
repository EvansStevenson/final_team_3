
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');

router.get('/foods', adminController.getfoods);
router.get('/edit-food', adminController.getEditFood);

module.exports = router;