const axios = require('axios');
const { getArticle, searchArticle } = require('../contract/contract');

async function fetchJsonFromHash(hash) {
  const test = await getArticle(1);
  console.log(test);
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

  for (let i = 1; searchArticle(i); i++) {
    const hash = getArticle(i).hash;
    if (hash) {
      const data = await fetchJsonFromHash(hash);
      if (data) {
        data.id = i;
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
