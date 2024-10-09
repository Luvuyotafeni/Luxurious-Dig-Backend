const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: String,
    surname: String,
    phone: String,
    email: String,
    password: String
})

const userModel = mongoose.model("users", userSchema)
module.exports = userModel