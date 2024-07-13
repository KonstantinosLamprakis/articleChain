import { web3auth, contractABI, contractAddress } from "./init.js";

async function isJournalist(journalistAddress) {
	try {
		const web3 = new Web3(web3auth.provider);
		const contract = new web3.eth.Contract(contractABI, contractAddress);
		const isJournalist = await contract.methods
			.journalistGroup(journalistAddress)
			.call();
		console.log(`Is journalist: ${isJournalist}`);
		return isJournalist;
	} catch (error) {
		console.error("Error checking journalist status:", error);
		return false;
	}
}

async function getArticle(articleId) {
	try {
		const web3 = new Web3(web3auth.provider);
		const contract = new web3.eth.Contract(contractABI, contractAddress);
		const article = await contract.methods.getArticle(articleId).call();
		const formattedArticle = {
			id: Number(article.id),
			filecoinCID: article.filecoinCID,
			journalist_id: article.journalist_id,
			timestamp: Number(article.timestamp),
			totalReviewScore: Number(article.totalReviewScore),
			reviewsReceivedNbr: Number(article.reviewsReceivedNbr),
			upVotes: Number(article.upVotes),
			downVotes: Number(article.downVotes),
			is_evaluated: article.is_evaluated,
			is_deployed: article.is_deployed,
		};

		console.log("Article found:", formattedArticle);
		return formattedArticle;
	} catch (error) {
		console.error("Error getting article:", error);
	}
}

async function getCredibility(journalistAddress) {
	try {
		const web3 = new Web3(web3auth.provider);
		const contract = new web3.eth.Contract(contractABI, contractAddress);
		console.log(
			`Getting credibility score for journalist ${journalistAddress}`
		);
		const credibility = await contract.methods
			.get_credibility(journalistAddress)
			.call();
		console.log(
			`Credibility score for journalist ${journalistAddress}: ${credibility}`
		);
		return credibility;
	} catch (error) {
		console.error("Error getting credibility score:", error);
	}
}

async function searchArticle(articleId) {
	try {
		const web3 = new Web3(web3auth.provider);
		const contract = new web3.eth.Contract(contractABI, contractAddress);
		const article = await contract.methods.getArticle(articleId).call();
		console.log("Article found:", article);
		return article;
	} catch (error) {
		console.error("Error fetching article:", error);
	}
}

