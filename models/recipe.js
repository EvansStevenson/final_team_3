import mongoose from 'mongoose';
const { Schema } = mongoose;

const recipeSchema = new Schema({
  servings: { type: Number },
  preperationMinutes: { type: Number },
  cookingMinutes: { type: Number },
  title: { type: String, required: true },
  ingredients: [
    {
      name: { type: String, required: true },
      unit: { type: String, required: true },
      amount: { type: Number, required: true }
    }
  ],
  instructions: { type: String, required: true },
  imagePath: { type: String, required: true }
});

module.exports = mongoose.model('Recipe', recipeSchema); 