const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}${ext}`);
    },
});

const fileFilter = (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const valid = allowed.test(path.extname(file.originalname).toLowerCase()) && allowed.test(file.mimetype);
    valid ? cb(null, true) : cb(new Error('Only image files are allowed'));
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB max

module.exports = upload;