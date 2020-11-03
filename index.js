//Here is our index for our final.
const express = require('express');

const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const mongoDBStore = require('connect-mongodb-session')(session);
const config = require('config');
const csrf = require('csurf');
const mongoose = require('mongoose');

const routes = require('./routes');
const errorController = require('./controllers/error_pages');

const app = express();

//Options for mongoose
const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true
}

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
app.use(bodyParser.urlencoded({ extended: false }));

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
// app.use(csrfProtection);
//routes
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use('/', routes);

//error pages
app.get('/500', errorController.get500);
app.use(errorController.get404);

//Connect to the database and open the web server
mongoose
    .connect(
        MONGODB_URI, options
    )
    .then(result => {
        app.listen(PORT, () => console.log(`Listening on ${PORT}`));
    })
    .catch(err => {
        console.log(err);
    })
