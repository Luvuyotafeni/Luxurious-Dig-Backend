const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userModel = require('./models/users');

const app = express();
app.use(express.json());
app.use(cors());

// Update the MongoDB connection string with the correct username, password, and database name.
mongoose.connect("mongodb+srv://luvuyo:1234@tester.sgrsmdc.mongodb.net/lxd?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.error("Could not connect to MongoDB", err));

// Login Route
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    userModel.findOne({ email: email })
    .then(user => {
        if (user) {
            if (user.password === password) {
                // Return user information for that user id
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
                });
            } else {
                res.status(401).json({ message: "Incorrect password" });
            }
        } else {
            res.status(404).json({ message: "Email is not registered, try to register" });
        }
    })
    .catch(err => {
        console.error("Error during login", err);
        res.status(500).json({ message: "Internal server error" });
    });
});

// Sign-Up Route
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
    .then(user => res.status(201).json(user))
    .catch(err => {
        console.error("Error during user creation", err);
        res.status(500).json({ message: "Internal server error" });
    });
});

// Start the server
app.listen(3001, () => {
    console.log("Server is running on port 3001");
});
