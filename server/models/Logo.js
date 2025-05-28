const mongoose = require('mongoose');

const LogoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  imageUrl: {
    type: String,
    required: true,
  },
  altText: {
    type: String,
    default: 'Logo image'
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Logo', LogoSchema); 