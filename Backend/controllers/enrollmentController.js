// backend/controllers/enrollmentController.js
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const User = require('../models/User');

// @desc    Get user's enrollments
// @route   GET /api/enrollments
// @access  Private (Student)
exports.getEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user.id })
      .populate({
        path: 'course',
        populate: { path: 'instructor', select: 'name profilePicture' },
      })
      .sort({ lastAccessed: -1 });

    res.json({
      success: true,
      count: enrollments.length,
      enrollments,
    });
  } catch (error) {
    console.error('Get enrollments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching enrollments',
    });
  }
};

// @desc    Get single enrollment details
// @route   GET /api/enrollments/:id
// @access  Private (Student)
exports.getEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id).populate({
      path: 'course',
      populate: [
        { path: 'instructor', select: 'name profilePicture bio' },
        { path: 'sections.lectures' },
      ],
    });

    if (!enrollment) {
      return res.status(404).json({ success: false, message: 'Enrollment not found' });
    }

    if (enrollment.student.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this enrollment',
      });
    }

    res.json({ success: true, enrollment });
  } catch (error) {
    console.error('Get enrollment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching enrollment',
    });
  }
};

// @desc    Update enrollment progress
// @route   PUT /api/enrollments/:id/progress
// @access  Private (Student)
exports.updateProgress = async (req, res) => {
  try {
    const { progress, completedLectures, currentLecture } = req.body;
    const enrollment = await Enrollment.findById(req.params.id);

    if (!enrollment) {
      return res.status(404).json({ success: false, message: 'Enrollment not found' });
    }

    if (enrollment.student.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this enrollment',
      });
    }

    if (progress !== undefined) enrollment.progress = progress;
    if (completedLectures) enrollment.completedLectures = completedLectures;
    if (currentLecture) enrollment.currentLecture = currentLecture;
    enrollment.lastAccessed = new Date();

    if (progress === 100 && !enrollment.completedAt) {
      enrollment.completedAt = new Date();
      enrollment.certificateIssued = true;
      enrollment.certificateIssuedAt = new Date();
    }

    await enrollment.save();

    res.json({
      success: true,
      message: 'Progress updated successfully',
      enrollment,
    });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating progress',
    });
  }
};

// @desc    Mark lecture as completed
// @route   POST /api/enrollments/:id/complete-lecture
// @access  Private (Student)
exports.markLectureCompleted = async (req, res) => {
  try {
    const { lectureId } = req.body;
    if (!lectureId)
      return res.status(400).json({ success: false, message: 'Lecture ID is required' });

    const enrollment = await Enrollment.findById(req.params.id);
    if (!enrollment)
      return res.status(404).json({ success: false, message: 'Enrollment not found' });

    if (enrollment.student.toString() !== req.user.id)
      return res.status(403).json({ success: false, message: 'Not authorized' });

    await enrollment.markLectureCompleted(lectureId);

    const course = await Course.findById(enrollment.course);
    const totalLectures = course.sections.reduce(
      (total, s) => total + (s.lectures ? s.lectures.length : 0),
      0
    );

    const progress = Math.round((enrollment.completedLectures.length / totalLectures) * 100);
    enrollment.progress = progress;
    enrollment.lastAccessed = new Date();

    if (progress === 100 && !enrollment.completedAt) {
      enrollment.completedAt = new Date();
      enrollment.certificateIssued = true;
      enrollment.certificateIssuedAt = new Date();
    }

    await enrollment.save();

    res.json({
      success: true,
      message: 'Lecture marked as completed',
      enrollment,
    });
  } catch (error) {
    console.error('Mark lecture completed error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error marking lecture as completed',
    });
  }
};

// @desc    Add review to enrollment
// @route   POST /api/enrollments/:id/review
// @access  Private (Student)
exports.addReview = async (req, res) => {
  try {
    const { rating, review } = req.body;
    if (!rating || rating < 1 || rating > 5)
      return res.status(400).json({ success: false, message: 'Invalid rating' });

    const enrollment = await Enrollment.findById(req.params.id);
    if (!enrollment)
      return res.status(404).json({ success: false, message: 'Enrollment not found' });

    if (enrollment.student.toString() !== req.user.id)
      return res.status(403).json({ success: false, message: 'Not authorized' });

    if (enrollment.rating)
      return res.status(400).json({ success: false, message: 'Already reviewed' });

    await enrollment.addReview(rating, review);
    await updateCourseRating(enrollment.course);

    res.json({ success: true, message: 'Review added successfully', enrollment });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ success: false, message: 'Server error adding review' });
  }
};

// @desc    Get enrollment certificate
// @route   GET /api/enrollments/:id/certificate
// @access  Private (Student)
exports.getCertificate = async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id)
      .populate('student', 'name email')
      .populate({
        path: 'course',
        populate: { path: 'instructor', select: 'name' },
      });

    if (!enrollment)
      return res.status(404).json({ success: false, message: 'Enrollment not found' });

    if (enrollment.student._id.toString() !== req.user.id)
      return res.status(403).json({ success: false, message: 'Not authorized' });

    if (!enrollment.certificateIssued)
      return res.status(400).json({
        success: false,
        message: 'Complete the course to get your certificate.',
      });

    const certificateData = {
      certificateId: `CERT-${enrollment._id.toString().slice(-8).toUpperCase()}`,
      studentName: enrollment.student.name,
      courseTitle: enrollment.course.title,
      instructorName: enrollment.course.instructor.name,
      completedAt: enrollment.completedAt,
      issuedAt: enrollment.certificateIssuedAt,
    };

    res.json({
      success: true,
      certificate: certificateData,
      downloadUrl: `/api/enrollments/${enrollment._id}/certificate/download`,
    });
  } catch (error) {
    console.error('Get certificate error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching certificate' });
  }
};

// Helper function
const updateCourseRating = async (courseId) => {
  try {
    const stats = await Enrollment.getCourseStats(courseId);
    await Course.findByIdAndUpdate(courseId, {
      averageRating: stats.averageRating || 0,
      reviewCount: stats.totalEnrollments,
    });
  } catch (error) {
    console.error('Update course rating error:', error);
  }
};
