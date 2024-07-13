import { web3auth, contractABI, contractAddress } from "./init.js";

export async function contract_op() {
	if (!web3auth.connected) {
		console.log("Please connect your wallet first");
		return;
	}
	try {
		const web3 = new Web3(web3auth.provider);
		const contract = new web3.eth.Contract(contractABI, contractAddress);

		const message = await contract.methods.getArticle(1).call();
		console.log(message["is_evaluated"]);
	} catch (error) {
		console.error("Error contract:", error);
		if (error?.data) {
			console.error("Error data:", error.data);
		}
		return false;
	}
}

export async function addJournalist(journalistAddress) {
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
		console.error("Error creating article:", error);
		return false;
	}
}

export async function evaluateArticle(articleId, approve, comment) {
	if (!web3auth.connected) {
		console.log("Please connect your wallet first");
		return;
	}
	try {
		const web3 = new Web3(web3auth.provider);
		const contract = new web3.eth.Contract(contractABI, contractAddress);
		const accounts = await web3.eth.getAccounts();
		console.log(`Using account: ${accounts[0]}`);
		const tx = await contract.methods.evaluateArticle(articleId, approve, comment).send({ from: accounts[0] });
		console.log("Article evaluated successfully:", tx);
	} catch (error) {
		console.error("Error evaluating article:", error);
	}
}

export async function voteArticle(articleId, vote) {
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