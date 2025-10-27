// backend/routes/userRoutes.js (Corrected)
const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  changePassword,
  getUserCourses,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  getEnrollments
} = require('../controllers/userController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');

// All routes are protected
router.use(protect);

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/change-password', changePassword);
router.get('/my-courses', authorizeRoles('Student'), getUserCourses);
router.get('/enrollments', authorizeRoles('Student'), getEnrollments);
router.get('/wishlist', getWishlist);
router.post('/wishlist', addToWishlist);
router.delete('/wishlist/:courseId', removeFromWishlist);

module.exports = router;