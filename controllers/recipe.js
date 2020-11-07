const session = require("express-session");
const Recipe = require('../models/recipe');

exports.getHomePage = (req, res) => {
    res.render('../views/home', {
        title: 'CSE341 final',
        path: '/',
        foods: [], //Added so that home would load without errors. This will eventually mean somehting
    });
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
    let imgPath = "/placeholder";

    const recipe = new Recipe({
        servings: servings,
        preperationMinutes: preperationMinutes,
        cookingMinutes: cookingMinutes,
        title: title,
        ingredients: ingredients,
        instructions: instructions,
        imagePath: imgPath,
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