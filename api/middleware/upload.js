const multer = require('multer');
const path = require('path');
const fs = require('fs');

const createUploadsFolder = (folder) => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    let folder = 'uploads';
    if (req.baseUrl.includes('profile')) {
      folder += '/profiles';
    } else if (req.baseUrl.includes('apartment')) {
      folder += '/apartments';
    }
    createUploadsFolder(folder);
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) {
    return cb(new Error('File is not an image'), false);
  }
  cb(null, true);
};

const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 10 }, // 5 MB limit
  fileFilter,
});

module.exports = upload;
