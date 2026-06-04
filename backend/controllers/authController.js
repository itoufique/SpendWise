const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/User');
const Wishlist = require('../models/Wishlist');
const SearchHistory = require('../models/SearchHistory');
const Recommendation = require('../models/Recommendation');
const ApiResponse = require('../utils/apiResponse');
const generateToken = require('../utils/generateToken');

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, preferences } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      return ApiResponse.error(res, 'Email already registered', 400);
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, preferences });
    await Wishlist.create({ user: user._id, products: [] });

    return ApiResponse.success(res, {
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token: generateToken(user._id, user.role),
    }, 'Registration successful', 201);
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return ApiResponse.error(res, 'Invalid credentials', 401);
    }

    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      return ApiResponse.error(res, 'Invalid credentials', 401);
    }

    return ApiResponse.success(res, {
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token: generateToken(user._id, user.role),
    }, 'Login successful');
  } catch (error) {
    next(error);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return ApiResponse.error(res, 'User not found', 404);
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

    // In production, email this token; for demo, return it in the response.
    return ApiResponse.success(res, { email, resetToken, resetUrl }, 'Password reset token generated');
  } catch (error) {
    next(error);
  }
};

exports.profile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    const wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products');
    const searchHistory = await SearchHistory.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(10);
    const recommendations = await Recommendation.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(10).populate('recommendedProducts');

    return ApiResponse.success(res, {
      user,
      wishlist: wishlist ? wishlist.products : [],
      searchHistory,
      recommendationHistory: recommendations,
    }, 'Profile loaded');
  } catch (error) {
    next(error);
  }
};
