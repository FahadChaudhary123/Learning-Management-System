// backend/routes/instructorRoutes.js (Fixed)
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
  searchInstructorCourses,
} = require('../controllers/instructorController');

const {
  uploadVideo: uploadVideoHandler,
  uploadThumbnail,
  deleteVideo,
  getUploadStats,
} = require('../controllers/uploadController');

const { protect, authorizeRoles } = require('../middlewares/authMiddleware');
const { uploadVideo, uploadImage } = require('../utils/multerConfig'); // ✅ Correct multer imports

// Apply authentication & instructor authorization
router.use(protect);
router.use(authorizeRoles('Instructor'));

// Instructor routes
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

// Upload routes
router.post('/upload/video', uploadVideo.single('video'), uploadVideoHandler);
router.post('/upload/thumbnail', uploadImage.single('thumbnail'), uploadThumbnail);
router.delete('/upload/video/:publicId', deleteVideo);
router.get('/upload/stats', getUploadStats);

module.exports = router;
