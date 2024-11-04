const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userModel = require('./models/users'); // Adjust path as necessary

const app = express();
app.use(express.json());

// Enable CORS for all origins
app.use(cors());

// MongoDB connection
mongoose.connect("mongodb+srv://luvuyo:1234@tester.sgrsmdc.mongodb.net/lxd?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.error("Could not connect to MongoDB", err));

// Route to delete an item from the user's cart
app.delete('/cart/:userId/:itemId', async (req, res) => {
  const { userId, itemId } = req.params;
  try {
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { $pull: { cart: { _id: itemId } } },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: 'User or item not found' });
    }
    res.json({ message: 'Item removed from cart successfully', cart: updatedUser.cart });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (user && user.password === password) { // Simple password check
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
      res.status(401).json({ message: "Incorrect password or email not registered" });
    }
  } catch (error) {
    console.error("Error during login", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Sign-up Route
app.post('/users', async (req, res) => {
  const { name, surname, phone, email, password, cart } = req.body;
  const newUser = new userModel({
    name,
    surname,
    phone,
    email,
    password, // Storing password as plain text (not recommended for production)
    cart: cart || []
  });
  try {
    const user = await newUser.save();
    res.status(201).json(user);
  } catch (error) {
    console.error("Error during user creation", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update cart items for a user
app.put('/cart/:userId', async (req, res) => {
  const { userId } = req.params;
  const { cart } = req.body; // Expecting cart as an array of cart items

  try {
    // Validate that the cart data is an array
    if (!Array.isArray(cart)) {
      return res.status(400).json({ message: 'Cart must be an array' });
    }

    // Update the user's cart in MongoDB
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { cart: cart },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'Cart updated successfully', cart: updatedUser.cart });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Start the server
app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
