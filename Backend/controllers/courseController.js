// backend/controllers/courseController.js (Complete Working Version)
const Course = require('../models/Course');
const User = require('../models/User');
const Enrollment = require('../models/Enrollment');

// @desc    Get all courses
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find({ status: 'published' })
      .populate('instructor', 'name')
      .limit(10);
    
    res.json({
      success: true,
      count: courses.length,
      courses
    });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching courses'
    });
  }
};

// @desc    Get featured courses
exports.getFeaturedCourses = async (req, res) => {
  try {
    const courses = await Course.find({ status: 'published', featured: true })
      .populate('instructor', 'name')
      .limit(8);
    
    res.json({
      success: true,
      count: courses.length,
      courses
    });
  } catch (error) {
    console.error('Get featured courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching featured courses'
    });
  }
};

// @desc    Get single course details
exports.getCourseDetail = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name email');
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    res.json({
      success: true,
      course
    });
  } catch (error) {
    console.error('Get course detail error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching course details'
    });
  }
};

// @desc    Enroll in a course
exports.enrollCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      student: req.user.id,
      course: req.params.id
    });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: 'Already enrolled in this course'
      });
    }

    // Create enrollment
    const enrollment = await Enrollment.create({
      student: req.user.id,
      course: req.params.id
    });

    res.status(201).json({
      success: true,
      message: 'Successfully enrolled in course',
      enrollment
    });
  } catch (error) {
    console.error('Enroll course error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error enrolling in course'
    });
  }
};

// @desc    Get user's enrolled courses
exports.getMyCourses = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user.id })
      .populate({
        path: 'course',
        populate: { path: 'instructor', select: 'name' }
      });

    const courses = enrollments.map(enrollment => ({
      ...enrollment.course.toObject(),
      progress: enrollment.progress || 0
    }));

    res.json({
      success: true,
      count: courses.length,
      courses
    });
  } catch (error) {
    console.error('Get my courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching your courses'
    });
  }
};

// @desc    Get course progress
exports.getCourseProgress = async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({
      student: req.user.id,
      course: req.params.id
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    res.json({
      success: true,
      progress: enrollment.progress || 0,
      completedLectures: enrollment.completedLectures || []
    });
  } catch (error) {
    console.error('Get course progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching course progress'
    });
  }
};

// @desc    Update course progress
exports.updateCourseProgress = async (req, res) => {
  try {
    const { progress, completedLectures } = req.body;

    const enrollment = await Enrollment.findOneAndUpdate(
      {
        student: req.user.id,
        course: req.params.id
      },
      {
        progress: progress || 0,
        completedLectures: completedLectures || [],
        lastAccessed: new Date()
      },
      { new: true }
    );

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    res.json({
      success: true,
      message: 'Progress updated successfully',
      progress: enrollment.progress
    });
  } catch (error) {
    console.error('Update course progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating course progress'
    });
  }
};

// @desc    Get user's wishlist
exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'wishlist',
      populate: { path: 'instructor', select: 'name' }
    });

    res.json({
      success: true,
      wishlist: user.wishlist || []
    });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching wishlist'
    });
  }
};

// @desc    Add course to wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: 'Course ID is required'
      });
    }

    const user = await User.findById(req.user.id);
    
    if (user.wishlist.includes(courseId)) {
      return res.status(400).json({
        success: false,
        message: 'Course already in wishlist'
      });
    }

    user.wishlist.push(courseId);
    await user.save();

    res.json({
      success: true,
      message: 'Course added to wishlist'
    });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error adding to wishlist'
    });
  }
};

// @desc    Remove course from wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const { courseId } = req.params;

    const user = await User.findById(req.user.id);
    user.wishlist = user.wishlist.filter(id => id.toString() !== courseId);
    await user.save();

    res.json({
      success: true,
      message: 'Course removed from wishlist'
    });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error removing from wishlist'
    });
  }
};