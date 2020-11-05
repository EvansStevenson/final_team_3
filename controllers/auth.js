const User = require('../models/user');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

exports.getLogin = (req, res, next) => {
  res.render('pages/home', {
    title: 'Test',
  });
};

exports.postLogin = async (req, res, next) => {
  try {
    console.log('In login');
    const email = 'test@test.com'; // here we are going to use req.body.username
    const password = 'test'; // here we are going to use req.body.password
    const user = await User.findOne({ email: email });
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).render('pages/auth/login', {
        title: 'Login',
      });
    }
    if (!user) {
      return res.status(422).render('pages/auth/login', {
        title: 'Login',
      });
    }
    const correctPassword = await bcrypt.compare(password, user.password);
    if (!correctPassword) {
      return res.status(422).render('pages/auth/login', {
        title: 'Login',
      });
    } else {
      req.session.isLoggedIn = true;
      req.session.user = user;

      await req.session.save();
      res.redirect('/');
    }
  } catch (error) {
    console.error(error);
  }
};

exports.postLogout = async (req, res, next) => {
  try {
    await req.session.destroy();
    res.redirect('/');
  } catch (error) {
    console.error(error);
  }
};

exports.postSignup = async (req, res, next) => {
  try {
    console.log(req.body);
    const name = 'Test'; // req.body.name
    const email = 'test@test.com'; // req.body.username
    const password = 'test'; // req.body.password
    const hash = await bcrypt.hash(password, 12);
    const user = new User({ name: name, email: email, password: hash, level: 1 });
    await user.save();
    res.redirect('/login');
  } catch (error) {
    console.error(error);
  }
};
