const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { submitContactForm } = require('../controllers/contactController');
const { submitArticle } = require('../controllers/articleController');
const uploadDir = path.join(__dirname, '../../uploads');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Only images are allowed!'), false);
    }
};

const upload_img = multer({ storage, fileFilter });
const upload = multer({ storage: storage });

router.get('/', (req, res) => {
    res.render('layout', { content: 'index' });
});

router.get('/contact', (req, res) => {
    res.render('layout', { content: 'contact_submit' });
});

router.get('/article', (req, res) => {
    res.render('layout', { content: 'article_submit' });
});

router.post('/submit-article', upload_img.single('image'), submitArticle);
router.post('/contact-submit', upload.array('files'), submitContactForm);

module.exports = router;
