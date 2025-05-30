const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Product title is required'],
    trim: true
  },
  pagePath: {
    type: String,
    required: [true, 'Page path is required'],
    trim: true,
    unique: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true
  },
  // Main hero image
  heroImage: {
    url: {
      type: String,
      required: [true, 'Hero image URL is required']
    },
    publicId: {
      type: String,
      required: [true, 'Hero image public ID is required']
    }
  },
  // Product audio (optional)
  audio: {
    url: {
      type: String,
      default: ''
    },
    publicId: {
      type: String,
      default: ''
    }
  },
  // Call to action
  cta: {
    text: {
      type: String,
      default: 'Get Started'
    },
    secondaryText: {
      type: String,
      default: 'View Demo'
    }
  },
  // Live preview items
  previewItems: [{
    title: {
      type: String,
      trim: true
    },
    desktop: {
      url: {
        type: String
      },
      publicId: {
        type: String
      }
    },
    mobile: {
      url: {
        type: String
      },
      publicId: {
        type: String
      }
    }
  }],
  // Showcase items (zig-zag section)
  showcaseItems: [{
    title: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    desktop: {
      url: {
        type: String
      },
      publicId: {
        type: String
      }
    },
    mobile: {
      url: {
        type: String
      },
      publicId: {
        type: String
      }
    }
  }],
  // Meta
  active: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema); 