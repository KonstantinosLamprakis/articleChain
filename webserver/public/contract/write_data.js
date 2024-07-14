import { web3auth, contractABI, contractAddress, initPromise } from "../web3auth/init.js";

export async function addJournalist(journalistAddress) {
	await initPromise;
	if (!web3auth.connected) {
		console.log("Please connect your wallet first");
		return false;
	}
	try {
		const web3 = new Web3(web3auth.provider);
		const contract = new web3.eth.Contract(contractABI, contractAddress);
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

export async function createArticle(filecoinCID) {
	await initPromise;
	if (!web3auth.connected) {
		console.log("Please connect your wallet first");
		return false;
	}
	try {
		const web3 = new Web3(web3auth.provider);
		const contract = new web3.eth.Contract(contractABI, contractAddress);
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

export async function evaluateArticle(articleId, approve, comment) {
	await initPromise;
	if (!web3auth.connected) {
		console.log("Please connect your wallet first");
		return false;
	}
	try {
		const web3 = new Web3(web3auth.provider);
		const contract = new web3.eth.Contract(contractABI, contractAddress);
		const accounts = await web3.eth.getAccounts();
		console.log(`Using account: ${accounts[0]}`);
		const tx = await contract.methods.evaluateArticle(articleId, approve, comment).send({ from: accounts[0] });
		console.log("Article evaluated successfully:", tx);
		return true;
	} catch (error) {
		console.error("Error evaluating article:", error);
		return false;
	}
}

export async function voteArticle(articleId, vote) {
	await initPromise;
	if (!web3auth.connected) {
		console.log("Please connect your wallet first");
		return;
	}
	try {
		const web3 = new Web3(web3auth.provider);
		const contract = new web3.eth.Contract(contractABI, contractAddress);
		const accounts = await web3.eth.getAccounts();
		console.log(`Using account: ${accounts[0]}`);
		const tx = await contract.methods.voteArticle(articleId, vote).send({ from: accounts[0] });
		console.log("Article voted successfully:", tx);
	} catch (error) {
		console.error("Error voting on article:", error);
	}
}