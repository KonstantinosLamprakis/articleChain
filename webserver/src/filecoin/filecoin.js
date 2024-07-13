const fs = require('fs').promises;
const path = require('path');
const multer = require('multer');
const { format } = require('date-fns');
const { uploadFile } = require('./upload');
require('dotenv').config();


const deleteFile = (filePath) => {
    const absolutePath = path.resolve(filePath);

    fs.unlink(absolutePath, (err) => {
        if (err) {
            console.error('Error deleting file:', err);
            return;
        }
    });
};

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const submitArticle = (req, res) => {
    const { title, shortDescription, content, humanCheck, humanCheckAnswer } = req.body;
    const image = req.file;

    if (humanCheck !== humanCheckAnswer) {
        return res.status(400).send('Human verification failed.');
    }

    const sanitizeTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase();

    const date = new Date().toISOString().slice(0, 10);

    const filename = `${sanitizeTitle}_${date}.json`;
    const formData = {
        title,
        image: {
            originalname: image.originalname,
            mimetype: image.mimetype,
            size: image.size,
            buffer: image.buffer.toString('base64')
        },
        shortDescription,
        content
    };

    const jsonContent = JSON.stringify(formData, null, 2);


    fs.writeFile(filename, jsonContent, (err) => {
        if (err) {
            console.error('Error writing JSON file:', err);
            return res.status(500).send('Internal server error');
        }
        console.log('JSON file has been saved.');
        res.send('Form submitted successfully!');
    });

    deleteFile(filename);

    res.send('Form submitted successfully!');
}

module.exports = { submitArticle };