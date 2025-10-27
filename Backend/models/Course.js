// backend/models/Course.js (Updated for Cloudinary)
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  subtitle: {
    type: String,
    required: [true, 'Course subtitle is required'],
    trim: true,
    maxlength: [200, 'Subtitle cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Course description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['development', 'business', 'design', 'marketing', 'it', 'music']
  },
  level: {
    type: String,
    required: [true, 'Level is required'],
    enum: ['all', 'beginner', 'intermediate', 'advanced'],
    default: 'all'
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
    max: [1000, 'Price cannot exceed $1000']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative'],
    max: [1000, 'Original price cannot exceed $1000']
  },
  
  // UPDATED: Thumbnail field for Cloudinary
  thumbnail: {
    url: {
      type: String,
      required: [true, 'Thumbnail URL is required'],
      validate: {
        validator: function(v) {
          return /^https?:\/\/.+\..+/.test(v);
        },
        message: 'Please provide a valid thumbnail URL'
      }
    },
    publicId: {
      type: String,
      required: true
    }
  },
  
  // UPDATED: Promo video field for Cloudinary
  promoVideo: {
    url: {
      type: String,
      validate: {
        validator: function(v) {
          if (!v) return true; // Optional field
          return /^https?:\/\/.+\..+/.test(v);
        },
        message: 'Please provide a valid video URL'
      }
    },
    publicId: String, // Store Cloudinary public_id
    thumbnail: String, // Store auto-generated thumbnail from Cloudinary
    duration: Number, // Store video duration in seconds
    format: String, // Store video format (mp4, webm, etc.)
    size: Number // Store file size in bytes
  },
  
  requirements: [{
    type: String,
    trim: true
  }],
  learningOutcomes: [{
    type: String,
    trim: true
  }],
  
  // UPDATED: Sections and lectures for Cloudinary
  sections: [{
    title: {
      type: String,
      required: true,
      trim: true
    },
    lectures: [{
      title: {
        type: String,
        required: true,
        trim: true
      },
      // UPDATED: Lecture video for Cloudinary
      video: {
        url: {
          type: String,
          required: true
        },
        publicId: {
          type: String,
          required: true
        },
        thumbnail: String,
        duration: {
          type: Number, // in seconds
          required: true,
          min: [1, 'Duration must be at least 1 second']
        },
        format: String,
        size: Number
      },
      description: {
        type: String,
        trim: true
      },
      resources: [{
        name: String,
        url: String
      }]
    }]
  }],
  
  status: {
    type: String,
    enum: ['draft', 'published', 'unpublished'],
    default: 'draft'
  },
  featured: {
    type: Boolean,
    default: false
  },
  bestseller: {
    type: Boolean,
    default: false
  },
  studentsCount: {
    type: Number,
    default: 0
  },
  averageRating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be less than 0'],
    max: [5, 'Rating cannot exceed 5']
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  totalLectures: {
    type: Number,
    default: 0
  },
  totalDuration: {
    type: Number, // in minutes
    default: 0
  },
  discount: {
    type: Number,
    default: 0,
    min: [0, 'Discount cannot be negative'],
    max: [100, 'Discount cannot exceed 100%']
  }
}, {
  timestamps: true
});

// Calculate total lectures and duration before saving
courseSchema.pre('save', function(next) {
  if (this.sections && this.sections.length > 0) {
    this.totalLectures = this.sections.reduce((total, section) => {
      return total + (section.lectures ? section.lectures.length : 0);
    }, 0);
    
    // Convert seconds to minutes for total duration
    this.totalDuration = this.sections.reduce((total, section) => {
      const sectionDuration = section.lectures ? section.lectures.reduce((secTotal, lecture) => {
        const durationInMinutes = Math.ceil((lecture.video?.duration || 0) / 60);
        return secTotal + durationInMinutes;
      }, 0) : 0;
      return total + sectionDuration;
    }, 0);
  }
  
  // Calculate discount percentage if originalPrice is set
  if (this.originalPrice && this.originalPrice > this.price) {
    this.discount = Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  
  next();
});

// Virtual for checking if course has promo video
courseSchema.virtual('hasPromoVideo').get(function() {
  return !!(this.promoVideo && this.promoVideo.url);
});

// Virtual for getting video duration in minutes
courseSchema.virtual('promoVideoDurationMinutes').get(function() {
  if (!this.promoVideo || !this.promoVideo.duration) return 0;
  return Math.ceil(this.promoVideo.duration / 60);
});

// Method to update video information
courseSchema.methods.updateVideoInfo = function(videoData) {
  if (videoData.publicId) {
    this.promoVideo = {
      url: videoData.url,
      publicId: videoData.publicId,
      thumbnail: videoData.thumbnail,
      duration: videoData.duration,
      format: videoData.format,
      size: videoData.size
    };
  }
  return this.save();
};

// Method to remove promo video
courseSchema.methods.removePromoVideo = function() {
  this.promoVideo = undefined;
  return this.save();
};

// Static method to find courses by video publicId
courseSchema.statics.findByVideoPublicId = function(publicId) {
  return this.find({
    $or: [
      { 'promoVideo.publicId': publicId },
      { 'sections.lectures.video.publicId': publicId }
    ]
  });
};

// Index for better search performance
courseSchema.index({ title: 'text', description: 'text' });
courseSchema.index({ category: 1, status: 1 });
courseSchema.index({ instructor: 1 });
courseSchema.index({ averageRating: -1 });
courseSchema.index({ studentsCount: -1 });
// NEW: Index for video searches
courseSchema.index({ 'promoVideo.publicId': 1 });
courseSchema.index({ 'sections.lectures.video.publicId': 1 });

module.exports = mongoose.model('Course', courseSchema);