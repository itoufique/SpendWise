const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const Product = require('../models/Product');
const User = require('../models/User');
const SearchHistory = require('../models/SearchHistory');
const Recommendation = require('../models/Recommendation');
const ApiResponse = require('../utils/apiResponse');

router.get('/', protect, admin, async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalSearches = await SearchHistory.countDocuments();
    const popularProducts = await Product.find().sort({ popularity: -1 }).limit(5);
    const recommendations = await Recommendation.find().sort({ createdAt: -1 }).limit(5).populate('recommendedProducts');
    return ApiResponse.success(res, { totalUsers, totalProducts, totalSearches, popularProducts, recommendations });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
