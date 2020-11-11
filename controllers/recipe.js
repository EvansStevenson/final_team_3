const session = require("express-session");
const recipe = require("../models/recipe");
const Recipe = require('../models/recipe');

exports.getHomePage = (req, res) => {
    Recipe.find()
        .then(recipe => {
            res.render('../views/home', {
                title: 'CSE341 final',
                path: '/',
                foods: recipe, //Added so that home would load without errors. This will eventually mean somehting
            });
        })
        .catch(err => {
            console.log(err);
            res.redirect('/500');
        })
}

exports.getAddRecipe = (req, res) => {
    res.render('../views/addrecipe', {
        title: 'New Recipe',
        path: '/recipe//addrecipe',
    });
}

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
            errorMessage: "Attached file is not an image",
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
            }
        });
    }

    const imageUrl = image.path;
    console.log(image.path)
    const recipe = new Recipe({
        servings: servings,
        preperationMinutes: preperationMinutes,
        cookingMinutes: cookingMinutes,
        title: title,
        ingredients: ingredients,
        instructions: instructions,
        imagePath: imageUrl,
        creator: req.user
    })
    recipe.save()
        .then(result => {
            res.redirect('/'); // TO DO: not sure where to redirect to at the moment 
        })
        .catch(err => {
            console.log(err);
            res.redirect('/500');
        })
}

exports.getAbout = (req, res) => {
    res.render('../views/about', {
        title: 'about',
        path: '/recipe/about',
    });
}