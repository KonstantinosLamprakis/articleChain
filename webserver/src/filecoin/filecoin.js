const fs = require('fs').promises;
const path = require('path');
const mime = require('mime-types');
const uploadFile = require('./upload');
require('dotenv').config();

const prepareArticleData = (headline, imageBase64, short_text, content) => {
    const sanitizeTitle = headline.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const date = new Date().toISOString().slice(0, 10);
    const filename = `${sanitizeTitle}_${date}.json`;

    const formData = {
        headline,
        image: `data:image/jpeg;base64,${imageBase64}`,
        short_text,
        content
    };

    const jsonContent = JSON.stringify(formData, null, 2);

    return { filename, jsonContent };
};

async function convertImageToBase64(imagePath) {
    try {
        const imageBuffer = await fs.readFile(imagePath);

        const imageBase64 = imageBuffer.toString('base64');

        return imageBase64;
    } catch (error) {
        console.error('Error converting image to base64:', error);
        throw error;
    }
}

const deleteFile = async (filePath) => {
    const absolutePath = path.resolve(filePath);
    try {
        await fs.unlink(absolutePath);
    } catch (err) {
        console.error('Error deleting file:', err);
    }
};

const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

const submitArticle = async (req, res) => {
    const { headline, short_text, content, humanCheck, humanCheckAnswer } = req.body;
    const image = req.file;
    console.log('image :', image);

    if (!image) {
        res.json({ cid: null, message: 'Thumbnail image is mandatory' });
        return;
    }

    const mimeType = mime.lookup(image.originalname);
    if (!allowedImageTypes.includes(mimeType)) {
        res.json({ cid: null, message: 'Invalid image type. Allowed types are: JPG, PNG, GIF, WEBP' });
        return;
    }
    
    if (!short_text) {
        res.json({ cid: null, message: 'Short text is mandatory' });
        return;
    }

    if (!content || content.length < 20) {
        res.json({ cid: null, message: 'Content is mandatory' });
        return;
    }

    if (parseInt(humanCheck) !== parseInt(humanCheckAnswer)) {
        res.json({ cid: null, message: 'You need to verify that you are a human by doing the math. Try again.' });
        return;
    }

    const { filename, jsonContent } = prepareArticleData(headline, convertImageToBase64(image.path), short_text, content);

    try {
        const filePath = path.join(__dirname, filename);
        await fs.writeFile(filePath, jsonContent);
        const file_check = await uploadFile(filePath);
        if (file_check)
            res.json({ cid: file_check, message: 'Article submited successfully.' });
        else
            res.json({ cid: null, message: 'Problem with the uploading to the filecoin!' });

        await deleteFile(filePath);
        await deleteFile(image.path);
    } catch (err) {
        console.error('Error writing JSON file:', err);
        res.json({ cid: null, message: 'Error writing JSON file!' });
    }
};

module.exports = { submitArticle };
