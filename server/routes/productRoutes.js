const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  reorderProducts,
  addPreviewItem,
  addShowcaseItem
} = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');

// router.use(authMiddleware);

router.route('/').get(getProducts).post(createProduct);
router.route('/:id').get(getProductById).put(updateProduct).delete(deleteProduct);

// Reorder products
router.put('/reorder', reorderProducts);

// Add preview item to product
router.post('/:id/preview', addPreviewItem);

// Add showcase item to product
router.post('/:id/showcase', addShowcaseItem);

module.exports = router; 