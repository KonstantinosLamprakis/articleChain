const express = require('express');
const axios = require('axios');
const fs = require('fs');

const articles = JSON.parse(fs.readFileSync('articles.json', 'utf8'));

const { getArticle } = require('../contract/contract');

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
  const uniqueHashes = [...new Set(articles.map(article => article.Hash))];

  for (let i = 0; i < uniqueHashes.length; i++) {
    const hash = uniqueHashes[i];
    const data = await fetchJsonFromHash(hash);
    if (data) {
        data.id = i + 1;
        aggregatedData.push(data);
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

module.exports = { indexArticle , fetchJsonFromHash };
