const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  surname: String,
  phone: String,
  email: { type: String, unique: true },
  password: String, // Password should be hashed for production
});

const User = mongoose.model("User", userSchema);
module.exports = User;
