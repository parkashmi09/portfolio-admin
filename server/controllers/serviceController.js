const Service = require('../models/Service');

// @desc    Get all services
// @route   GET /api/admin/services
// @access  Private (Admin)
exports.getServices = async (req, res) => {
  try {
    const services = await Service.find()
      .sort({ order: 1, createdAt: -1 })
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
    const {
      title,
      description,
      image,
      imagePublicId,
      icon,
      iconPublicId,
      pagePath,
      slides,
      overview,
      overviewCards,
      keyFeatures,
      benefits,
      active,
      order
    } = req.body;

    // Validate required fields
    if (!title || !description || !image || !imagePublicId) {
      return res.status(400).json({
        message: 'Please provide all required fields: title, description, image, and imagePublicId'
      });
    }

    // Validate slides if provided
    if (slides && Array.isArray(slides)) {
      for (const slide of slides) {
        if (!slide.title || !slide.content || !slide.image?.url || !slide.image?.publicId) {
          return res.status(400).json({
            message: 'Each slide must have a title, content, and image (with url and publicId)'
          });
        }
      }
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
      slides: slides || [],
      overview: overview || { title: '', subtitle: '', items: [] },
      overviewCards: overviewCards || [],
      keyFeatures: keyFeatures || [],
      benefits: benefits || [],
      active: active !== undefined ? active : true,
      order: order || 0,
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
    const {
      title,
      description,
      image,
      imagePublicId,
      icon,
      iconPublicId,
      pagePath,
      slides,
      overview,
      overviewCards,
      keyFeatures,
      benefits,
      active,
      order
    } = req.body;

    // Validate required fields
    if (!title || !description || !image || !imagePublicId) {
      return res.status(400).json({
        message: 'Please provide all required fields: title, description, image, and imagePublicId'
      });
    }

    // Validate slides if provided
    if (slides && Array.isArray(slides)) {
      for (const slide of slides) {
        if (!slide.title || !slide.content || !slide.image?.url || !slide.image?.publicId) {
          return res.status(400).json({
            message: 'Each slide must have a title, content, and image (with url and publicId)'
          });
        }
      }
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
    service.slides = slides || service.slides;
    service.overview = overview || service.overview;
    service.overviewCards = overviewCards || service.overviewCards;
    service.keyFeatures = keyFeatures || service.keyFeatures;
    service.benefits = benefits || service.benefits;
    service.active = active !== undefined ? active : service.active;
    service.order = order !== undefined ? order : service.order;

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

    // Delete all associated images from Cloudinary
    // Main image and icon
    if (service.imagePublicId) {
      await deleteFromCloudinary(service.imagePublicId);
    }
    if (service.iconPublicId) {
      await deleteFromCloudinary(service.iconPublicId);
    }

    // Slides images and icons
    for (const slide of service.slides || []) {
      if (slide.image?.publicId) {
        await deleteFromCloudinary(slide.image.publicId);
      }
      if (slide.icon?.publicId) {
        await deleteFromCloudinary(slide.icon.publicId);
      }
    }

    // Overview cards images
    for (const card of service.overviewCards || []) {
      if (card.image?.publicId) {
        await deleteFromCloudinary(card.image.publicId);
      }
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

// @desc    Reorder services
// @route   PUT /api/admin/services/reorder
// @access  Private (Admin)
exports.reorderServices = async (req, res) => {
  try {
    const { services } = req.body;

    if (!Array.isArray(services)) {
      return res.status(400).json({ message: 'Services must be an array' });
    }

    // Update each service's order
    const updatePromises = services.map((service) => 
      Service.findByIdAndUpdate(
        service._id,
        { order: service.order },
        { new: true }
      )
    );

    await Promise.all(updatePromises);
    res.json({ message: 'Services reordered successfully' });
  } catch (err) {
    console.error('Error in reorderServices:', err.message);
    res.status(500).json({ message: 'Error reordering services' });
  }
}; 