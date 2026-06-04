const express = require('express');
const router = express.Router();
const {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const { protect, admin } = require('../middleware/authMiddleware');
const { validateBody } = require('../middleware/validateMiddleware');
const { categorySchema } = require('../utils/validators');

router.get('/', listCategories);
router.post('/', protect, admin, validateBody(categorySchema), createCategory);
router.put('/:id', protect, admin, validateBody(categorySchema), updateCategory);
router.delete('/:id', protect, admin, deleteCategory);

module.exports = router;
