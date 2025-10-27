// backend/utils/cloudinary.js
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload video to Cloudinary
exports.uploadVideo = async (filePath, folder = 'lms/videos') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: 'video',
      folder: folder,
      chunk_size: 6000000, // 6MB chunks for large files
      eager: [
        { width: 300, height: 300, crop: "pad", audio_codec: "none" }, 
        { width: 160, height: 100, crop: "crop", gravity: "south", audio_codec: "none" } 
      ]
    });

    // Delete local file after upload
    fs.unlinkSync(filePath);
    
    return result;
  } catch (error) {
    // Delete local file if upload fails
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    throw error;
  }
};

// Upload image to Cloudinary
exports.uploadImage = async (filePath, folder = 'lms/thumbnails') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: 'image',
      folder: folder,
      quality: 'auto',
      fetch_format: 'auto'
    });

    // Delete local file after upload
    fs.unlinkSync(filePath);
    
    return result;
  } catch (error) {
    // Delete local file if upload fails
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    throw error;
  }
};

// Delete file from Cloudinary
exports.deleteFile = async (publicId, resourceType = 'video') => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType
    });
    return result;
  } catch (error) {
    throw error;
  }
};

// Get Cloudinary URL with transformations
exports.getVideoUrl = (publicId, transformations = []) => {
  return cloudinary.url(publicId, {
    resource_type: 'video',
    transformation: transformations
  });
};

// Extract public_id from Cloudinary URL
exports.getPublicIdFromUrl = (url) => {
  const matches = url.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/);
  return matches ? matches[1] : null;
};