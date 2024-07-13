const axios = require('axios');
const { getArticle, searchArticle, getAllArticles } = require('../contract/contract');

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

  const res = await getAllArticles();
  const filteredData = res.map(item => ({
    id: item.id,
    filecoinCID: item.filecoinCID
  }));
  for (const item of filteredData) {
    // console.log(`hash: ${item.filecoinCID}, ID: ${item.id}`);
    hash = item.filecoinCID;
    if (hash) {
      const data = await fetchJsonFromHash(hash);
      if (data) {
        data.id = item.id;
        aggregatedData.push(data);
      }
    }
  }
  return aggregatedData;
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
