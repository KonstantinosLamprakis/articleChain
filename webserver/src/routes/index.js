const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { submitContactForm } = require('../controllers/contactController');
const { submitArticle } = require('../controllers/articleController');
const uploadDir = path.join(__dirname, '../../uploads');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

module.exports = (app) => {
    const router = express.Router();

    router.get('/', (req, res) => {
        res.render('layout', { content: 'index' });
    });

    router.get('/contact', (req, res) => {
        res.render('layout', { content: 'contact_submit' });
    });

    router.get('/article', (req, res) => {
        res.render('layout', { content: 'article_submit' });
    });

    app.use('/', router);

    require('../filecoin/filecoin')(app);
};

module.exports = router;
