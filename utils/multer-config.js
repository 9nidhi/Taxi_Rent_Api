const multer = require('multer');
const path = require('path');

// Set storage engine
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Init upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 }, // 10MB
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    }
}).fields([
    { name: 'carFront', maxCount: 1 },
    { name: 'carBack', maxCount: 1 },
    { name: 'carLeftSide', maxCount: 1 },
    { name: 'carRightSide', maxCount: 1 },
    { name: 'carInteriorFront', maxCount: 1 },
    { name: 'carInteriorBack', maxCount: 1 },
    { name: 'carRCBookFront', maxCount: 1 },
    { name: 'carRCBookBack', maxCount: 1 }
]);

// Check file type
function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

module.exports = upload;
