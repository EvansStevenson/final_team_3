const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  resetToken: { type: String },
  resetTokenExpiration: { type: Date },
  addedRecipes: [{ type: Schema.Types.ObjectId, ref: 'Recipe' }],
  favoriteRecipes: [{ type: Schema.Types.ObjectId, ref: 'Recipe' }],
  friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  level: { type: Number },
});

module.exports = mongoose.model('User', userSchema);
