const axios = require('axios');
const { getAllArticles } = require('../contract/contract');
const { fetchJsonFromHash } = require('./articles_index');

async function aggregateJsonDataReview() {
  const aggregatedData = [];
  try {
    const articles = await getAllArticles();
    for (const article of articles) {
      const hash = article.filecoinCID;
      console.log('article:', article);
      if (hash && article.isEvaluated == false) {
        const data = await fetchJsonFromHash(hash);
        if (data) {
          const id = typeof article.id === 'bigint' ? article.id.toString() : article.id;
          data.id = id;
          aggregatedData.push(data);
        }
      }
    }
    return aggregatedData;
  } catch (error) {
    console.error('Error aggregating data:', error);
    return [];
  }
}

const reviewArticle = async (req, res) => {
  try {
    const aggregatedData = await aggregateJsonDataReview();
    res.json(aggregatedData);
  } catch (error) {
    console.error('Error aggregating data:', error.message);
    res.status(500).json({ error: 'Failed to fetch and aggregate data' });
  }
};

module.exports = { reviewArticle };
