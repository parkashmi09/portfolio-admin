const Review = require('../models/Review');

// @desc    Get all reviews (admin can see all, public might see only approved)
// @route   GET /api/admin/reviews
// @access  Private (Admin)
exports.getReviews = async (req, res) => {
  try {
    // Admin gets all reviews, sort by newest
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get a single review by ID
// @route   GET /api/admin/reviews/:id
// @access  Private (Admin)
exports.getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ msg: 'Review not found' });
    }
    res.json(review);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Review not found' });
    }
    res.status(500).send('Server Error');
  }
};

// @desc    Create a review (e.g. by a customer - could be a public route)
// @route   POST /api/reviews (Note: public route, not /admin)
// @access  Public
exports.createReview = async (req, res) => {
  const { reviewerName, rating, comment, productOrServiceId } = req.body;
  try {
    const newReview = new Review({
      reviewerName,
      rating,
      comment,
      productOrServiceId, // Make sure this ID is valid if provided
      status: 'pending', // Reviews start as pending
    });
    const review = await newReview.save();
    res.json(review); // Or a success message
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update a review (e.g., change status to approved/rejected by admin)
// @route   PUT /api/admin/reviews/:id
// @access  Private (Admin)
exports.updateReview = async (req, res) => {
  const { status, comment, rating } = req.body; // Admin might edit comment/rating too
  const reviewFields = {};
  if (status) reviewFields.status = status;
  if (comment) reviewFields.comment = comment;
  if (rating) reviewFields.rating = rating;

  try {
    let review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ msg: 'Review not found' });

    review = await Review.findByIdAndUpdate(
      req.params.id,
      { $set: reviewFields },
      { new: true }
    );
    res.json(review);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Delete a review
// @route   DELETE /api/admin/reviews/:id
// @access  Private (Admin)
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ msg: 'Review not found' });
    }
    await Review.findByIdAndRemove(req.params.id);
    res.json({ msg: 'Review removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Review not found' });
    }
    res.status(500).send('Server Error');
  }
};

// @desc    Get all approved reviews (Public access)
// @route   GET /api/reviews/approved
// @access  Public
exports.getApprovedReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ status: 'approved' }).sort({ createdAt: -1 });
        res.json(reviews);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}; 