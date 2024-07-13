const { fetchJsonFromHash } = require('./articles_index');

function fetchJSONFile() {
    return fetch('articles.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

function getHashById(id, jsonData) {
    const found = jsonData.find(item => item.id === id);
    return found ? found.Hash : null;
}


async function pageArticle(id) {

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
            content: 'article_template',
            article: articleWithContent
        });
    } catch (error) {
        console.error('Error fetching article:', error);
        res.status(500).send('Error fetching article');
    }
}

module.exports = { pageArticle };