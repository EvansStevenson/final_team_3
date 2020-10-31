//Here is our index for our final.
const express = require('express');

const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 5000;
const routes = require('./routes');
const errorController = require('./controllers/error_pages');
const MONGODB_URL = process.env.MONGODB_URL || "mongodb+srv://root:root@cluster0.wcnhp.mongodb.net/gourmeat?retryWrites=true&w=majority";

const app = express();

//Options for mongoose
const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true
}

//body parser
app.use(bodyParser.urlencoded({ extended: false }))

//routes
app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use('/', routes);

//error pages
app.get('/500', errorController.get500);
app.use(errorController.get404);

//Connect to the database and open the web server
mongoose
    .connect(
        MONGODB_URL, options
    )
    .then(result => {
        app.listen(PORT, () => console.log(`Listening on ${PORT}`));
    })
    .catch(err => {
        console.log(err);
    })