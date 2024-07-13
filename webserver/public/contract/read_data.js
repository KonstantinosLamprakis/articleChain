import { web3auth, contractABI, contractAddress, initPromise } from "../web3auth/init.js";

export async function isJournalist(journalistAddress) {
	try {
		await initPromise;
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

export async function getArticle(articleId) {
	try {
		await initPromise;
		const web3 = new Web3(web3auth.provider);
		const contract = new web3.eth.Contract(contractABI, contractAddress);
		const article = await contract.methods.getArticle(articleId).call();
		const formattedArticle = {
			id: Number(article.id),
			filecoinCID: article.filecoinCID,
			journalistId: article.journalistId,
			timeStamp: Number(article.timeStamp),
			reviewScore: Number(article.reviewScore),
			reviewNumber: Number(article.reviewNumber),
			upvotes: Number(article.upvotes),
			downvotes: Number(article.downvotes),
			isEvaluated: article.isEvaluated,
			isPublished: article.isPublished,
		};
		console.log("Article found:", formattedArticle);
		return formattedArticle;
	} catch (error) {
		console.error("Error getting article:", error);
	}
}

export async function getCredibility(journalistAddress) {
	try {
		await initPromise;
		const web3 = new Web3(web3auth.provider);
		const contract = new web3.eth.Contract(contractABI, contractAddress);
		console.log(`Getting credibility score for journalist ${journalistAddress}`);
		const credibility = await contract.methods
			.getCredibility(journalistAddress)
			.call();
		console.log(`Credibility score for journalist ${journalistAddress}: ${credibility}`);
		return credibility;
	} catch (error) {
		console.error("Error getting credibility score:", error);
	}
}

export async function searchArticle(articleId) {
	try {
		await initPromise;
		const web3 = new Web3(web3auth.provider);
		const contract = new web3.eth.Contract(contractABI, contractAddress);
		const article = await contract.methods.getArticle(articleId).call();
		return article;
	} catch (error) {
		console.error("Error fetching article:", error);
	}
}

