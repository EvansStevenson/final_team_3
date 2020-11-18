const session = require('express-session');
const Recipe = require('../models/recipe');
const User = require('../models/user');
const fs = require('fs');

exports.getHomePage = (req, res) => {
  Recipe.find()
    .then(recipe => {
      for (let i = recipe.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * i);
        const temp = recipe[i];
        recipe[i] = recipe[j];
        recipe[j] = temp;
      }

      //console.log(recipe[0].imagePath);
      res.render('../views/home', {
        title: 'CSE341 final',
        path: '/',
        foods: recipe,
      });
    })
    .catch(err => {
      console.log(err);
      res.redirect('/500');
    });
};

exports.getAddRecipe = (req, res) => {
  res.render('../views/addrecipe', {
    title: 'New Recipe',
    path: '/recipe//addrecipe',
  });
};

exports.postAddRecipe = (req, res) => {
  let servings = req.body.servings;
  let preperationMinutes = req.body.preperationMinutes;
  let cookingMinutes = req.body.cookingMinutes;
  let title = req.body.title;
  let ingredients = [];
  let numIngredients = req.body.numIngredients;

  for (let i = 0; i < numIngredients; i++) {
    let id = i + 1;
    id.toString();
    let currentAmount = req.body['amount' + id];
    let currentIngredient = req.body['ingredient' + id];
    let currentUnit = req.body['unit' + id];
    ingredients.push({ name: currentIngredient, unit: currentUnit, amount: currentAmount });
  }

  let instructions = [];
  let numDirections = req.body.numDirections;
  for (let i = 0; i < numDirections; i++) {
    let id = i + 1;
    id.toString();
    let currentDirection = req.body['direction' + id];
    instructions.push(currentDirection);
  }
  let image = req.file;
  console.log(image);
  if (!image) {
    return res.status(422).render('../views/addrecipe', {
      title: 'Add Recipe',
      path: '/recipe/addrecipe',
      errorMessage: 'Attached file is not an image',
      error: [],
      submitAdmin: false,
      oldInput: {
        servings: req.body.servings,
        preperationMinutes: req.body.preperationMinutes,
        cookingMinutes: req.body.cookingMinutes,
        title: req.body.title,
        ingredients: ingredients,
        instructions: instructions,
        numIngredients: req.body.numIngredients,
        numDirections: req.body.numDirections,
      },
    });
  }

  const imageUrl = image.path;
  console.log(image.path);
  const recipe = new Recipe({
    servings: servings,
    preperationMinutes: preperationMinutes,
    cookingMinutes: cookingMinutes,
    title: title,
    ingredients: ingredients,
    instructions: instructions,
    imagePath: imageUrl,
    creator: req.user,
  });
  recipe
    .save()
    .then(async result => {
      const recipesArray = req.user.addedRecipes;
      recipesArray.push(result._id);
      await User.updateOne({ _id: req.user._id }, { $set: { addedRecipes: recipesArray } });
      res.redirect('/'); // TO DO: not sure where to redirect to at the moment
    })
    .catch(err => {
      console.log(err);
      res.redirect('/500');
    });
};

exports.getAbout = (req, res) => {
  res.render('../views/about', {
    title: 'about',
    path: '/recipe/about',
  });
};

exports.getInfo = (req, res) => {
  let id = req.params.id;
  if (!id) {
    return res.redirect('/');
  }
  Recipe.findById(id)
    .then(recipe => {
      //console.log(recipe.imagePath);
      res.render('../views/recipeinfo', {
        title: 'Recipe Detail',
        path: '/recipe',
        recipe: recipe
      });
    }).catch(err => {
      console.log(err);
      res.redirect('/500');
    });
}

exports.getEditRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    console.log(recipe);
    res.status(422).render('addrecipe', {
      title: 'Edit Recipe',
      path: '',
      errorMessage: '',
      error: [],
      oldInput: {
        servings: recipe.servings,
        preperationMinutes: recipe.preperationMinutes,
        cookingMinutes: recipe.cookingMinutes,
        title: recipe.title,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        numIngredients: recipe.numIngredients,
        numDirections: recipe.numDirections,
      },
    });
  } catch (error) {
    console.error(error);
  }
}

exports.deleteRecipe = async (req, res) => {
  try {
    const id = req.params.id;
    const recipe = await Recipe.findByIdAndDelete(id); // delete recipe from database
    const addedRecipes = req.user.addedRecipes.filter(x => x != id);
    await User.updateOne({ _id: req.user.id }, { $set: { addedRecipes: addedRecipes } });
    const users = await User.find();
    users.forEach(async user => {
      const favorites = user.favoriteRecipes.filter(x => x != id);
      await User.updateOne({ _id: user._id }, { $set: { favoriteRecipes: favorites } });
    })
    fs.unlinkSync(recipe.imagePath); // delete image from the server 
    res.redirect('/auth/dashboard');
  } catch (error) {
    console.error(error);
  }
}

exports.addFavorite = async (req, res) => {
  try {
    const id = req.params.id;
    const favoriteArray = req.user.favoriteRecipes;
    favoriteArray.push(id);
    await User.updateOne({ _id: req.user.id }, { $set: { favoriteRecipes: favoriteArray } });
    res.redirect('/');
  } catch (error) {
    console.error(error);
  }
}

exports.getFavorites = async (req, res) => {
  try {
    const recipesId = req.user.favoriteRecipes;
    console.log(recipesId);
    let recipes = [];
    if (recipesId.length > 1) {
      await Promise.all(
        recipesId.forEach(async item => {
          const recipe = await Recipe.findById(item);
          recipes.push(recipe);
        })
      );
    } else {
      const recipe = await Recipe.findById(recipesId[0]);
      recipes.push(recipe);
    }
    console.log(recipes);
    res.render('favorites', {
      title: 'Favorite Recipes',
      path: '/favorites',
      recipes: recipes
    })
  } catch (error) {
    console.log(error);
  }
}