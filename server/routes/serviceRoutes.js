const express = require('express');
const router = express.Router();
const {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService
} = require('../controllers/serviceController');

// @route   GET /api/admin/services
// @desc    Get all services
// @access  Public
router.get('/', getServices);

// @route   GET /api/admin/services/:id
// @desc    Get single service
// @access  Public
router.get('/:id', getServiceById);

// @route   POST /api/admin/services
// @desc    Create a service
// @access  Public
router.post('/', createService);

// @route   PUT /api/admin/services/:id
// @desc    Update a service
// @access  Public
router.put('/:id', updateService);

// @route   DELETE /api/admin/services/:id
// @desc    Delete a service
// @access  Public
router.delete('/:id', deleteService);

module.exports = router; 