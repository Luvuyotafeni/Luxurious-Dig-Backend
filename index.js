const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const userModel = require('./models/users')

const app = express()
app.use(express.json())
app.use(cors())

mongoose.connect("mongodb://localhost:27017/lxd");

app.post('/login',(req, res) => {
    const {email, password} = req.body;
    userModel.findOne({email: email})
    .then(user => {
        if(user) {
            if(user.password === password){

                //return the user information o fthat user id
                res.json({
                    message: "Login successful",
                    user: {
                        id: user._id,
                        name: user.name,
                        surname: user.surname,
                        email: user.email,
                        phone: user.phone,
                        cart: user.cart
                    }
                })
            } else {
                res.json("the password is incorrect")
            }
        } else {
            res.json("Email is not registered try to register")
        }
    })
})

app.post('/users', (req, res) => {
    const { name, surname, phone, email, password, cart } = req.body;
    
    const newUser = new userModel({
        name,
        surname,
        phone,
        email,
        password,
        cart: cart || []  // Merge cart from request or initialize as empty
    });

    newUser.save()
    .then(user => res.json(user))
    .catch(err => res.status(500).json(err));
});

app.listen(3001, () => {
    console.log("server is running")
})