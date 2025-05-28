const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  reviewerName: {
    type: String,
    required: true,
    trim: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
  },
  productOrServiceId: { // Optional: Link review to a specific product or service
    type: mongoose.Schema.Types.ObjectId,
    // ref: 'Product' or 'Service' - decide based on your needs
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Review', ReviewSchema); 