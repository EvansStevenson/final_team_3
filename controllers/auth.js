const User = require('../models/user');
const Recipe = require('../models/recipe');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

exports.getLogin = (req, res, next) => {
  res.render('./auth/login', {
    title: 'Login | Gourmeat',
    path: '/login',
    errorMessage: null,
    error: null,
    submitAdmin: false,
    oldInput: {
      email: '',
      password: '',
      csrf: 'code', //Added so that page would load without errors. This will eventually mean somehting
    },
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
        title: 'Login | Gourmeat',
        path: '/login',
        errorMessage: errors.array(),
        error: errors.array()[0].msg,
        submitAdmin: false,
        oldInput: {
          email: req.body.email,
          password: req.body.password,
        },
      });
    }
    if (!user) {
      return res.status(422).render('auth/login', {
        title: 'Login | Gourmeat',
        path: '/login',
        errorMessage: errors.array(),
        error: errors.array()[0].msg,
        submitAdmin: false,
        oldInput: {
          email: req.body.email,
          password: req.body.password,
        },
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
      title: 'Signup | Gourmeat',
      path: '/signup',
      errorMessage: errors.array(),
      error: errors.array()[0].msg,
      submitAdmin: 'false',
      oldInput: {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
      },
      editMode: false,
      user: ''
    });
  }
  res.render('auth/signup', {
    title: 'Signup | Gourmeat',
    path: '/signup',
    errorMessage: null,
    error: null,
    submitAdmin: false,
    oldInput: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    editMode: false,
    user: ''
  });
};

exports.postSignup = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).render('auth/signup', {
        title: 'Signup | Gourmeat',
        path: '/signup',
        errorMessage: errors.array(),
        error: errors.array()[0].msg,
        submitAdmin: false,
        oldInput: {
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          confirmPassword: req.body.confirmPassword,
        },
        editMode: false,
        user: ''
      });
    }
    const hash = await bcrypt.hash(password, 12);
    const user = new User({ ...req.body, password: hash, level: 2 });
    await user.save();
    res.redirect('/auth/login');
  } catch (error) {
    console.error(error);
  }
};

exports.getDashboard = async (req, res, next) => {
  try {
    const addedRecipes = req.user.addedRecipes;
    const recipes = [];
    await Promise.all(
      addedRecipes.map(async item => {
        const recipe = await Recipe.findOne({ _id: item });
        recipes.push(recipe);
      })
    );
    res.render('dashboard', {
      title: 'Dashboard | Gourmeat',
      path: '/auth/dashboard',
      recipes: recipes,
      user: req.user,
    });
  } catch (error) {
    console.error(error);
  }
};

exports.getEditAccount = async (req, res) => {
  try {
    res.render('auth/signup', {
      title: 'Edit Account | Gourmeat',
      path: '',
      errorMessage: null,
      error: null,
      submitAdmin: false,
      oldInput: {
        name: req.user.name,
        email: req.user.email,
        password: '',
        confirmPassword: '',
      },
      editMode: true,
      user: req.user
    })
  } catch (error) {
    console.log(error);
  }
}

exports.postEditAccount = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).render('auth/signup', {
        title: 'Edit Account | Gourmeat',
        path: '',
        errorMessage: errors.array(),
        error: errors.array()[0].msg,
        submitAdmin: false,
        oldInput: {
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          confirmPassword: req.body.confirmPassword,
        },
        editMode: true,
        user: req.user
      });
    }
    const hash = await bcrypt.hash(password, 12);
    req.body.password = hash;
    const user = await User.findByIdAndUpdate({ _id: req.user._id }, req.body);
    console.log(user);
    res.redirect('/auth/dashboard');
  } catch (error) {
    console.error(error);
  }
}
