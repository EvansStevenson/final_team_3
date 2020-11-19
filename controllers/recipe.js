const session = require('express-session');
const recipe = require('../models/recipe');
const Recipe = require('../models/recipe');
const User = require('../models/user');

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
  let tags = [];
  let numIngredients = req.body.numIngredients;

  //populate tags
  for (let i = 0; i <= 6; i++) {
    let id = i;
    id.toString();
    if (req.body['tag' + id] !== undefined)
      tags.push(req.body['tag' + id]);
  }

  //populate ingredients
  for (let i = 0; i < numIngredients; i++) {
    let id = i + 1;
    id.toString();
    let currentAmount = req.body['amount' + id];
    let currentIngredient = req.body['ingredient' + id];
    let currentUnit = req.body['unit' + id];
    ingredients.push({ name: currentIngredient, unit: currentUnit, amount: currentAmount });
  }

  //populate instructions
  let instructions = [];
  let numDirections = req.body.numDirections;
  for (let i = 0; i < numDirections; i++) {
    let id = i + 1;
    id.toString();
    let currentDirection = req.body['direction' + id];
    instructions.push(currentDirection);
  }
  let image = req.file;
  //console.log(image);
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
  //console.log(image.path);
  const recipe = new Recipe({
    servings: servings,
    preperationMinutes: preperationMinutes,
    cookingMinutes: cookingMinutes,
    title: title,
    ingredients: ingredients,
    instructions: instructions,
    imagePath: imageUrl,
    tags: tags,
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

exports.getCategories = (req, res) => {
  let chicken = [];
  let beef = [];
  let pork = [];
  let fish = [];
  let vegetable = [];
  let vegan = [];
  let dessert = [];
  Recipe.find()
    .then(recipe => {
      for (let i of recipe) {
        for (let tag of i.tags) {
          if (tag === "chicken") {
            chicken.push(i);
          }
          else if (tag === "beef") {
            beef.push(i)
          }
          else if (tag === "pork") {
            pork.push(i)
          }
          else if (tag === "fish") {
            fish.push(i)
          }
          else if (tag === "vegetable") {
            vegetable.push(i)
          }
          else if (tag === "vegan") {
            vegan.push(i)
          }
          else if (tag === "dessert") {
            dessert.push(i)
          }
        }
      }
      //make unique
      // let uchicken = [...new Set(chicken)];
      // console.log(uchicken);
      // let ubeef = [...new Set(beef)];
      // let upork = [...new Set(pork)];
      // let ufish = [...new Set(fish)];
      // let uvegetable = [...new Set(vegetable)];
      // let uvegan = [...new Set(vegan)];
      // let udessert = [...new Set(dessert)];
      res.render('../views/categories', {
        title: 'categories',
        path: '/recipe/categories',
        chicken: chicken,
        beef: beef,
        pork: pork,
        fish: fish,
        vegetable: vegetable,
        vegan: vegan,
        dessert: dessert
      });
    })
    .catch(err => {
      console.log(err);
      res.redirect('/500');
    });
};

exports.getInfo = async (req, res) => {
  try {
    const id = req.params.id;
    const recipe = await Recipe.findById(id);
    if (!recipe) {
      res.redirect('/');
    }
    const user = await User.findById(recipe.creator);

    res.render('recipeinfo', {
      title: 'Recipe Detail',
      path: '/recipe',
      recipe: recipe,
      user: user,
    });
  } catch (error) {
    console.error(error);
  }
};


