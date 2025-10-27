// backend/middlewares/authMiddleware.js (Fixed)
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @desc    Verify JWT token and protect routes
// @access  Private
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Check for token in cookies (alternative)
    else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route. No token provided.'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
      
      // Get user from token
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized. User not found.'
        });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. Invalid token.'
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error in authentication'
    });
  }
};

// @desc    Authorize roles (middleware factory)
// @access  Private
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route. Required roles: ${roles.join(', ')}`
      });
    }

    next();
  };
};

// @desc    Optional auth - doesn't fail if no token, but attaches user if valid
// @access  Optional
exports.optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
      const user = await User.findById(decoded.id).select('-password');
      
      // REMOVED: isActive check
      if (user) {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    // Continue without user if token is invalid
    next();
  }
};

// @desc    Check if user is course instructor
// @access  Private (Instructor)
exports.authorizeInstructor = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    if (req.user.role !== 'Instructor') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Instructor role required.'
      });
    }

    // REMOVED: isInstructorActive check since User model doesn't have this field
    // if (!req.user.isInstructorActive) {
    //   return res.status(403).json({
    //     success: false,
    //     message: 'Instructor account is not active. Please contact support.'
    //   });
    // }

    next();
  } catch (error) {
    console.error('Authorize instructor error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error in instructor authorization'
    });
  }
};

// @desc    Check if user is admin
// @access  Private (Admin)
exports.authorizeAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    if (req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
    }

    next();
  } catch (error) {
    console.error('Authorize admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error in admin authorization'
    });
  }
};

// @desc    Check course ownership (instructor owns the course)
// @access  Private (Instructor)
exports.authorizeCourseOwner = async (req, res, next) => {
  try {
    const Course = require('../models/Course');
    const courseId = req.params.id || req.params.courseId;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: 'Course ID is required'
      });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if user is the course instructor
    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this course'
      });
    }

    req.course = course;
    next();
  } catch (error) {
    console.error('Authorize course owner error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error in course ownership check'
    });
  }
};

// @desc    Check if user is enrolled in course
// @access  Private (Student)
exports.checkEnrollment = async (req, res, next) => {
  try {
    const Enrollment = require('../models/Enrollment');
    const courseId = req.params.id || req.params.courseId;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: 'Course ID is required'
      });
    }

    // Allow instructors who own the course to access content
    const Course = require('../models/Course');
    const course = await Course.findById(courseId);
    
    if (course && course.instructor.toString() === req.user.id) {
      return next();
    }

    // Check enrollment for students
    const enrollment = await Enrollment.findOne({
      student: req.user.id,
      course: courseId
    });

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Please enroll in the course to view content.'
      });
    }

    req.enrollment = enrollment;
    next();
  } catch (error) {
    console.error('Check enrollment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error checking enrollment'
    });
  }
};