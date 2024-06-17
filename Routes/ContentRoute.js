const express = require('express');
const multer = require('multer');
const path = require('path');
const { getContent, getContentByID, PostContent, PutContent, DeleteContent } = require('../controller/ContentController');
const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'IMG_CONTENT/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
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

router.get('/content', getContent);
router.get('/content/:id', getContentByID);
router.post('/content', upload.single('img'),PostContent);
router.put('/content', upload.single('img'),PutContent);
router.delete('/content', DeleteContent);

module.exports = router;