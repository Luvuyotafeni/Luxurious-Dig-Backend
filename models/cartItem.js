// models/cart.js
const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, // Reference to Product
      version: String,
      price: Number,
      image: String,
      space: [String],
      variant: [String],
      desc: String,
    }
  ],
});

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
