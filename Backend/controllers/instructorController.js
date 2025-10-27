// backend/controllers/instructorController.js
const Course = require('../models/Course');
const User = require('../models/User');
const Enrollment = require('../models/Enrollment');

// @desc    Get instructor dashboard
// @route   GET /api/instructor/dashboard
// @access  Private (Instructor)
exports.getInstructorDashboard = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user.id });
    
    // Calculate stats
    const totalCourses = courses.length;
    const totalStudents = courses.reduce((sum, course) => sum + course.studentsCount, 0);
    const totalRevenue = courses.reduce((sum, course) => sum + (course.price * course.studentsCount), 0);
    const averageRating = courses.length > 0 
      ? courses.reduce((sum, course) => sum + course.averageRating, 0) / courses.length 
      : 0;

    res.json({
      success: true,
      stats: {
        totalCourses,
        totalStudents,
        totalRevenue,
        averageRating: parseFloat(averageRating.toFixed(1))
      },
      recentCourses: courses.slice(0, 5)
    });
  } catch (error) {
    console.error('Get instructor dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching dashboard data'
    });
  }
};

// @desc    Get instructor's courses
// @route   GET /api/instructor/courses
// @access  Private (Instructor)
exports.getInstructorCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user.id })
      .populate('instructor', 'name')
      .sort({ createdAt: -1 });

    // Calculate stats
    const totalCourses = courses.length;
    const totalStudents = courses.reduce((sum, course) => sum + course.studentsCount, 0);
    const totalRevenue = courses.reduce((sum, course) => sum + (course.price * course.studentsCount), 0);
    const averageRating = courses.length > 0 
      ? courses.reduce((sum, course) => sum + course.averageRating, 0) / courses.length 
      : 0;

    res.json({
      success: true,
      count: courses.length,
      courses,
      stats: {
        totalCourses,
        totalStudents,
        totalRevenue,
        averageRating: parseFloat(averageRating.toFixed(1))
      }
    });
  } catch (error) {
    console.error('Get instructor courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching instructor courses'
    });
  }
};

// @desc    Get single instructor course
// @route   GET /api/instructor/courses/:id
// @access  Private (Instructor)
exports.getInstructorCourse = async (req, res) => {
  try {
    const course = await Course.findOne({
      _id: req.params.id,
      instructor: req.user.id
    }).populate('instructor', 'name email');

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
    console.error('Get instructor course error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching course details'
    });
  }
};

// @desc    Create a new course
// @route   POST /api/instructor/courses
// @access  Private (Instructor)
exports.createCourse = async (req, res) => {
  try {
    const {
      title,
      subtitle,
      description,
      category,
      level,
      price,
      originalPrice,
      thumbnail,
      promoVideo,
      requirements,
      learningOutcomes
    } = req.body;

    // Basic validation
    if (!title || !subtitle || !description || !category || !level || !price || !thumbnail) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Create course
    const course = await Course.create({
      title,
      subtitle,
      description,
      instructor: req.user.id,
      category,
      level,
      price,
      originalPrice: originalPrice || price,
      thumbnail: thumbnail || {},
      promoVideo: promoVideo || {},
      requirements: requirements || [],
      learningOutcomes: learningOutcomes || [],
      status: 'draft'
    });

    // Populate instructor details
    await course.populate('instructor', 'name email');

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      course
    });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error creating course'
    });
  }
};

// @desc    Update a course
// @route   PUT /api/instructor/courses/:id
// @access  Private (Instructor)
exports.updateCourse = async (req, res) => {
  try {
    const {
      title,
      subtitle,
      description,
      category,
      level,
      price,
      originalPrice,
      thumbnail,
      promoVideo,
      requirements,
      learningOutcomes
    } = req.body;

    let course = await Course.findOne({
      _id: req.params.id,
      instructor: req.user.id
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Update course fields
    course = await Course.findByIdAndUpdate(
      req.params.id,
      {
        title: title || course.title,
        subtitle: subtitle || course.subtitle,
        description: description || course.description,
        category: category || course.category,
        level: level || course.level,
        price: price || course.price,
        originalPrice: originalPrice !== undefined ? originalPrice : course.originalPrice,
        thumbnail: thumbnail || course.thumbnail,
        promoVideo: promoVideo !== undefined ? promoVideo : course.promoVideo,
        requirements: requirements || course.requirements,
        learningOutcomes: learningOutcomes || course.learningOutcomes
      },
      {
        new: true,
        runValidators: true
      }
    ).populate('instructor', 'name email');

    res.json({
      success: true,
      message: 'Course updated successfully',
      course
    });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error updating course'
    });
  }
};

