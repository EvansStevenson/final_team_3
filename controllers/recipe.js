const session = require('express-session');
const Recipe = require('../models/recipe');
const User = require('../models/user');
const fs = require('fs');
const user = require('../models/user');

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
        title: 'Welcome! | Gourmeat',
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
    title: 'Add New Recipe | Gourmeat',
    path: '/recipe/addrecipe',
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
    if (req.body['tag' + id] !== undefined) tags.push(req.body['tag' + id]);
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
      title: 'Add New Recipe | Gourmeat',
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
    title: 'About Us | Gourmeat',
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
          if (tag === 'chicken') {
            chicken.push(i);
          } else if (tag === 'beef') {
            beef.push(i);
          } else if (tag === 'pork') {
            pork.push(i);
          } else if (tag === 'seafood') {
            fish.push(i);
          } else if (tag === 'vegetable') {
            vegetable.push(i);
          } else if (tag === 'vegan') {
            vegan.push(i);
          } else if (tag === 'dessert') {
            dessert.push(i);
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
        title: 'Food Categories | Gourmeat',
        path: '/recipe/categories',
        chicken: chicken,
        beef: beef,
        pork: pork,
        fish: fish,
        vegetable: vegetable,
        vegan: vegan,
        dessert: dessert,
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
      title: recipe.title + ' | Gourmeat',
      path: '/recipe',
      recipe: recipe,
      user: user,
    });
  } catch (error) {
    console.error(error);
  }
};

exports.getEditRecipe = async (req, res) => {
  const prodId = req.params.id;
  const recipe = await Recipe.findById(req.params.id);
  //console.log(recipe.tags);
  res.render('editrecipe', {
    title: 'Edit Recipe | Gourmeat',
    path: 'editrecipe',
    servings: recipe.servings,
    preperationMinutes: recipe.preperationMinutes,
    cookingMinutes: recipe.cookingMinutes,
    title: recipe.title,
    ingredients: recipe.ingredients,
    instructions: recipe.instructions,
    tags: recipe.tags,
    id: prodId,
  })
};

exports.postEditRecipe = (req, res) => {
  let prodId = req.body.recipeId;
  let newservings = req.body.servings;
  let newpreperationMinutes = req.body.preperationMinutes;
  let newcookingMinutes = req.body.cookingMinutes;
  let newtitle = req.body.title;
  let newingredients = [];
  let newtags = [];
  let newnumIngredients = req.body.numIngredients;

  //populate tags
  for (let i = 0; i <= 6; i++) {
    let id = i;
    id.toString();
    if (req.body['tag' + id] !== undefined) newtags.push(req.body['tag' + id]);
  }

  //populate ingredients
  for (let i = 0; i < newnumIngredients; i++) {
    let id = i;
    id.toString();
    let currentAmount = req.body['amount' + id];
    let currentIngredient = req.body['ingredient' + id];
    let currentUnit = req.body['unit' + id];
    newingredients.push({ name: currentIngredient, unit: currentUnit, amount: currentAmount });
  }

  //populate instructions
  let newinstructions = [];
  let numDirections = req.body.numDirections;
  for (let i = 0; i < numDirections; i++) {
    let id = i;
    id.toString();
    let currentDirection = req.body['direction' + id];
    newinstructions.push(currentDirection);
  }
  let image = req.file;
  //console.log(image);
  if (!image) {
    res.redirect('/500');
  }
  const imageUrl = image.path;
  console.log(newinstructions)
  Recipe.findById(prodId)
    .then(recipe => {
      if (recipe.creator.toString() !== req.user._id.toString()) {
        return res.redirect('/');
      }
      //fs.unlinkSync(recipe.imagePath); // delete image from the server
      recipe.servings = newservings;
      recipe.preperationMinutes = newpreperationMinutes
      recipe.cookingMinutes = newcookingMinutes
      recipe.title = newtitle
      recipe.ingredients = newingredients
      recipe.instructions = newinstructions
      recipe.imagePath = imageUrl
      recipe.tags = newtags
      recipe.creator = req.user
      return recipe.save()
        .then(result => {
          console.log('UPDATED recipe!');
          res.redirect('/auth/dashboard');
        })
    })
    .catch(err => {
      console.log(err);
      res.redirect('/500');
    });
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
    });
    fs.unlinkSync(recipe.imagePath); // delete image from the server
    res.redirect('/auth/dashboard');
  } catch (error) {
    console.error(error);
  }
};

exports.addFavorite = async (req, res) => {
  try {
    const id = req.params.id;
    const favoriteArray = req.user.favoriteRecipes;
    const index = favoriteArray.indexOf(id);
    if (index >= 0) {
      return res.redirect('/');
    } else {
      favoriteArray.push(id);
      await User.updateOne({ _id: req.user.id }, { $set: { favoriteRecipes: favoriteArray } });
      res.redirect('/');
    }
  } catch (error) {
    console.error(error);
  }
};

exports.getFavorites = async (req, res) => {
  try {
    const recipesId = req.user.favoriteRecipes;
    //console.log(recipesId);
    let recipes = [];
    if (recipesId.length > 1) {
      await Promise.all(
        recipesId.map(async item => {
          const recipe = await Recipe.findById(item);
          recipes.push(recipe);
        })
      );
    } else {
      const recipe = await Recipe.findById(recipesId[0]);
      recipes.push(recipe);
    }
    res.render('favorites', {
      title: 'Favorite Recipes | Gourmeat',
      path: '/favorites',
      recipes: recipes,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.removeFavorite = async (req, res) => {
  try {
    const id = req.params.id;
    const favorites = req.user.favoriteRecipes;
    const updatedArray = favorites.filter(x => x != id);
    await User.updateOne({ _id: req.user._id }, { $set: { favoriteRecipes: updatedArray } });
    res.redirect('/recipe/favorites');
  } catch (error) {
    console.log(error);
  }
};

exports.getList = async (req, res) => {

  try {
    const list = req.user.shoppingList;
    let ingredients = [];
    if (list.length > 1) {
      ingredients = list;
    }
    res.render('list', {
      path: '/list',
      title: 'Grocery List',
      ingredients: ingredients,
    });
  } catch (error) {
    console.error(error);
  }
};

exports.addList = async (req, res) => {
  try {
    const id = req.params.id;
    const recipe = await Recipe.findById(id);
    const ingredients = recipe.ingredients;
    const userIngredients = req.user.shoppingList;
    for (let i = 0; i < ingredients.length; i++) {
      if (userIngredients.length > 0) {
        const index = userIngredients.indexOf(ingredients[i].name);
        console.log(index);
        if (index < 0) {
          userIngredients.push(ingredients[i].name);
        }
      }
    }
    await User.updateOne({ _id: req.user.id }, { $set: { shoppingList: userIngredients } });
    res.redirect('/');

  } catch (error) {
    console.error(error);
  }
};
