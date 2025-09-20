const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Basic validation
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    if (username.length < 3) {
      return res.status(400).json({ error: 'Username must be at least 3 characters long' });
    }

    if (password.length < 4) {
      return res.status(400).json({ error: 'Password must be at least 4 characters long' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username: username.trim() });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Create new user
    const user = new User({
      username: username.trim(),
      password: password, // In production, hash this password
      cart: [],
      favorites: []
    });

    await user.save();

    // Return user data without password
    const userData = {
      id: user._id,
      username: user.username,
      cart: user.cart,
      favorites: user.favorites,
      createdAt: user.createdAt
    };

    res.status(201).json({
      message: 'User created successfully',
      user: userData
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Find user by username and password
    const user = await User.findOne({ 
      username: username.trim(), 
      password: password 
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Return user data without password
    const userData = {
      id: user._id,
      username: user.username,
      cart: user.cart,
      favorites: user.favorites,
      createdAt: user.createdAt
    };

    res.json({
      message: 'Login successful',
      user: userData
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Get user by ID (for session validation)
router.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add item to cart
router.post('/cart/:userId', async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.params.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Add to cart if not already present
    if (!user.cart.includes(productId)) {
      user.cart.push(productId);
      await user.save();
    }

    const userData = {
      id: user._id,
      username: user.username,
      cart: user.cart,
      favorites: user.favorites,
      createdAt: user.createdAt
    };

    res.json({ user: userData });

  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Remove item from cart
router.delete('/cart/:userId/:productId', async (req, res) => {
  try {
    const { userId, productId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.cart = user.cart.filter(id => id.toString() !== productId);
    await user.save();

    const userData = {
      id: user._id,
      username: user.username,
      cart: user.cart,
      favorites: user.favorites,
      createdAt: user.createdAt
    };

    res.json({ user: userData });

  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add item to favorites
router.post('/favorites/:userId', async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.params.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Add to favorites if not already present
    if (!user.favorites.includes(productId)) {
      user.favorites.push(productId);
      await user.save();
    }

    const userData = {
      id: user._id,
      username: user.username,
      cart: user.cart,
      favorites: user.favorites,
      createdAt: user.createdAt
    };

    res.json({ user: userData });

  } catch (error) {
    console.error('Add to favorites error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Remove item from favorites
router.delete('/favorites/:userId/:productId', async (req, res) => {
  try {
    const { userId, productId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.favorites = user.favorites.filter(id => id.toString() !== productId);
    await user.save();

    const userData = {
      id: user._id,
      username: user.username,
      cart: user.cart,
      favorites: user.favorites,
      createdAt: user.createdAt
    };

    res.json({ user: userData });

  } catch (error) {
    console.error('Remove from favorites error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
