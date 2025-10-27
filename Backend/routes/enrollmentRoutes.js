// backend/routes/enrollmentRoutes.js
const express = require('express');
const router = express.Router();
const {
  getEnrollments,
  getEnrollment,
  updateProgress,
  markLectureCompleted,
  addReview,
  getCertificate,
} = require('../controllers/enrollmentController');
const { protect } = require('../middlewares/authMiddleware');

// Routes
router.get('/', protect, getEnrollments);
router.get('/:id', protect, getEnrollment);
router.put('/:id/progress', protect, updateProgress);
router.post('/:id/complete-lecture', protect, markLectureCompleted);
router.post('/:id/review', protect, addReview);
router.get('/:id/certificate', protect, getCertificate);

module.exports = router;
