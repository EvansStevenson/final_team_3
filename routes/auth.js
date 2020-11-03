const path = require('path');

const express = require('express');
const authController = require('../controllers/auth');

const router = express.Router();

// router.get('/signup');
router.get('/login', authController.getLogin);
// router.post('/signup');
// router.post('/login');

module.exports = router;
