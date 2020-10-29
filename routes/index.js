//routes index page
const routes = require('express').Router();
const { getHomePage } = require('../controllers/home');

routes.get('/', getHomePage);

module.exports = routes;