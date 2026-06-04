const express = require('express');
const router = express.Router();
const { addProduct, updateProduct, deleteProduct, bulkUpload, analytics } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/products', protect, admin, addProduct);
router.put('/products/:id', protect, admin, updateProduct);
router.delete('/products/:id', protect, admin, deleteProduct);
router.post('/products/bulk-upload', protect, admin, upload.single('file'), bulkUpload);
router.get('/analytics', protect, admin, analytics);

module.exports = router;
