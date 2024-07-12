const lighthouse = require('@lighthouse-web3/sdk');
const fs = require('fs');

async function uploadFile() {
    try {
        const uploadResponse = await lighthouse.upload(
            './testting.txt',
            '151ce873.9ebc8f028d834b4ca5cca2a3ddec88e0'
        );
        console.log('Upload Response:', uploadResponse);

        // Extract specific data from the response
        const { Name, Hash, Size } = uploadResponse.data;

        // Data to be appended
        const dataToAppend = { Name, Hash, Size };

        // Read the existing data from the JSON file if it exists
        let existingData = [];
        if (fs.existsSync('uploadResponse.json')) {
            const data = fs.readFileSync('uploadResponse.json', 'utf8');
            if (data) {
                existingData = JSON.parse(data);
            }
        }

        // Append the new data to the existing data
        existingData.push(dataToAppend);

        // Write the updated data back to the JSON file
        fs.writeFileSync('uploadResponse.json', JSON.stringify(existingData, null, 2));
        console.log('Upload response has been appended to uploadResponse.json');
    } catch (error) {
        console.error('Error uploading file:', error);
    }
}

uploadFile();
