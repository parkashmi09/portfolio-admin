const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  service: {
    type: String,
  },
  message: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  source: {
    type: String,
    enum: ['Google', 'Social Media', 'Referral', 'Direct', 'Other'],
    default: 'Direct'
  }
});

// Check if the model exists before compiling it
module.exports = mongoose.models.Contact || mongoose.model('Contact', contactSchema);