// @desc    Publish a course
// @route   PATCH /api/instructor/courses/:id/publish
// @access  Private (Instructor)
exports.publishCourse = async (req, res) => {
  try {
    const course = await Course.findOne({
      _id: req.params.id,
      instructor: req.user.id
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    course.status = 'published';
    await course.save();

    res.json({
      success: true,
      message: 'Course published successfully',
      course
    });
  } catch (error) {
    console.error('Publish course error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error publishing course'
    });
  }
};

// @desc    Unpublish a course
// @route   PATCH /api/instructor/courses/:id/unpublish
// @access  Private (Instructor)
exports.unpublishCourse = async (req, res) => {
  try {
    const course = await Course.findOne({
      _id: req.params.id,
      instructor: req.user.id
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    course.status = 'unpublished';
    await course.save();

    res.json({
      success: true,
      message: 'Course unpublished successfully',
      course
    });
  } catch (error) {
    console.error('Unpublish course error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error unpublishing course'
    });
  }
};

// @desc    Delete a course
// @route   DELETE /api/instructor/courses/:id
// @access  Private (Instructor)
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findOne({
      _id: req.params.id,
      instructor: req.user.id
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    await Course.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting course'
    });
  }
};

// @desc    Get course analytics
// @route   GET /api/instructor/courses/:id/analytics
// @access  Private (Instructor)
exports.getCourseAnalytics = async (req, res) => {
  try {
    const course = await Course.findOne({
      _id: req.params.id,
      instructor: req.user.id
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Get enrollment stats
    const enrollments = await Enrollment.find({ course: req.params.id });
    const totalEnrollments = enrollments.length;
    const averageProgress = enrollments.length > 0 
      ? enrollments.reduce((sum, enrollment) => sum + (enrollment.progress || 0), 0) / enrollments.length 
      : 0;
    const completedCount = enrollments.filter(e => e.progress === 100).length;

    res.json({
      success: true,
      analytics: {
        totalEnrollments,
        averageProgress: parseFloat(averageProgress.toFixed(1)),
        completedCount,
        completionRate: totalEnrollments > 0 ? (completedCount / totalEnrollments) * 100 : 0
      },
      course
    });
  } catch (error) {
    console.error('Get course analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching course analytics'
    });
  }
};

// @desc    Get course students
// @route   GET /api/instructor/courses/:id/students
// @access  Private (Instructor)
exports.getCourseStudents = async (req, res) => {
  try {
    const course = await Course.findOne({
      _id: req.params.id,
      instructor: req.user.id
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const enrollments = await Enrollment.find({ course: req.params.id })
      .populate('student', 'name email profilePicture')
      .sort({ enrolledAt: -1 });

    res.json({
      success: true,
      count: enrollments.length,
      students: enrollments
    });
  } catch (error) {
    console.error('Get course students error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching course students'
    });
  }
};

// @desc    Search instructor courses
// @route   GET /api/instructor/courses/search
// @access  Private (Instructor)
exports.searchInstructorCourses = async (req, res) => {
  try {
    const { search, status, category } = req.query;
    
    const filter = { instructor: req.user.id };
    
    if (search) {
      filter.$text = { $search: search };
    }
    if (status) {
      filter.status = status;
    }
    if (category) {
      filter.category = category;
    }

    const courses = await Course.find(filter)
      .populate('instructor', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: courses.length,
      courses
    });
  } catch (error) {
    console.error('Search instructor courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error searching courses'
    });
  }
};