const path = require('path');
const express = require('express');
const { body } = require('express-validator');

const authController = require('../controllers/auth');
const User = require('../models/user');

const router = express.Router();

// router.get('/signup');
router.get('/login', authController.getLogin);
router.post('/signup', [
  body('email').isEmail().withMessage('Please enter a valid email.').custom(async (value, { req }) => {
    try {
      const user = await User.findOne({ email: value });
      if (user) {
        return Promise.reject('This email address is already in use.');
      }
    } catch (error) {
      console.error(error);
    }
  }).normalizeEmail(),
  body('password', 'Check your imputs and try again!').matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i").trim(),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do nnot match.');
    }
    return true;
  }).trim()
], authController.postSignup);
router.post('/login', [
  body('email').isEmail().withMessage('Check your inputs and try again!').normalizeEmail(),
  body('password', 'Check your imputs and try again!').matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i").trim()
], authController.postLogin);
router.post('/logout', authController.postLogout)

module.exports = router;
