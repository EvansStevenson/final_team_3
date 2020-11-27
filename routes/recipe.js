const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipe');

router.get('/addrecipe', recipeController.getAddRecipe);
router.post('/addrecipe/submit', recipeController.postAddRecipe);
router.get('/about', recipeController.getAbout);
router.get('/categories', recipeController.getCategories);
router.get('/:id/info', recipeController.getInfo);
router.get('/:id/edit', recipeController.getEditRecipe);
router.get('/:id/delete', recipeController.deleteRecipe);
router.get('/:id/favorite', recipeController.addFavorite);
router.get('/:id/remove-favorite', recipeController.removeFavorite);
router.get('/favorites', recipeController.getFavorites);
router.get('/list', recipeController.getList);
router.get('/:id/add-to-list', recipeController.addList);
module.exports = router;
