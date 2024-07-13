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

        const { Name, Hash, Size } = uploadResponse.data;

        const dataToAppend = { Name, Hash, Size };

        let existingData = [];
        if (fs.existsSync('articles.json')) {
            const data = fs.readFileSync('articles.json', 'utf8');
            if (data) {
                existingData = JSON.parse(data);
            }
        }

        existingData.push(dataToAppend);
        fs.writeFileSync('articles.json', JSON.stringify(existingData, null, 2));
        return (true);
    } catch (error) {
        console.error('Error uploading file:', error);
        return (false);
    }
}

module.exports = uploadFile;

