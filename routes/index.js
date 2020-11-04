//routes index page
const routes = require('express').Router();

const adminRoutes = require('./admin');
const recipeRoutes = require('./recipe');
const authRoutes = require('./auth');

//Send requests to the appropriate route file
routes.get('/', recipeRoutes);
routes.use('/admin', adminRoutes);
routes.use(authRoutes);

module.exports = routes;