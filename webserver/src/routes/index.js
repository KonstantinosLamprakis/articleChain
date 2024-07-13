const express = require('express');
const router = express.Router();
const multer = require('multer');
const { submitContactForm } = require('../controllers/contactController');
const { submitArticle } = require('../filecoin/filecoin');
const { indexArticle } = require('../articles/articles_index');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/', (req, res) => {
    res.render('layout', { content: 'index' });
});

router.get('/contact', (req, res) => {
    res.render('layout', { content: 'contact_submit' });
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

router.get('/profile', (req, res) => {
    res.render('layout', { content: 'profile' });
});

router.post('/submit-article', upload.single('image'), submitArticle);

router.get('/indexArticle', indexArticle);

router.post('/contact-submit', upload.array('files'), submitContactForm);

module.exports = router;
