const Product = require('../models/Product');
const Category = require('../models/Category');
const Review = require('../models/Review');
const Wishlist = require('../models/Wishlist');
const SearchHistory = require('../models/SearchHistory');
const Recommendation = require('../models/Recommendation');
const ApiResponse = require('../utils/apiResponse');
const cheerio = require('cheerio');

const SCRAPE_PAGES = [
  'https://webscraper.io/test-sites/e-commerce/static/computers/laptops',
  'https://webscraper.io/test-sites/e-commerce/static/computers/tablets',
];
const SCRAPE_HOST = 'https://webscraper.io';

const normalizeScrapedProduct = (item) => ({
  _id: `scrape-${Buffer.from(item.link).toString('hex').slice(0, 12)}`,
  title: item.title,
  description: item.description,
  brand: item.brand || 'WebScrape',
  price: item.price,
  rating: item.rating,
  images: [item.image],
  sourceUrl: item.link,
});

const scrapeProductPage = async (pageUrl, keyword) => {
  const response = await fetch(pageUrl);
  if (!response.ok) {
    throw new Error('Failed to fetch scrape source');
  }

  const html = await response.text();
  const $ = cheerio.load(html);
  const products = [];
  const keywordRegex = keyword ? new RegExp(keyword, 'i') : null;

  $('div.card.thumbnail').each((_, element) => {
    const title = $(element).find('a.title').text().trim();
    const description = $(element).find('p.description').text().trim();
    const priceText = $(element).find('h4.pull-right.price').text().trim();
    const price = Number(priceText.replace(/[^\d.]/g, '')) || 0;
    const imagePath = $(element).find('img').attr('src') || '';
    const image = imagePath.startsWith('http') ? imagePath : `${SCRAPE_HOST}${imagePath}`;
    const linkPath = $(element).find('a.title').attr('href') || '';
    const link = linkPath.startsWith('http') ? linkPath : `${SCRAPE_HOST}${linkPath}`;
    const ratingAttr = $(element).find('.ratings p').attr('data-rating');
    const rating = Number(ratingAttr || $(element).find('.ratings span').length) || 0;
    const brand = 'WebScrape';

    if (!keywordRegex || keywordRegex.test(title) || keywordRegex.test(description)) {
      products.push({ title, description, brand, price, rating, image, link });
    }
  });

  return products;
};

const scrapeProducts = async (req, res, next) => {
  try {
    const keyword = req.query.keyword || '';
    let scraped = [];

    for (const page of SCRAPE_PAGES) {
      const pageProducts = await scrapeProductPage(page, keyword);
      scraped = scraped.concat(pageProducts);
    }

    scraped = scraped.slice(0, 30).map(normalizeScrapedProduct);
    return ApiResponse.success(res, { products: scraped }, 'Scraped products loaded');
  } catch (error) {
    next(error);
  }
};

exports.scrapeProducts = scrapeProducts;

const buildSearchFilters = (query) => {
  const filters = {};
  if (query.keyword) {
    filters.$or = [
      { title: { $regex: query.keyword, $options: 'i' } },
      { description: { $regex: query.keyword, $options: 'i' } },
      { brand: { $regex: query.keyword, $options: 'i' } },
    ];
  }
  if (query.category) filters.category = query.category;
  if (query.brand) filters.brand = query.brand;
  if (query.minPrice || query.maxPrice) {
    filters.price = {};
    if (query.minPrice) filters.price.$gte = Number(query.minPrice);
    if (query.maxPrice) filters.price.$lte = Number(query.maxPrice);
  }
  if (query.rating) filters.rating = { $gte: Number(query.rating) };
  return filters;
};

exports.listProducts = async (req, res, next) => {
  try {
    const filters = buildSearchFilters(req.query);
    const sortMap = {
      price_low: { price: 1 },
      price_high: { price: -1 },
      best_rated: { rating: -1 },
      popular: { popularity: -1 },
    };
    const sort = sortMap[req.query.sort] || { createdAt: -1 };
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 16;
    const skip = (page - 1) * limit;

    const products = await Product.find(filters)
      .populate('category')
      .sort(sort)
      .skip(skip)
      .limit(limit);
    const total = await Product.countDocuments(filters);

    if (req.user) {
      await SearchHistory.create({
        user: req.user._id,
        query: req.query.keyword || '',
        category: req.query.category || '',
        brand: req.query.brand || '',
        minBudget: req.query.minPrice || 0,
        maxBudget: req.query.maxPrice || 0,
        resultsCount: products.length,
      });

      const budgetRange = `${req.query.minPrice || 0}-${req.query.maxPrice || 0}`;
      const recommended = await Product.find(filters).sort({ rating: -1, popularity: -1 }).limit(6);
      await Recommendation.create({
        user: req.user._id,
        budgetRange,
        preferences: req.user.preferences || [],
        recommendedProducts: recommended.map((item) => item._id),
        reason: 'Budget and preference boosted recommendations',
      });
    }

    return ApiResponse.success(res, {
      products,
      page,
      total,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('category reviews');
    if (!product) {
      return ApiResponse.error(res, 'Product not found', 404);
    }

    const similar = await Product.find({
      category: product.category._id,
      _id: { $ne: product._id },
    })
      .sort({ popularity: -1, rating: -1 })
      .limit(4);

    return ApiResponse.success(res, { product, similar });
  } catch (error) {
    next(error);
  }
};

exports.compareProducts = async (req, res, next) => {
  try {
    const ids = req.query.ids ? req.query.ids.split(',') : [];
    const products = await Product.find({ _id: { $in: ids } }).populate('category');
    return ApiResponse.success(res, { products }, 'Products loaded for comparison');
  } catch (error) {
    next(error);
  }
};

exports.addToWishlist = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOneAndUpdate(
      { user: req.user._id },
      { $addToSet: { products: req.params.productId } },
      { new: true, upsert: true }
    ).populate('products');
    return ApiResponse.success(res, { wishlist }, 'Added to wishlist');
  } catch (error) {
    next(error);
  }
};

exports.removeFromWishlist = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOneAndUpdate(
      { user: req.user._id },
      { $pull: { products: req.params.productId } },
      { new: true }
    ).populate('products');
    return ApiResponse.success(res, { wishlist }, 'Removed from wishlist');
  } catch (error) {
    next(error);
  }
};

exports.getWishlist = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products');
    return ApiResponse.success(res, { wishlist: wishlist ? wishlist.products : [] }, 'Wishlist loaded');
  } catch (error) {
    next(error);
  }
};

exports.addReview = async (req, res, next) => {
  try {
    const { rating, title, comment } = req.body;
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return ApiResponse.error(res, 'Product not found', 404);
    }

    const review = await Review.create({
      user: req.user._id,
      product: product._id,
      rating,
      title,
      comment,
    });

    product.reviews.push(review._id);
    product.rating = ((product.rating * product.reviews.length) + rating) / (product.reviews.length + 1);
    await product.save();

    return ApiResponse.success(res, { review }, 'Review added');
  } catch (error) {
    next(error);
  }
};
