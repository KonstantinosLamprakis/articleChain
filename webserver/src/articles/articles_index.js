const axios = require('axios');
const { getAllArticles } = require('../contract/contract');

async function fetchJsonFromHash(hash) {
  try {
    const response = await axios.get(`https://gateway.lighthouse.storage/ipfs/${hash}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching data for hash ${hash}:`, error.message);
    return null;
  }
}

async function aggregateJsonData() {
  const aggregatedData = [];
  try {
    const articles = await getAllArticles();
    for (const article of articles) {
      const hash = article.filecoinCID;
      if (hash && article.id != 1) { 
      // if (hash && article.isPublished == true) {
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

const indexArticle = async (req, res) => {
  try {
    const aggregatedData = await aggregateJsonData();
    res.json(aggregatedData);
  } catch (error) {
    console.error('Error aggregating data:', error.message);
    res.status(500).json({ error: 'Failed to fetch and aggregate data' });
  }
};

module.exports = { indexArticle, fetchJsonFromHash };
