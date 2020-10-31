//routes index page
const routes = require('express').Router();

const adminRoutes = require('./admin');
const recipeRoutes = require('./recipe');
const authRoutes = require('./auth');

routes.get('/', recipeRoutes);
routes.use('/admin', adminRoutes);
routes.use(authRoutes);

module.exports = routes;