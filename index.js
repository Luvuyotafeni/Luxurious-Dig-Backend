const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userModel = require('./models/users'); // Assuming you have userModel in a separate file

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect("mongodb+srv://luvuyo:1234@tester.sgrsmdc.mongodb.net/lxd?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.error("Could not connect to MongoDB", err));

// DELETE Route to remove an item from the cart
app.delete('/cart/:userId/:itemId', async (req, res) => {
  const { userId, itemId } = req.params;

  try {
    // Find the user by userId
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Filter out the item to remove from the cart
    user.cart = user.cart.filter(item => item._id.toString() !== itemId);

    // Save the updated user
    await user.save();

    res.json({ message: 'Item removed from cart successfully' });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login Route (existing)
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  userModel.findOne({ email })
    .then(user => {
      if (user) {
        if (user.password === password) {
          res.json({
            message: "Login successful",
            user: {
              id: user._id,
              name: user.name,
              surname: user.surname,
              email: user.email,
              phone: user.phone,
              cart: user.cart,
            },
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

// Sign-up Route (existing)
app.post('/users', (req, res) => {
  const { name, surname, phone, email, password, cart } = req.body;

  const newUser = new userModel({
    name,
    surname,
    phone,
    email,
    password,
    cart: cart || []  // Initialize cart as empty if not provided
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
