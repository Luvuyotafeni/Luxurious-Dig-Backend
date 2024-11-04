const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  version: String,
  price: Number,
  image: String,
  space: [String],
  variant: [String],
  desc: String
}, { _id: true });

const userSchema = new mongoose.Schema({
  name: String,
  surname: String,
  phone: String,
  email: String,
  password: String,
  cart: {
    type: [cartItemSchema],
    default: []
  }
});

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
