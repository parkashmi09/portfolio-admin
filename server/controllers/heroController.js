const Hero = require('../models/Hero');

// @desc    Get all hero slides
// @route   GET /api/admin/hero
// @access  Public
exports.getHeroSlides = async (req, res) => {
  try {
    const slides = await Hero.find({ active: true })
      .sort({ order: 1, createdAt: -1 })
      .select('-__v');
    res.json(slides);
  } catch (err) {
    console.error('Error in getHeroSlides:', err.message);
    res.status(500).json({ message: 'Error fetching hero slides' });
  }
};

// @desc    Get single hero slide
// @route   GET /api/admin/hero/:id
// @access  Public
exports.getHeroSlideById = async (req, res) => {
  try {
    const slide = await Hero.findById(req.params.id).select('-__v');
    if (!slide) {
      return res.status(404).json({ message: 'Hero slide not found' });
    }
    res.json(slide);
  } catch (err) {
    console.error('Error in getHeroSlideById:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Hero slide not found' });
    }
    res.status(500).json({ message: 'Error fetching hero slide' });
  }
};

// @desc    Create a hero slide
// @route   POST /api/admin/hero
// @access  Public
exports.createHeroSlide = async (req, res) => {
  try {
    const {
      title,
      content,
      imageUrl,
      imagePublicId,
      logo,
      cta,
      location,
      date,
      hasLocation,
      order,
      active
    } = req.body;

    // Validate required fields
    if (!title || !content || !imageUrl || !imagePublicId || !cta) {
      return res.status(400).json({
        message: 'Please provide all required fields: title, content, imageUrl, imagePublicId, and cta'
      });
    }

    // Create new hero slide
    const newSlide = new Hero({
      title: title.trim(),
      content: content.trim(),
      imageUrl,
      imagePublicId,
      logo: logo || '',
      cta: cta.trim(),
      location: location || '',
      date: date || '',
      hasLocation: hasLocation || false,
      order: order || 0,
      active: active !== undefined ? active : true,
      createdAt: new Date()
    });

    const slide = await newSlide.save();
    res.status(201).json(slide);
  } catch (err) {
    console.error('Error in createHeroSlide:', err.message);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'Error creating hero slide' });
  }
};

// @desc    Update a hero slide
// @route   PUT /api/admin/hero/:id
// @access  Public
exports.updateHeroSlide = async (req, res) => {
  try {
    const {
      title,
      content,
      imageUrl,
      imagePublicId,
      logo,
      cta,
      location,
      date,
      hasLocation,
      order,
      active
    } = req.body;

    // Validate required fields
    if (!title || !content || !imageUrl || !imagePublicId || !cta) {
      return res.status(400).json({
        message: 'Please provide all required fields: title, content, imageUrl, imagePublicId, and cta'
      });
    }

    // Find slide and update
    const slide = await Hero.findById(req.params.id);
    if (!slide) {
      return res.status(404).json({ message: 'Hero slide not found' });
    }

    // Update fields
    slide.title = title.trim();
    slide.content = content.trim();
    slide.imageUrl = imageUrl;
    slide.imagePublicId = imagePublicId;
    slide.logo = logo || '';
    slide.cta = cta.trim();
    slide.location = location || '';
    slide.date = date || '';
    slide.hasLocation = hasLocation || false;
    slide.order = order || slide.order;
    slide.active = active !== undefined ? active : slide.active;

    const updatedSlide = await slide.save();
    res.json(updatedSlide);
  } catch (err) {
    console.error('Error in updateHeroSlide:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Hero slide not found' });
    }
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'Error updating hero slide' });
  }
};

// @desc    Delete a hero slide
// @route   DELETE /api/admin/hero/:id
// @access  Public
exports.deleteHeroSlide = async (req, res) => {
  try {
    const slide = await Hero.findById(req.params.id);
    if (!slide) {
      return res.status(404).json({ message: 'Hero slide not found' });
    }

    await slide.deleteOne();
    res.json({ message: 'Hero slide deleted successfully' });
  } catch (err) {
    console.error('Error in deleteHeroSlide:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Hero slide not found' });
    }
    res.status(500).json({ message: 'Error deleting hero slide' });
  }
};

// @desc    Update hero slides order
// @route   PUT /api/admin/hero/reorder
// @access  Public
exports.reorderHeroSlides = async (req, res) => {
  try {
    const { slides } = req.body;

    if (!Array.isArray(slides)) {
      return res.status(400).json({ message: 'Slides must be an array' });
    }

    // Update each slide's order
    const updatePromises = slides.map((slide) => 
      Hero.findByIdAndUpdate(
        slide._id,
        { order: slide.order },
        { new: true }
      )
    );

    await Promise.all(updatePromises);
    res.json({ message: 'Slides reordered successfully' });
  } catch (err) {
    console.error('Error in reorderHeroSlides:', err.message);
    res.status(500).json({ message: 'Error reordering slides' });
  }
}; 