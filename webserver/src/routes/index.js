const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { submitContactForm } = require('../controllers/contactController');
const { submitArticle } = require('../filecoin/filecoin');
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

const upload = multer({ storage: storage });

router.get('/', (req, res) => {
    res.render('layout', { content: 'index' });
});

router.get('/about', (req, res) => {
    res.render('layout', { content: 'about' });
});

router.get('/contact', (req, res) => {
    res.render('layout', { content: 'contact_submit' });
});

router.get('/login', (req, res) => {
    res.render('layout', { content: 'web3' });
});

router.get('/success', (req, res) => {
    res.render('layout', { content: 'success', message: req.query.data });
});

router.get('/failure', (req, res) => {
    res.render('layout', { content: 'failure', message: req.query.data });
});

router.get('/submit', (req, res) => {
    res.render('layout', { content: 'article_submit' });
});

router.get('/article', (req, res) => {
    res.render('layout', { content: 'article' });
});

router.get('/profile', (req, res) => {
    res.render('layout', { content: 'profile' });
});

router.post('/submit-article', upload.single('image'), submitArticle);
router.post('/contact-submit', upload.array('files'), submitContactForm);

module.exports = router;
