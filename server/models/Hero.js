const mongoose = require('mongoose');

const heroSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    trim: true
  },
  imageUrl: {
    type: String,
    required: [true, 'Image URL is required']
  },
  imagePublicId: {
    type: String,
    required: [true, 'Image public ID is required']
  },
  logo: {
    type: String,
    default: ''
  },
  cta: {
    type: String,
    required: [true, 'CTA text is required'],
    trim: true
  },
  location: {
    type: String,
    default: ''
  },
  date: {
    type: String,
    default: ''
  },
  hasLocation: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  },
  active: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Hero', heroSchema); 