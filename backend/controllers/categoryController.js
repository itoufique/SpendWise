const Category = require('../models/Category');
const ApiResponse = require('../utils/apiResponse');

exports.listCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    return ApiResponse.success(res, { categories }, 'Categories loaded');
  } catch (error) {
    next(error);
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    const existing = await Category.findOne({ slug: req.body.slug });
    if (existing) {
      return ApiResponse.error(res, 'Category already exists', 400);
    }
    const category = await Category.create(req.body);
    return ApiResponse.success(res, { category }, 'Category created', 201);
  } catch (error) {
    next(error);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!category) {
      return ApiResponse.error(res, 'Category not found', 404);
    }
    return ApiResponse.success(res, { category }, 'Category updated');
  } catch (error) {
    next(error);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return ApiResponse.error(res, 'Category not found', 404);
    }
    return ApiResponse.success(res, {}, 'Category deleted');
  } catch (error) {
    next(error);
  }
};
