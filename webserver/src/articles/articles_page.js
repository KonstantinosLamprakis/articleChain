const { fetchJsonFromHash } = require('./articles_index');
const { getArticle } = require('../contract/contract');

const pageArticle = async (req, res) => {
    const { id } = req.query;
    console.log('Requested article id:', id);
    
    if (!id) {
        return res.status(400).send('Article ID is required');
    }

    try {
        article = await getArticle(id);
        hash = article.filecoinCID;

        if (!hash) {
            console.error('Article hash not found for id:', id);
            return res.status(404).send('Article not found');
        }

        const articleWithContent = await fetchJsonFromHash(hash);

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