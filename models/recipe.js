const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recipeSchema = new Schema({
  servings: { type: Number },
  preperationMinutes: { type: Number },
  cookingMinutes: { type: Number },
  title: { type: String, required: true },
  ingredients: [
    {
      name: { type: String, required: true },
      unit: { type: String, required: true },
      amount: { type: Number, required: true },
    },
  ],
  instructions: [{ type: String, required: true }],
  imagePath: { type: String, required: true },
  tags: [{ type: String, required: true}],
  creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('Recipe', recipeSchema);
