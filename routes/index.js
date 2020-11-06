//routes index page
const routes = require('express').Router();
const {getHomePage} = require('../controllers/recipe');
const adminRoutes = require('./admin');
const recipeRoutes = require('./recipe');
const authRoutes = require('./auth');

//Send requests to the appropriate route file
routes.get('/', getHomePage);
routes.use('/recipe', recipeRoutes);
routes.use('/admin', adminRoutes);
routes.use('/auth', authRoutes);

module.exports = routes;