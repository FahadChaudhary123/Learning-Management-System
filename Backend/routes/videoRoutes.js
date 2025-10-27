// backend/routes/videoRoutes.js
const express = require('express');
const router = express.Router();
const { streamVideo } = require('../controllers/uploadController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');

// @desc    Stream video (public access for promo videos)
// @route   GET /api/videos/:filename
// @access  Public
router.get('/:filename', streamVideo);

// @desc    Stream course video (with enrollment check)
// @route   GET /api/videos/course/:courseId/:filename
// @access  Private (Student enrolled in course or Instructor)
router.get('/course/:courseId/:filename', protect, async (req, res, next) => {
  try {
    // TODO: Add enrollment check logic here
    // For now, we'll allow access - implement proper checks in production
    console.log(`Video access requested: ${req.params.filename} for course: ${req.params.courseId} by user: ${req.user.id}`);
    next();
  } catch (error) {
    res.status(403).json({
      success: false,
      message: 'Access denied to course video'
    });
  }
}, streamVideo);

module.exports = router;