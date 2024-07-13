const lighthouse = require('@lighthouse-web3/sdk');
const fs = require('fs');

async function uploadFile(path) {
    const apiKey = process.env.API_LIGHTHOUSE;
    try {
        if (!apiKey) {
            throw new Error('API key not found. Make sure to set API_LIGHTHOUSE in your .env file.');
        }
        const uploadResponse = await lighthouse.upload(
            path,
            apiKey
        );
        return (uploadResponse.data.Hash);
    } catch (error) {
        console.error('Error uploading file:', error);
        return (false);
    }
}

module.exports = uploadFile;

