//Here is our index for our final.
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const PORT = process.env.PORT || 5000;
const routes = require('./routes');
const errorController = require('./controllers/error_pages');

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

//listen
app.listen(PORT, () => console.log(`Listening on ${PORT}`));

//development branch created
//evans branch created