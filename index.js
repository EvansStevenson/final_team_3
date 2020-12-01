//Here is our index for our final.
const express = require('express');

const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const mongoDBStore = require('connect-mongodb-session')(session);
const config = require('config');
const csrf = require('csurf');
const mongoose = require('mongoose');

const multer = require('multer');
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
    cb(null, true);
  }
  else {
    cb(null, false);
  }
}

const routes = require('./routes');
const errorController = require('./controllers/error_pages');
const User = require('./models/user');

const app = express();


//Options for mongoose
const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false
};

const PORT = process.env.PORT || 5000;
/* Check if the url is in the server env otherwise use it from the config */
const MONGODB_URI = process.env.MONGODB_URI || config.get('mongoURI');
/* Create session store and point to database, and save it in collection sessions */
const store = new mongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions',
});
const csrfProtection = csrf();

//body parser
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));

/* add session to the app */
app.use(
  session({
    secret: config.get('sessionSecret'),
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
/* add protection */
app.use(csrfProtection);
/* Check if the user is logged in and the session is stored in the database */
app.use(async (req, res, next) => {
  try {
    if (!req.session.user) {
      return next();
    }
    const user = await User.findById(req.session.user._id);
    if (user) {
      req.user = user;
      next();
    }
  } catch (error) {
    console.error(error);
  }
});

/* Add local variable that all pages use */
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrf = req.csrfToken();
  next();
});
//routes
app.use('/', routes);

//error pages
app.get('/500', errorController.get500);
app.use(errorController.get404);

//Connect to the database and open the web server
mongoose
  .connect(MONGODB_URI, options)
  .then(result => {
    app.listen(PORT, () => console.log(`Listening on ${PORT}`));
  })
  .catch(err => {
    console.log(err);
    res.redirect('/500');
  });
