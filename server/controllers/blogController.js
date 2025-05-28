const Blog = require('../models/Blog');

// @desc    Get all blogs
// @route   GET /api/admin/blogs
// @access  Public
exports.getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .sort({ createdAt: -1 })
      .select('-__v');
    res.json(blogs);
  } catch (err) {
    console.error('Error in getBlogs:', err.message);
    res.status(500).json({ message: 'Error fetching blogs' });
  }
};

// @desc    Get single blog
// @route   GET /api/admin/blogs/:id
// @access  Public
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).select('-__v');
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json(blog);
  } catch (err) {
    console.error('Error in getBlogById:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.status(500).json({ message: 'Error fetching blog' });
  }
};

// @desc    Create a blog
// @route   POST /api/admin/blogs
// @access  Public
exports.createBlog = async (req, res) => {
  try {
    const { title, content, imageUrl, imagePublicId, date } = req.body;

    // Validate required fields
    if (!title || !content || !imageUrl || !imagePublicId) {
      return res.status(400).json({
        message: 'Please provide all required fields: title, content, imageUrl, and imagePublicId'
      });
    }

    // Create new blog
    const newBlog = new Blog({
      title: title.trim(),
      content: content.trim(),
      imageUrl,
      imagePublicId,
      date: date || new Date(),
      createdAt: new Date()
    });

    const blog = await newBlog.save();
    res.status(201).json(blog);
  } catch (err) {
    console.error('Error in createBlog:', err.message);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'Error creating blog' });
  }
};

// @desc    Update a blog
// @route   PUT /api/admin/blogs/:id
// @access  Public
exports.updateBlog = async (req, res) => {
  try {
    const { title, content, imageUrl, imagePublicId, date } = req.body;

    // Validate required fields
    if (!title || !content || !imageUrl || !imagePublicId) {
      return res.status(400).json({
        message: 'Please provide all required fields: title, content, imageUrl, and imagePublicId'
      });
    }

    // Find blog and update
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Update fields
    blog.title = title.trim();
    blog.content = content.trim();
    blog.imageUrl = imageUrl;
    blog.imagePublicId = imagePublicId;
    blog.date = date || blog.date;

    const updatedBlog = await blog.save();
    res.json(updatedBlog);
  } catch (err) {
    console.error('Error in updateBlog:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Blog not found' });
    }
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'Error updating blog' });
  }
};

// @desc    Delete a blog
// @route   DELETE /api/admin/blogs/:id
// @access  Public
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    await blog.deleteOne();
    res.json({ message: 'Blog deleted successfully' });
  } catch (err) {
    console.error('Error in deleteBlog:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.status(500).json({ message: 'Error deleting blog' });
  }
}; 