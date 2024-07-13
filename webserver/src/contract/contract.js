const { Web3 } = require('web3');
require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');
const abi = require('./abi.json');

const provider = new HDWalletProvider({
	mnemonic: {
		phrase: process.env.MNEMONIC
	},
	providerOrUrl: process.env.INFURA_PROJECT_ID
});

const web3 = new Web3(provider);

const contractAddress = process.env.CONTRACT_ADDRESS;

const contract = new web3.eth.Contract(abi, contractAddress);

// READ FUNCS

async function isJournalist(journalistAddress) {
	try {
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

async function getCredibility(journalistAddress) {
	try {

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

async function searchArticle(articleId) {
	try {

		const article = await contract.methods.getArticle(articleId).call();
		console.log("Article found:", article);
		return article;
	} catch (error) {
		console.error("Error fetching article:", error);
	}
}

// WRITE FUNCS


async function addJournalist(journalistAddress) {
	await initPromise;
	if (!web3.connected) {
		console.log("Please connect your wallet first");
		return false;
	}
	try {

		const accounts = await web3.eth.getAccounts();
		console.log(`Using account: ${accounts[0]}`);
		const tx = await contract.methods.addJournalist(journalistAddress).send({ from: accounts[0] });
		console.log("Journalist added successfully:", tx);
		return true;
	} catch (error) {
		console.error("Error adding journalist:", error);
		return false;
	}
}

async function createArticle(filecoinCID) {
	await initPromise;
	if (!web3.connected) {
		console.log("Please connect your wallet first");
		return false;
	}
	try {

		const accounts = await web3.eth.getAccounts();
		console.log(`Using account: ${accounts[0]}`);
		const tx = await contract.methods.createArticle(filecoinCID).send({ from: accounts[0] });
		console.log("Article created successfully:", tx);
		return true;
	} catch (error) {
		console.log("Error creating article:", error);
		return false;
	}
}

async function evaluateArticle(articleId, approve, comment) {
	await initPromise;
	if (!web3.connected) {
		console.log("Please connect your wallet first");
		return;
	}
	try {

		const accounts = await web3.eth.getAccounts();
		console.log(`Using account: ${accounts[0]}`);
		const tx = await contract.methods.evaluateArticle(articleId, approve, comment).send({ from: accounts[0] });
		console.log("Article evaluated successfully:", tx);
	} catch (error) {
		console.error("Error evaluating article:", error);
	}
}

async function voteArticle(articleId, vote) {
	await initPromise;
	if (!web3.connected) {
		console.log("Please connect your wallet first");
		return;
	}
	try {

		const accounts = await web3.eth.getAccounts();
		console.log(`Using account: ${accounts[0]}`);
		const tx = await contract.methods.voteArticle(articleId, vote).send({ from: accounts[0] });
		console.log("Article voted successfully:", tx);
	} catch (error) {
		console.error("Error voting on article:", error);
	}
}

module.exports = {
    isJournalist,
    getArticle,
    getCredibility,
    searchArticle,
    addJournalist,
    createArticle,
    evaluateArticle,
    voteArticle
};

// import them like that
// const { functionA, functionB, functionC } = require('./module1');