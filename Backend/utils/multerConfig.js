// backend/utils/multerConfig.js (Fixed for Cloudinary)
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ✅ Create temp directory for uploads
const createTempDir = () => {
  const tempDir = 'temp_uploads';
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  return tempDir;
};

const tempDir = createTempDir();

// ✅ Shared storage config (disk storage for temporary Cloudinary upload)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    const filename = `${file.fieldname}-${uniqueSuffix}${fileExtension}`;
    cb(null, filename);
  },
});

// ✅ Video file filter
const videoFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Only video files are allowed!'), false);
  }
};

// ✅ Image file filter
const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// ✅ Create multer instances
const uploadVideo = multer({
  storage,
  fileFilter: videoFilter,
  limits: { fileSize: 200 * 1024 * 1024 }, // 200MB max
});

const uploadImage = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
});

module.exports = {
  uploadVideo,
  uploadImage,
};
