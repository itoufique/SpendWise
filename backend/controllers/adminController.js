const fs = require('fs');
const csv = require('csv-parser');
const Product = require('../models/Product');
const Category = require('../models/Category');
const User = require('../models/User');
const SearchHistory = require('../models/SearchHistory');
const Recommendation = require('../models/Recommendation');
const ApiResponse = require('../utils/apiResponse');

exports.addProduct = async (req, res, next) => {
  try {
    const payload = { ...req.body, images: req.body.images || [] };
    const product = await Product.create(payload);
    return ApiResponse.success(res, { product }, 'Product created', 201);
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) {
      return ApiResponse.error(res, 'Product not found', 404);
    }
    return ApiResponse.success(res, { product }, 'Product updated');
  } catch (error) {
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return ApiResponse.error(res, 'Product not found', 404);
    }
    return ApiResponse.success(res, {}, 'Product deleted');
  } catch (error) {
    next(error);
  }
};

exports.bulkUpload = async (req, res, next) => {
  try {
    if (!req.file) {
      return ApiResponse.error(res, 'CSV file is required', 400);
    }

    const products = [];
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (row) => {
        products.push({
          title: row.title,
          description: row.description,
          category: row.category,
          brand: row.brand,
          price: Number(row.price),
          rating: Number(row.rating) || 4.0,
          popularity: Number(row.popularity) || 0,
          images: row.images ? row.images.split('|') : [],
          stock: Number(row.stock) || 100,
          features: row.features ? row.features.split('|') : [],
          specs: {},
        });
      })
      .on('end', async () => {
        await Product.insertMany(products);
        return ApiResponse.success(res, { count: products.length }, 'Products imported successfully');
      });
  } catch (error) {
    next(error);
  }
};

exports.analytics = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalSearches = await SearchHistory.countDocuments();
    const popularProducts = await Product.find().sort({ popularity: -1 }).limit(5);
    const topRecommended = await Recommendation.find().sort({ createdAt: -1 }).limit(5).populate('recommendedProducts');

    return ApiResponse.success(res, {
      totalUsers,
      totalProducts,
      totalSearches,
      popularProducts,
      topRecommended,
    }, 'Admin analytics');
  } catch (error) {
    next(error);
  }
};
