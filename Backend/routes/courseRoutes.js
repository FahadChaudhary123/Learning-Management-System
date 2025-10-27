// backend/routes/courseRoutes.js
const express = require('express');
const router = express.Router();
const {
  getCourses,
  getCourseDetail,
  enrollCourse,
  getMyCourses,
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  getFeaturedCourses,
  getCourseProgress,
  updateCourseProgress
} = require('../controllers/courseController');
const { protect, authorizeRoles, optionalAuth, checkEnrollment } = require('../middlewares/authMiddleware');

router.get('/', optionalAuth, getCourses);
router.get('/featured', getFeaturedCourses);
router.get('/:id', optionalAuth, getCourseDetail);
router.post('/:id/enroll', protect, authorizeRoles('Student'), enrollCourse);
router.get('/user/my-courses', protect, authorizeRoles('Student'), getMyCourses);
router.get('/:id/progress', protect, authorizeRoles('Student'), checkEnrollment, getCourseProgress);
router.put('/:id/progress', protect, authorizeRoles('Student'), checkEnrollment, updateCourseProgress);
router.get('/wishlist/mine', protect, getWishlist);
router.post('/wishlist/add', protect, addToWishlist);
router.delete('/wishlist/remove/:courseId', protect, removeFromWishlist);

module.exports = router;