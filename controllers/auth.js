const User = require('../models/user');
const Recipe = require('../models/recipe');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const user = require('../models/user');

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
      user: '',
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
    user: '',
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
        user: '',
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
    const friends = req.user.friends;
    const requestsReceived = [];
    await Promise.all(
      addedRecipes.map(async item => {
        const recipe = await Recipe.findOne({ _id: item });
        recipes.push(recipe);
      })
    );
    // console.log(req.user.friendRequests);
    if (req.user.friendRequests) {
      const requests = req.user.friendRequests;
      await Promise.all(
        requests.map(async x => {
          if (!x.approved) {
            const user = await User.findById(x.requestor);
            requestsReceived.push(user);
          }
        })
      );
    }
    const users = [];
    if (friends.length > 0) {
      await Promise.all(
        friends.map(async item => {
          const user = await User.findById(item);
          users.push(user);
        })
      )
    }
    // console.log(requestsReceived);
    res.render('dashboard', {
      title: req.user.name + "'s Dashboard | Gourmeat",
      path: '/auth/dashboard',
      recipes: recipes,
      user: req.user,
      friends: users,
      requests: requestsReceived,
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
      user: req.user,
    });
  } catch (error) {
    console.log(error);
  }
};

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
        user: req.user,
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
};

exports.getUsers = async (req, res) => {
  const users = await User.find();
  const friends = req.user.friends;
  const requestsSent = req.user.friendRequestsSent;
  const notFriends = users.filter(x => x._id.toHexString() !== req.user._id.toHexString());
  const displayUsers = [];
  for (let i = 0; i < notFriends.length; i++) {
    console.log(notFriends.length)
    if (requestsSent[i]) {
      if (requestsSent[i].user.toHexString() !== notFriends[i]._id.toHexString()) {
        displayUsers.push(notFriends[i]);
      }
    } else {
      displayUsers.push(notFriends[i]);
    }
  }
  res.render('users', {
    title: 'Users',
    path: '',
    users: displayUsers,
  });
};

exports.addToFriends = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    const friendRequest = user.friendRequests;
    friendRequest.push({ requestor: req.user._id, approved: false });
    user.update({ $set: { friendRequests: friendRequest } });
    user.save();
    const sentRequests = req.user.friendRequestsSent;
    sentRequests.push({
      user: user._id,
      confirmed: false,
    });
    await User.updateOne({ _id: req.user._id }, { $set: { friendRequestsSent: sentRequests } });

    res.redirect('/auth/users');
  } catch (error) {
    console.log(error);
  }
};

exports.postAcceptFriend = async (req, res) => {
  try {
    const id = req.params.id;
    const requests = req.user.friendRequests;
    console.log(requests);
    const updatedRequests = [];
    requests.forEach(x => {
      if (id === x.requestor.toHexString()) {
        x.approved = true;
        updatedRequests.push(x);
      } else {
        updatedRequests.push(x);
      }
    })
    const friendsOne = req.user.friends;
    const user = await User.findById(id);
    friendsOne.push(user);
    await User.updateOne({ _id: req.user._id }, { $set: { friendRequests: updatedRequests, friends: friendsOne } });
    const sentRequests = user.friendRequestsSent;
    const updatedSentRequests = [];
    sentRequests.forEach(x => {
      if (req.user._id.toHexString() === x.user.toHexString()) {
        x.confirmed = true;
        updatedSentRequests.push(x);
      } else {
        updatedSentRequests.push(x);
      }
    })
    const friendsTwo = user.friends;
    friendsTwo.push(req.user);
    await User.updateOne({ _id: id }, { $set: { friendRequestsSent: updatedSentRequests, friends: friendsTwo } })
    res.redirect('/auth/dashboard');
  } catch (error) {
    console.log(error);
  }
}