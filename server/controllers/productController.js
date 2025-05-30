const Product = require('../models/Product');

// @desc    Get all products
// @route   GET /api/admin/products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .sort({ order: 1, createdAt: -1 })
      .select('-__v');
    res.json(products);
  } catch (err) {
    console.error('Error in getProducts:', err.message);
    res.status(500).json({ message: 'Error fetching products' });
  }
};

// @desc    Get single product
// @route   GET /api/admin/products/:id
// @access  Public
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).select('-__v');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    console.error('Error in getProductById:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(500).json({ message: 'Error fetching product' });
  }
};

// @desc    Create a product
// @route   POST /api/admin/products
// @access  Public
exports.createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      heroImage,
      audio,
      cta,
      features,
      previewItems,
      showcaseItems,
      active,
      order,
      pagePath
    } = req.body;

    // Validate required fields
    if (!title || !description || !heroImage || !heroImage.url || !heroImage.publicId || !pagePath) {
      return res.status(400).json({
        message: 'Please provide all required fields: title, description, heroImage, and pagePath'
      });
    }

    // Create new product
    const newProduct = new Product({
      title: title.trim(),
      description: description.trim(),
      pagePath: pagePath.trim(),
      heroImage,
      audio: audio || { url: '', publicId: '' },
      cta: cta || { text: 'Get Started', secondaryText: 'View Demo' },
      features: features || [],
      previewItems: previewItems || [],
      showcaseItems: showcaseItems || [],
      active: active !== undefined ? active : true,
      order: order || 0,
      createdAt: new Date()
    });

    const product = await newProduct.save();
    res.status(201).json(product);
  } catch (err) {
    console.error('Error in createProduct:', err.message);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'Error creating product' });
  }
};

// @desc    Update a product
// @route   PUT /api/admin/products/:id
// @access  Public
exports.updateProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      heroImage,
      audio,
      cta,
      features,
      previewItems,
      showcaseItems,
      active,
      order,
      pagePath
    } = req.body;

    // Validate required fields
    if (!title || !description || !heroImage || !heroImage.url || !heroImage.publicId || !pagePath) {
      return res.status(400).json({
        message: 'Please provide all required fields: title, description, heroImage, and pagePath'
      });
    }

    // Find product and update
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update fields
    product.title = title.trim();
    product.description = description.trim();
    product.pagePath = pagePath.trim();
    product.heroImage = heroImage;
    product.audio = audio || { url: '', publicId: '' };
    product.cta = cta || { text: 'Get Started', secondaryText: 'View Demo' };
    product.features = features || [];
    product.previewItems = previewItems || [];
    product.showcaseItems = showcaseItems || [];
    product.active = active !== undefined ? active : product.active;
    product.order = order !== undefined ? order : product.order;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (err) {
    console.error('Error in updateProduct:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Product not found' });
    }
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'Error updating product' });
  }
};

// @desc    Delete a product
// @route   DELETE /api/admin/products/:id
// @access  Public
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.deleteOne();
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Error in deleteProduct:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(500).json({ message: 'Error deleting product' });
  }
};

// @desc    Update product order
// @route   PUT /api/admin/products/reorder
// @access  Public
exports.reorderProducts = async (req, res) => {
  try {
    const { products } = req.body;

    if (!Array.isArray(products)) {
      return res.status(400).json({ message: 'Products must be an array' });
    }

    // Update each product's order
    const updatePromises = products.map((product) => 
      Product.findByIdAndUpdate(
        product._id,
        { order: product.order },
        { new: true }
      )
    );

    await Promise.all(updatePromises);
    res.json({ message: 'Products reordered successfully' });
  } catch (err) {
    console.error('Error in reorderProducts:', err.message);
    res.status(500).json({ message: 'Error reordering products' });
  }
};

// @desc    Add preview item to product
// @route   POST /api/admin/products/:id/preview
// @access  Public
exports.addPreviewItem = async (req, res) => {
  try {
    const { title, desktop, mobile } = req.body;
    
    if (!title || !desktop || !desktop.url || !desktop.publicId) {
      return res.status(400).json({
        message: 'Please provide title and desktop image details'
      });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.previewItems.push({
      title,
      desktop,
      mobile: mobile || { url: '', publicId: '' }
    });

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (err) {
    console.error('Error in addPreviewItem:', err.message);
    res.status(500).json({ message: 'Error adding preview item' });
  }
};

// @desc    Add showcase item to product
// @route   POST /api/admin/products/:id/showcase
// @access  Public
exports.addShowcaseItem = async (req, res) => {
  try {
    const { title, description, desktop, mobile } = req.body;
    
    if (!title || !description || !desktop || !desktop.url || !desktop.publicId) {
      return res.status(400).json({
        message: 'Please provide title, description, and desktop image details'
      });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.showcaseItems.push({
      title,
      description,
      desktop,
      mobile: mobile || { url: '', publicId: '' }
    });

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (err) {
    console.error('Error in addShowcaseItem:', err.message);
    res.status(500).json({ message: 'Error adding showcase item' });
  }
}; 