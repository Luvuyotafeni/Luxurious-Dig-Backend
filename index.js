const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userModel = require('./models/users'); // Adjust path as necessary
const cartModel = require('./models/cartItem');
const productModel = require('./models/product');

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



// Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await userModel.findOne({ email });

    // Check if user exists and if password matches
    if (user && user.password === password) { // Simple password check (not secure for production)
      
      // Fetch the user's cart and populate the 'items' field with product details
      const userCart = await cartModel.findOne({ userId: user._id }).populate('items.productId'); 

      // Respond with user details and populated cart items
      res.json({
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          surname: user.surname,
          email: user.email,
          phone: user.phone,
        },
        cart: userCart ? userCart.items : [], // Return the populated cart items
      });
    } else {
      // Respond with error if login details are incorrect
      res.status(401).json({ message: "Incorrect password or email not registered" });
    }
  } catch (error) {
    console.error("Error during login", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


// User Sign-up Route
app.post('/users', async (req, res) => {
  const { name, surname, phone, email, password, cart } = req.body;

  // First, create a new user
  const newUser = new userModel({
    name,
    surname,
    phone,
    email,
    password, // Storing password as plain text (not recommended for production)
  });

  try {
    // Save the new user
    const user = await newUser.save();

    // If cart is provided in the request, save it in the Cart collection
    const newCart = new cartModel({
      userId: user._id,  // Linking the userId to the new cart
      items: cart || [],  // Take cart from request, or an empty array if not provided
    });

    // Save the cart with the user's cart items
    await newCart.save();

    res.status(201).json({
      message: 'User and Cart created successfully',
      user: {
        id: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        phone: user.phone,
      },
      cart: newCart,
    });

  } catch (error) {
    console.error("Error during user creation", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route to delete an item by index in the user's cart
app.put('/cart/:userId/remove-item/:itemId', async (req, res) => {
  const { userId, itemId } = req.params;
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Filter the cart to remove the item by its unique _id
    user.cart = user.cart.filter(item => item._id.toString() !== itemId);

    // Save the updated user cart
    await user.save();
    res.json({ message: 'Item removed from cart successfully', cart: user.cart });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



// Start the server
app.listen(3001, () => {
  console.log("Server is running on port 3001");
});