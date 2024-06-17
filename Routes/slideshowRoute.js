// routes/slideshowRoutes.js
const express = require('express');
const multer = require('multer');
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
        cb(null, file.fieldname + '-' + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });


router.get('/slideshows', getSlideshows);
router.get('/slideshows/:id', getSlideshowById);
router.post('/slideshows', upload.single('url'), PostSlideshow);
router.put('/slideshows', upload.single('url'), PutSlideshow);
router.delete('/slideshows', deleteSlideshow);

module.exports = router;
