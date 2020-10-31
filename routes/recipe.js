const path = require('path');

const express = require('express');
const recipeController = require('../controllers/recipe');

const router = express.Router();

router.get('/', recipeController.getHomePage);

module.exports = router;