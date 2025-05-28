const Service = require('../models/Service');

// @desc    Get all services
// @route   GET /api/admin/services
// @access  Private (Admin)
exports.getServices = async (req, res) => {
  try {
    const services = await Service.find()
      .sort({ createdAt: -1 })
      .select('-__v');
    res.json(services);
  } catch (err) {
    console.error('Error in getServices:', err.message);
    res.status(500).json({ message: 'Error fetching services' });
  }
};

// @desc    Get single service
// @route   GET /api/admin/services/:id
// @access  Private (Admin)
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).select('-__v');
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(service);
  } catch (err) {
    console.error('Error in getServiceById:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.status(500).json({ message: 'Error fetching service' });
  }
};

// @desc    Create a service
// @route   POST /api/admin/services
// @access  Private (Admin)
exports.createService = async (req, res) => {
  try {
    const { title, description, image, imagePublicId, icon, iconPublicId, pagePath } = req.body;

    // Validate required fields
    if (!title || !description || !image || !imagePublicId) {
      return res.status(400).json({
        message: 'Please provide all required fields: title, description, image, and imagePublicId'
      });
    }

    // Create new service
    const newService = new Service({
      title: title.trim(),
      description: description.trim(),
      image,
      imagePublicId,
      icon: icon || '',
      iconPublicId: iconPublicId || '',
      pagePath: pagePath || '',
      createdAt: new Date()
    });

    const service = await newService.save();
    res.status(201).json(service);
  } catch (err) {
    console.error('Error in createService:', err.message);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'Error creating service' });
  }
};

// @desc    Update a service
// @route   PUT /api/admin/services/:id
// @access  Private (Admin)
exports.updateService = async (req, res) => {
  try {
    const { title, description, image, imagePublicId, icon, iconPublicId, pagePath } = req.body;

    // Validate required fields
    if (!title || !description || !image || !imagePublicId) {
      return res.status(400).json({
        message: 'Please provide all required fields: title, description, image, and imagePublicId'
      });
    }

    // Find service and update
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Update fields
    service.title = title.trim();
    service.description = description.trim();
    service.image = image;
    service.imagePublicId = imagePublicId;
    service.icon = icon || '';
    service.iconPublicId = iconPublicId || '';
    service.pagePath = pagePath || '';

    const updatedService = await service.save();
    res.json(updatedService);
  } catch (err) {
    console.error('Error in updateService:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Service not found' });
    }
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'Error updating service' });
  }
};

// @desc    Delete a service
// @route   DELETE /api/admin/services/:id
// @access  Private (Admin)
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    await service.deleteOne();
    res.json({ message: 'Service deleted successfully' });
  } catch (err) {
    console.error('Error in deleteService:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.status(500).json({ message: 'Error deleting service' });
  }
}; 