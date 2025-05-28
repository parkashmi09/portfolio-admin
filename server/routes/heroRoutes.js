const express = require('express');
const router = express.Router();
const {
  getHeroSlides,
  getHeroSlideById,
  createHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
  reorderHeroSlides
} = require('../controllers/heroController');

// Get all hero slides
router.get('/', getHeroSlides);

// Get single hero slide
router.get('/:id', getHeroSlideById);

// Create hero slide
router.post('/', createHeroSlide);

// Update hero slide
router.put('/:id', updateHeroSlide);

// Delete hero slide
router.delete('/:id', deleteHeroSlide);

// Reorder hero slides
router.put('/reorder', reorderHeroSlides);

module.exports = router; 