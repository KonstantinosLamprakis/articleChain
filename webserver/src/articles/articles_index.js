const express = require('express');
const axios = require('axios');
const fs = require('fs');

// Read the input JSON file synchronously
const articles = JSON.parse(fs.readFileSync('articles.json', 'utf8'));

// Function to fetch JSON data from a given CID/Hash
async function fetchJsonFromHash(hash) {
  try {
    const response = await axios.get(`https://gateway.lighthouse.storage/ipfs/${hash}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching data for hash ${hash}:`, error.message);
    return null;
  }
}

// Function to aggregate JSON data based on the hashes in articles.json
async function aggregateJsonData() {
  const aggregatedData = [];
  const uniqueHashes = [...new Set(articles.map(article => article.Hash))];

  for (const hash of uniqueHashes) {
    const data = await fetchJsonFromHash(hash);
    if (data) {
      aggregatedData.push(data);
    }
  }

  return aggregatedData;
}

// Index articles function
const indexArticle = async (req, res) => {
    try {
        const aggregatedData = await aggregateJsonData();
        res.json(aggregatedData);
      } catch (error) {
        console.error('Error aggregating data:', error.message);
        res.status(500).json({ error: 'Failed to fetch and aggregate data' });
      }
};

module.exports = { indexArticle };
