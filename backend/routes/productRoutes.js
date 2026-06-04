const express = require('express');
const router = express.Router();
const {
  listProducts,
  getProduct,
  compareProducts,
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  addReview,
  scrapeProducts,
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', listProducts);
router.get('/scrape', scrapeProducts);
router.get('/compare', protect, compareProducts);
router.get('/wishlist', protect, getWishlist);
router.get('/:id', getProduct);
router.post('/:productId/wishlist', protect, addToWishlist);
router.delete('/:productId/wishlist', protect, removeFromWishlist);
router.post('/:productId/review', protect, addReview);

module.exports = router;
