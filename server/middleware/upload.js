const path = require('path');
const fs = require('fs');
const multer = require('multer');
const cloudinary = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Fallback to local storage if Cloudinary is not configured
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const localStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function(req, file, cb) {
    const safeName = Date.now() + '-' + file.originalname.replace(/\s+/g, '-');
    cb(null, safeName);
  }
});

// Base64 storage for temporary solution
const base64Storage = multer.memoryStorage();

// Use Cloudinary storage if credentials are available, otherwise use Base64 for production
let storage;
let upload;

if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  // Use Cloudinary for production
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'arnob-portfolio',
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      transformation: [{ width: 1200, height: 800, crop: 'limit' }]
    }
  });
  upload = multer({ storage });
} else if (process.env.NODE_ENV === 'production') {
  // Use Base64 for production when Cloudinary is not configured
  storage = base64Storage;
  upload = multer({ storage });
} else {
  // Use local storage for development
  storage = localStorage;
  upload = multer({ storage });
}

// Helper function to convert buffer to Base64 data URL
function bufferToBase64(buffer, mimetype) {
  const base64 = buffer.toString('base64');
  return `data:${mimetype};base64,${base64}`;
}

module.exports = { upload, uploadsDir, cloudinary, bufferToBase64 };


