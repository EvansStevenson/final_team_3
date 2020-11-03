const User = require('../models/user');
const bcrypt = require('bcrypt');

exports.getLogin = (req, res, next) => {
  res.render('pages/home', {
    title: 'Test',
  });
};

exports.postLogin = async (req, res, next) => {
  const user = await User.findOne({ email: req.email });
  if (!user) {
    return res.redirect('/login');
  }

  const passwordMatch = bcrypt.compare(req.password, user.password);
};
