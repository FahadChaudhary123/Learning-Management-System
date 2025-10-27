// backend/controllers/uploadController.js (Updated for Cloudinary)
const Course = require('../models/Course');
const { 
  uploadVideo, 
  uploadImage, 
  deleteFile, 
  getPublicIdFromUrl 
} = require('../utils/cloudinary');

// @desc    Upload course video to Cloudinary
// @route   POST /api/instructor/upload/video
// @access  Private (Instructor)
exports.uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please select a video file to upload'
      });
    }

    const file = req.file;
    
    // Validate file size
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      return res.status(400).json({
        success: false,
        message: 'Video file size must be less than 100MB'
      });
    }

    // Upload to Cloudinary
    const result = await uploadVideo(file.path, 'lms/course-videos');

    const fileInfo = {
      originalName: file.originalname,
      publicId: result.public_id,
      url: result.secure_url,
      duration: result.duration,
      format: result.format,
      size: result.bytes,
      thumbnail: result.eager ? result.eager[0].secure_url : null
    };

    console.log('Video uploaded to Cloudinary successfully:', fileInfo.publicId);

    res.json({
      success: true,
      message: 'Video uploaded successfully',
      videoUrl: fileInfo.url,
      thumbnailUrl: fileInfo.thumbnail,
      publicId: fileInfo.publicId,
      fileInfo: {
        originalName: fileInfo.originalName,
        size: fileInfo.size,
        duration: fileInfo.duration,
        format: fileInfo.format
      }
    });

  } catch (error) {
    console.error('Video upload error:', error);
    
    // Clean up uploaded file if error occurred
    if (req.file && req.file.path) {
      const fs = require('fs');
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting uploaded file:', unlinkError);
      }
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Server error uploading video'
    });
  }
};

// @desc    Upload course thumbnail to Cloudinary
// @route   POST /api/instructor/upload/thumbnail
// @access  Private (Instructor)
exports.uploadThumbnail = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a thumbnail image'
      });
    }

    // Upload to Cloudinary
    const result = await uploadImage(req.file.path, 'lms/thumbnails');

    res.json({
      success: true,
      message: 'Thumbnail uploaded successfully',
      thumbnailUrl: result.secure_url,
      publicId: result.public_id
    });

  } catch (error) {
    console.error('Thumbnail upload error:', error);
    
    if (req.file && req.file.path) {
      const fs = require('fs');
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting uploaded file:', unlinkError);
      }
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Server error uploading thumbnail'
    });
  }
};

// @desc    Delete uploaded video from Cloudinary
// @route   DELETE /api/instructor/upload/video/:publicId
// @access  Private (Instructor)
exports.deleteVideo = async (req, res) => {
  try {
    const { publicId } = req.params;
    
    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: 'Public ID is required'
      });
    }

    // Check if video is being used in any course
    const coursesUsingVideo = await Course.find({
      $or: [
        { promoVideo: { $regex: publicId, $options: 'i' } },
        { 'sections.lectures.videoUrl': { $regex: publicId, $options: 'i' } }
      ]
    });

    if (coursesUsingVideo.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete video. It is being used in one or more courses.',
        usedInCourses: coursesUsingVideo.map(course => ({
          id: course._id,
          title: course.title
        }))
      });
    }

    // Delete from Cloudinary
    await deleteFile(publicId, 'video');

    res.json({
      success: true,
      message: 'Video deleted successfully'
    });

  } catch (error) {
    console.error('Video delete error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error deleting video'
    });
  }
};

// @desc    Stream video from Cloudinary (optional - Cloudinary handles streaming)
// @route   GET /api/videos/:publicId
// @access  Public/Private based on your needs
exports.streamVideo = async (req, res) => {
  try {
    const { publicId } = req.params;
    
    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: 'Public ID is required'
      });
    }

    // Redirect to Cloudinary URL for streaming
    // Cloudinary automatically handles adaptive streaming
    const cloudinaryUrl = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/video/upload/${publicId}.mp4`;
    
    res.redirect(cloudinaryUrl);

  } catch (error) {
    console.error('Video stream error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error streaming video'
    });
  }
};

// @desc    Get upload statistics from Cloudinary (optional)
// @route   GET /api/instructor/upload/stats
// @access  Private (Instructor)
exports.getUploadStats = async (req, res) => {
  try {
    // Cloudinary doesn't provide easy storage stats via API
    // You might need to track this in your database
    
    const videoCount = await Course.aggregate([
      { $match: { instructor: req.user._id } },
      { $project: { hasVideo: { $cond: [{ $ne: ['$promoVideo', ''] }, 1, 0] } } },
      { $group: { _id: null, totalVideos: { $sum: '$hasVideo' } } }
    ]);

    res.json({
      success: true,
      stats: {
        totalVideos: videoCount[0]?.totalVideos || 0,
        storageProvider: 'Cloudinary'
      }
    });

  } catch (error) {
    console.error('Upload stats error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error getting upload statistics'
    });
  }
};