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
        console.log('File deleted successfully.');
    } catch (err) {
        console.error('Error deleting file:', err);
    }
};

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const submitArticle = async (req, res) => {
    const { headline, short_text, content, humanCheck, humanCheckAnswer } = req.body;
    const image = req.file;

    if (!headline || !short_text || !content || !humanCheck || !humanCheckAnswer) {
        return res.status(400).send('All fields are required.');
    }

    if (humanCheck !== humanCheckAnswer) {
        return res.status(400).send('Human verification failed.');
    }

    const { filename, jsonContent } = prepareArticleData(headline, image, short_text, content);

    try {
        const filePath = path.join(__dirname, filename);
        await fs.writeFile(filePath, jsonContent);
        await uploadFile(filePath);
        res.send('Form submitted successfully!');
        
        await deleteFile(filePath);
    } catch (err) {
        console.error('Error writing JSON file:', err);
        res.status(500).send('Internal server error');
    }
};

module.exports = { submitArticle };
