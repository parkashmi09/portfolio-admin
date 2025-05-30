const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  imagePublicId: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
  },
  iconPublicId: {
    type: String,
  },
  pagePath: {
    type: String,
    trim: true,
    default: '',
  },
  // Hero Slides Section
  slides: [{
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    image: {
      url: {
        type: String,
        required: true,
      },
      publicId: {
        type: String,
        required: true,
      }
    },
    icon: {
      url: {
        type: String,
        required: true,
      },
      publicId: {
        type: String,
        required: true,
      }
    },
    cta: {
      type: String,
      default: 'Get Started',
    },
    hasLocation: {
      type: Boolean,
      default: false,
    }
  }],
  // Overview Section
  overview: {
    title: {
      type: String,
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
    },
    items: [{
      title: {
        type: String,
        required: true,
        trim: true,
      },
      description: {
        type: String,
        required: true,
      },
      icon: {
        type: String,
        required: true,
      }
    }]
  },
  // Overview Cards Section
  overviewCards: [{
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      url: {
        type: String,
        required: true,
      },
      publicId: {
        type: String,
        required: true,
      }
    }
  }],
  // Key Features Section
  keyFeatures: [{
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    }
  }],
  // Benefits Section
  benefits: [{
    type: String,
    required: true,
    trim: true,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  active: {
    type: Boolean,
    default: true,
  },
  order: {
    type: Number,
    default: 0,
  }
});

module.exports = mongoose.model('Service', ServiceSchema); 