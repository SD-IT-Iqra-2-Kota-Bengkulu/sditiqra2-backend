// src/utils/cloudinary.js - Cloudinary configuration & helper
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Buat storage Cloudinary untuk multer berdasarkan nama folder
 */
const makeCloudinaryStorage = (folder) =>
  new CloudinaryStorage({
    cloudinary,
    params: {
      folder: `sditiqra2/${folder}`,
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      transformation: [{ quality: 'auto', fetch_format: 'auto' }],
    },
  });

module.exports = { cloudinary, makeCloudinaryStorage };
