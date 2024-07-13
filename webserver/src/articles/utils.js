const axios = require('axios');
const { getArticle, searchArticle } = require('../contract/contract_interact');

async function fetchAllArticleIds() {
	const articleIds = [];
	let articleId = 26;

	while (true) {
		const article = await searchArticle(articleId);
		if (article) {
			articleIds.push(articleId);
			articleId++;
		}
		else {
			break;
		}
	}
	return articleIds.reverse();
}

const fetchArticleContent = async (articleId) => {
	let articleInfo = null;
	try {
		articleInfo = await getArticle(articleId);
		if (!articleInfo) {
			throw new Error(`Failed to get article details for ID: ${articleId}`);
		}
		if (articleInfo.filecoinCID === 'exampleCID') {
			throw new Error(`Invalid CID for article ID: ${articleId}`);
		}
		const response = await axios.get(`https://gateway.lighthouse.storage/ipfs/${articleInfo.filecoinCID}`);
		return {
			...articleInfo,
			content: response.data.content,
			image: response.data.image,
			description: response.data.description,
			title: response.data.title,
			author: response.data.author,
			date: response.data.date
		};
	} catch (error){
		console.log(`Error fetching article content for ID: ${articleId}`, error);
		return null;
	}
};

module.exports = { fetchArticleContent, fetchAllArticleIds };