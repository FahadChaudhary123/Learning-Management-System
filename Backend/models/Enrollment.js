// backend/models/Enrollment.js
const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  enrolledAt: {
    type: Date,
    default: Date.now
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  completedLectures: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lecture'
  }],
  currentLecture: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lecture'
  },
  lastAccessed: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  review: {
    type: String,
    trim: true,
    maxlength: 500
  },
  reviewedAt: {
    type: Date
  },
  certificateIssued: {
    type: Boolean,
    default: false
  },
  certificateIssuedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Compound index to ensure a student can only enroll once in a course
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

// Index for better query performance
enrollmentSchema.index({ student: 1 });
enrollmentSchema.index({ course: 1 });
enrollmentSchema.index({ enrolledAt: -1 });

// Virtual for checking if course is completed
enrollmentSchema.virtual('isCompleted').get(function() {
  return this.progress === 100;
});

// Method to update progress
enrollmentSchema.methods.updateProgress = function(completedLecturesCount, totalLecturesCount) {
  if (totalLecturesCount > 0) {
    this.progress = Math.round((completedLecturesCount / totalLecturesCount) * 100);
    this.lastAccessed = new Date();
    
    if (this.progress === 100 && !this.completedAt) {
      this.completedAt = new Date();
      this.certificateIssued = true;
      this.certificateIssuedAt = new Date();
    }
  }
  return this.save();
};

// Method to mark lecture as completed
enrollmentSchema.methods.markLectureCompleted = function(lectureId) {
  if (!this.completedLectures.includes(lectureId)) {
    this.completedLectures.push(lectureId);
  }
  this.currentLecture = lectureId;
  this.lastAccessed = new Date();
  return this.save();
};

// Method to add review
enrollmentSchema.methods.addReview = function(rating, review) {
  this.rating = rating;
  this.review = review;
  this.reviewedAt = new Date();
  return this.save();
};

// Static method to get enrollment stats for a course
enrollmentSchema.statics.getCourseStats = async function(courseId) {
  const stats = await this.aggregate([
    { $match: { course: mongoose.Types.ObjectId(courseId) } },
    {
      $group: {
        _id: '$course',
        totalEnrollments: { $sum: 1 },
        averageProgress: { $avg: '$progress' },
        completedCount: { $sum: { $cond: [{ $eq: ['$progress', 100] }, 1, 0] } },
        averageRating: { $avg: '$rating' }
      }
    }
  ]);
  
  return stats[0] || {
    totalEnrollments: 0,
    averageProgress: 0,
    completedCount: 0,
    averageRating: 0
  };
};

module.exports = mongoose.model('Enrollment', enrollmentSchema);