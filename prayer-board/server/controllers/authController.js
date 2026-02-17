const jwt = require('jsonwebtoken');
const sanitizeHtml = require('sanitize-html');
const User = require('../models/User');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password validation (min 8 chars, at least 1 uppercase, 1 lowercase, 1 number)
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;

// Sanitize input to prevent XSS
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return sanitizeHtml(input.trim(), {
    allowedTags: [],
    allowedAttributes: {}
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    let { displayName, email, password } = req.body;

    // Sanitize inputs
    displayName = sanitizeInput(displayName);
    email = sanitizeInput(email)?.toLowerCase();

    // Validation
    if (!displayName || !email || !password) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    // Email format validation
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address' });
    }

    if (displayName.length < 2 || displayName.length > 50) {
      return res.status(400).json({ error: 'Display name must be between 2 and 50 characters' });
    }

    // Password validation
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    if (password.length > 128) {
      return res.status(400).json({ error: 'Password must not exceed 128 characters' });
    }

    if (!passwordRegex.test(password)) {
      return res.status(400).json({ 
        error: 'Password must contain at least one uppercase letter, one lowercase letter, and one number' 
      });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Create user
    const user = await User.create({
      displayName,
      email,
      password
    });

    if (user) {
      res.status(201).json({
        token: generateToken(user._id),
        user: {
          id: user._id,
          displayName: user.displayName,
          email: user.email,
          role: user.role
        }
      });
    }
  } catch (error) {
    console.error('Register error:', error.message);
    res.status(500).json({ error: 'Server error during registration' });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    // Sanitize email
    email = sanitizeInput(email)?.toLowerCase();

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password' });
    }

    // Email format validation
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Check for user email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ error: 'Account is deactivated' });
    }

    // Check password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    res.json({
      token: generateToken(user._id),
      user: {
        id: user._id,
        displayName: user.displayName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ error: 'Server error during login' });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        displayName: user.displayName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('GetMe error:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  register,
  login,
  getMe
};
