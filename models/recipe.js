const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const recipeSchema = new Schema({

});

module.exports = mongoose.model('Recipe', recipeSchema);