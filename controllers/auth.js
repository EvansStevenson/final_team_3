const User = require('../models/user');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

exports.getLogin = (req, res, next) => {
  res.render('./auth/login', {
    title: 'Login',
    path: '/login',
    errorMessage: null,
    error: null,
    submitAdmin: false,
    oldInput: {
      email: '',
      password: '',
      csrf: "code" //Added so that page would load without errors. This will eventually mean somehting
    }
  });
};

exports.postLogin = async (req, res, next) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email: email });
    //console.log(user);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).render('auth/login', {
        title: 'Login',
        path: '/login',
        errorMessage: errors.array(),
        error: errors.array()[0].msg,
        submitAdmin: false,
        oldInput: {
          email: req.body.email,
          password: req.body.password,
        }
      });
    }
    if (!user) {
      return res.status(422).render('auth/login', {
        title: 'Login',
        path: '/login',
        errorMessage: errors.array(),
        error: errors.array()[0].msg,
        submitAdmin: false,
        oldInput: {
          email: req.body.email,
          password: req.body.password,
        }
      });
    }
    req.session.isLoggedIn = true;
    req.session.user = user;

    await req.session.save();
    //console.log(req.session.user);
    res.redirect('/');
  } catch (error) {
    console.error(error);
  }
};

exports.postLogout = async (req, res, next) => {
  try {
    console.log(req.user);
    await req.session.destroy();
    res.redirect('/');
  } catch (error) {
    console.error(error);
  }
};

exports.getSignup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('/auth/signup', {
      title: 'Signup',
      path: '/signup',
      errorMessage: errors.array(),
      error: errors.array()[0].msg,
      submitAdmin: 'false',
      oldInput: {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword
      }
    })
  }
  res.render('auth/signup', {
    title: 'Signup',
    path: '/signup',
    errorMessage: null,
    error: null,
    submitAdmin: false,
    oldInput: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  })
}

exports.postSignup = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).render('auth/signup', {
        title: 'Signup',
        path: '/signup',
        errorMessage: errors.array(),
        error: errors.array()[0].msg,
        submitAdmin: false,
        oldInput: {
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          confirmPassword: req.body.confirmPassword
        }
      })
    }
    const hash = await bcrypt.hash(password, 12);
    const user = new User({ ...req.body, password: hash, level: 2 });
    await user.save();
    res.redirect('/auth/login');
  } catch (error) {
    console.error(error);
  }
};
