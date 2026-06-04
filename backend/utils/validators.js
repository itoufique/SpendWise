const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(80).required(),
  email: Joi.string().trim().email().required(),
  password: Joi.string().trim().min(6).required(),
  preferences: Joi.array().items(Joi.string()).optional(),
});

const loginSchema = Joi.object({
  email: Joi.string().trim().email().required(),
  password: Joi.string().trim().required(),
});

const categorySchema = Joi.object({
  name: Joi.string().required(),
  slug: Joi.string().required(),
  description: Joi.string().allow('', null),
  image: Joi.string().allow('', null),
});

const productSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  category: Joi.string().required(),
  brand: Joi.string().required(),
  price: Joi.number().required(),
  rating: Joi.number().min(0).max(5).optional(),
  popularity: Joi.number().integer().optional(),
  images: Joi.array().items(Joi.string()).optional(),
  stock: Joi.number().integer().optional(),
  features: Joi.array().items(Joi.string()).optional(),
  specs: Joi.object().optional(),
});

module.exports = {
  registerSchema,
  loginSchema,
  categorySchema,
  productSchema,
};
