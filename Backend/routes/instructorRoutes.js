// backend/routes/instructorRoutes.js (Updated for Cloudinary)
const express = require('express');
const router = express.Router();
const {
  getInstructorDashboard,
  getInstructorCourses,
  getInstructorCourse,
  createCourse,
  updateCourse,
  publishCourse,
  unpublishCourse,
  deleteCourse,
  getCourseAnalytics,
  getCourseStudents,
  searchInstructorCourses
} = require('../controllers/instructorController');

// UPDATED: Import uploadController with new methods
const { 
  uploadVideo: uploadVideoHandler,
  uploadThumbnail, // NEW: Import thumbnail upload handler
  deleteVideo,
  getUploadStats 
} = require('../controllers/uploadController');

const { protect, authorizeRoles } = require('../middlewares/authMiddleware');
const { uploadVideo } = require('../utils/multerConfig'); // Multer middleware

// Apply protection and instructor authorization to all routes
router.use(protect);
router.use(authorizeRoles('Instructor'));

router.get('/dashboard', getInstructorDashboard);
router.get('/courses', getInstructorCourses);
router.get('/courses/search', searchInstructorCourses);
router.get('/courses/:id', getInstructorCourse);
router.post('/courses', createCourse);
router.put('/courses/:id', updateCourse);
router.patch('/courses/:id/publish', publishCourse);
router.patch('/courses/:id/unpublish', unpublishCourse);
router.delete('/courses/:id', deleteCourse);
router.get('/courses/:id/analytics', getCourseAnalytics);
router.get('/courses/:id/students', getCourseStudents);
router.post('/upload/video', uploadVideo.single('video'), uploadVideoHandler);
router.post('/upload/thumbnail', uploadVideo.single('thumbnail'), uploadThumbnail);
router.delete('/upload/video/:publicId', deleteVideo);
router.get('/upload/stats', getUploadStats);

module.exports = router;