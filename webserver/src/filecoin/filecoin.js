const fs = require('fs').promises;
const path = require('path');
const multer = require('multer');
const uploadFile = require('./upload');
require('dotenv').config();

const prepareArticleData = (headline, image, short_text, content) => {
    const sanitizeTitle = headline.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const date = new Date().toISOString().slice(0, 10);
    const filename = `${sanitizeTitle}_${date}.json`;

    const formData = {
        headline,
        image: {
            originalname: image ? image.originalname : '',
            mimetype: image ? image.mimetype : '',
            size: image ? image.size : 0,
            buffer: image ? image.buffer.toString('base64') : ''
        },
        short_text,
        content
    };

    const jsonContent = JSON.stringify(formData, null, 2);

    return { filename, jsonContent };
};

const deleteFile = async (filePath) => {
    const absolutePath = path.resolve(filePath);
    try {
        await fs.unlink(absolutePath);
    } catch (err) {
        console.error('Error deleting file:', err);
    }
};

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const submitArticle = async (req, res) => {
    const { headline, short_text, content, humanCheck, humanCheckAnswer } = req.body;
    const image = req.file;

    if (!image) {
        res.render('layout', { content: 'failure', message: 'Thumbnail image is mandatory' });
        return;
    }

    if (parseInt(humanCheck) !== parseInt(humanCheckAnswer)) {
        res.render('layout', { content: 'failure', message: 'You need to verify that you are a human by doing the math. Try again.' });
        return;
    }


    const { filename, jsonContent } = prepareArticleData(headline, image, short_text, content);

    try {
        const filePath = path.join(__dirname, filename);
        await fs.writeFile(filePath, jsonContent);
        const file_check = await uploadFile(filePath);
        if (file_check)
            res.json({ cid: file_check, message: 'Article submited successfully.' });
        else
            res.render('layout', { content: 'failure', message: 'Problem with the uploading to the filecoin!' });

        await deleteFile(filePath);
    } catch (err) {
        console.error('Error writing JSON file:', err);
        res.render('layout', { content: 'failure', message: 'Error writing JSON file!' });
    }
};

module.exports = { submitArticle };
