const { fetchJsonFromHash } = require('./articles_index');
const fs = require('fs').promises;
const path = require('path');

async function fetchJSONFile() {
    try {
        const filePath = 'articles.json';
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading JSON file:', error);
        throw new Error('Failed to read JSON file');
    }
}


function getHashById(id, jsonData) {
    const found = jsonData[id - 1];
    return found ? found.Hash : null;
}


const pageArticle = async (req, res) => {
    const { id } = req.query;
    console.log('Requested article id:', id);
    
    if (!id) {
        return res.status(400).send('Article ID is required');
    }

    try {
        const jsonData = await fetchJSONFile();
        const hash = getHashById(id, jsonData);

        if (!hash) {
            console.error('Article hash not found for id:', id);
            return res.status(404).send('Article not found');
        }

        const articleWithContent = await fetchJsonFromHash(hash); // Fetch article content based on hash

        if (!articleWithContent) {
            console.error('Article is undefined or null');
            return res.status(404).send('Article not found');
        }

        res.render('layout', {
            content: 'article',
            article: articleWithContent
        });
    } catch (error) {
        console.error('Error fetching article:', error);
        res.status(500).send('Error fetching article');
    }
};

module.exports = { pageArticle };