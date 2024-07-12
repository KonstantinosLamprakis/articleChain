const lighthouse = require('@lighthouse-web3/sdk');
const fs = require('fs');

async function uploadFile(path) {
    const apiKey = process.env.API_LIGHTHOUSE;
    try {
        const uploadResponse = await lighthouse.upload(
            path,
            apiKey
        );
        console.log('Upload Response:', uploadResponse);

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
        fs.writeFileSync('uploadResponse.json', JSON.stringify(existingData, null, 2));
    } catch (error) {
        console.error('Error uploading file:', error);
    }
}

module.exports = uploadFile;

