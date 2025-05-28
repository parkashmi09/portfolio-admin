const express = require('express');
const router = express.Router();
const {
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog
} = require('../controllers/blogController');

// @route   GET /api/admin/blogs
// @desc    Get all blogs
// @access  Public
router.get('/', getBlogs);

// @route   GET /api/admin/blogs/:id
// @desc    Get single blog
// @access  Public
router.get('/:id', getBlogById);

// @route   POST /api/admin/blogs
// @desc    Create a blog
// @access  Public
router.post('/', createBlog);

// @route   PUT /api/admin/blogs/:id
// @desc    Update a blog
// @access  Public
router.put('/:id', updateBlog);

// @route   DELETE /api/admin/blogs/:id
// @desc    Delete a blog
// @access  Public
router.delete('/:id', deleteBlog);

module.exports = router; 