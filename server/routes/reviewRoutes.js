const express = require('express');
const router = express.Router();
const { getReviews, getReviewById, createReview, updateReview, deleteReview, getApprovedReviews } = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes for reviews
router.post('/public', createReview);         // Endpoint for submitting a new review
router.get('/public/approved', getApprovedReviews); // Endpoint for fetching approved reviews

// Admin routes - all routes below are protected
router.use(authMiddleware);

router.route('/').get(getReviews); // Admin gets all reviews
router.route('/:id')
  .get(getReviewById)       // Admin gets a specific review
  .put(updateReview)        // Admin updates a review (e.g., status)
  .delete(deleteReview);     // Admin deletes a review

module.exports = router; 