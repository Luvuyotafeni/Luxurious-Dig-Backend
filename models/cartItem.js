const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to User
  version: String,
  price: Number,
  image: String,
  space: [String],
  variant: [String],
  desc: String,
});

const CartItem = mongoose.model("CartItem", cartItemSchema);
module.exports = CartItem;
