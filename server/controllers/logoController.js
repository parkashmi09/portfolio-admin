const Logo = require('../models/Logo');

// @desc    Get all logos
// @route   GET /api/admin/logos
// @access  Private (Admin)
exports.getLogos = async (req, res) => {
  try {
    const logos = await Logo.find().sort({ uploadedAt: -1 });
    res.json(logos);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get a single logo by ID
// @route   GET /api/admin/logos/:id
// @access  Private (Admin)
exports.getLogoById = async (req, res) => {
  try {
    const logo = await Logo.findById(req.params.id);
    if (!logo) {
      return res.status(404).json({ msg: 'Logo not found' });
    }
    res.json(logo);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Logo not found' });
    }
    res.status(500).send('Server Error');
  }
};

// @desc    Create a logo
// @route   POST /api/admin/logos
// @access  Private (Admin)
// For actual file upload, you'd use middleware like multer here
exports.createLogo = async (req, res) => {
  const { name, imageUrl, altText } = req.body;
  try {
    const newLogo = new Logo({
      name,
      imageUrl, // This would typically be a URL after upload
      altText,
    });
    const logo = await newLogo.save();
    res.json(logo);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update a logo
// @route   PUT /api/admin/logos/:id
// @access  Private (Admin)
exports.updateLogo = async (req, res) => {
  const { name, imageUrl, altText } = req.body;
  const logoFields = {};
  if (name) logoFields.name = name;
  if (imageUrl) logoFields.imageUrl = imageUrl;
  if (altText) logoFields.altText = altText;

  try {
    let logo = await Logo.findById(req.params.id);
    if (!logo) return res.status(404).json({ msg: 'Logo not found' });

    logo = await Logo.findByIdAndUpdate(
      req.params.id,
      { $set: logoFields },
      { new: true }
    );
    res.json(logo);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Delete a logo
// @route   DELETE /api/admin/logos/:id
// @access  Private (Admin)
exports.deleteLogo = async (req, res) => {
  try {
    const logo = await Logo.findById(req.params.id);
    if (!logo) {
      return res.status(404).json({ msg: 'Logo not found' });
    }
    await Logo.findByIdAndRemove(req.params.id);
    res.json({ msg: 'Logo removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Logo not found' });
    }
    res.status(500).send('Server Error');
  }
}; 