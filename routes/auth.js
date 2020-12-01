const path = require('path');
const express = require('express');
const { body } = require('express-validator');
const bcrypt = require('bcrypt');

const authController = require('../controllers/auth');
const User = require('../models/user');

const router = express.Router();

router.get('/login', authController.getLogin);
router.get('/signup', authController.getSignup);
router.post(
  '/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom(async (value, { req }) => {
        try {
          const user = await User.findOne({ email: value });
          if (user) {
            return Promise.reject('This email address is already in use.');
          }
        } catch (error) {
          console.error(error);
        }
      })
      .normalizeEmail(),
    body('password', 'Password must be at least 8 characters and it must contain at least one number or special character')
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, 'i')
      .trim(),
    body('confirmPassword')
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Passwords do not match.');
        }
        return true;
      })
      .trim(),
  ],
  authController.postSignup
);
router.post(
  '/login',
  [
    body('email').isEmail().custom(async (value, { req }) => {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        throw new Error('Check your inputs and try again!')
      }
      return true;
    }).normalizeEmail(),
    body('password').custom(async (value, { req }) => {
      const user = await User.findOne({ email: req.body.email });
      const isCorrect = await bcrypt.compare(value, user.password);
      if (!isCorrect) {
        throw new Error('Check your inputs and try again!')
      }
      return true;
    }).trim()
  ],
  authController.postLogin
);
router.post('/logout', authController.postLogout);
router.get('/dashboard', authController.getDashboard);
router.get('/:id/edit', authController.getEditAccount);
router.post('/:id/edit', [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email.')
    .normalizeEmail(),
  body('password', 'Password must be at least 8 characters and it must contain at least one number, special character, and upper case')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, 'i')
    .trim(),
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match.');
      }
      return true;
    })
    .trim(),
], authController.postEditAccount);
router.get('/users', authController.getUsers);
router.get('/user/:id/add-to-friends', authController.addToFriends)

module.exports = router;
