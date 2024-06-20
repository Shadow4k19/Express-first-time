// routes/slideshowRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const {
    getSlideshows,
    getSlideshowById,
    PostSlideshow,
    PutSlideshow,
    deleteSlideshow
} = require('../controller/Slideshowcontroller');

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'IMG_SLIDESHOW/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-'+ Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 500000 },
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only JPG, JPEG, PNG files are allowed.'));
        }
    }
});


router.get('/slideshows', getSlideshows);
router.get('/slideshows/:id', getSlideshowById);
router.post('/slideshows', upload.single('url'), PostSlideshow);
router.put('/slideshows', upload.single('url'), PutSlideshow);
router.delete('/slideshows', deleteSlideshow);

module.exports = router;
