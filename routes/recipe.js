const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipe');

router.get('/addrecipe', recipeController.getAddRecipe);
router.post('/addrecipe/submit', recipeController.postAddRecipe);
module.exports = router;