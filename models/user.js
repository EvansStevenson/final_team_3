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
  shoppingList: [{ type: String }],
  friendRequests: [
    {
      _id: false,
      requestor: { type: Schema.Types.ObjectId, ref: 'User' },
      approved: { type: Boolean },
      declined: { type: Boolean },
    },
  ],
  friendRequestsSent: [
    {
      _id: false,
      user: { type: Schema.Types.ObjectId, ref: 'User' },
      confirmed: { type: Boolean },
    },
  ],
  friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  level: { type: Number },
});

module.exports = mongoose.model('User', userSchema);
