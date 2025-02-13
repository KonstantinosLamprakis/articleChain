import { isJournalist, getCredibility } from '../contract/read_data.js';
import { web3auth, initPromise } from "./init.js";

(async function fetchInfo() {

	await initPromise;

	try {
		if (web3auth.connected) {
			// Fetch user information
			const user = await web3auth.getUserInfo();
			const web3 = new Web3(web3auth.provider);
			const address = (await web3.eth.getAccounts())[0];
			const balance = web3.utils.fromWei(await web3.eth.getBalance(address), "ether");

			document.getElementById('profile-name').innerText = user.name || 'N/A';
			document.getElementById('email').innerText = user.email || 'N/A';
			document.getElementById('wallet-address').innerText = address || 'N/A';
			document.getElementById('eth-balance').innerText = balance || 'N/A';

			const profilePicture = document.getElementById('profile-picture');
			if (user.profileImage) {
				profilePicture.src = user.profileImage;
				console.log("Profile image URL set to: ", user.profileImage);
			} else {
				console.log("Profile image not available.");
			}
			//journalist score
			const journalistStatus = await isJournalist(address);
			document.getElementById('journalist-status').textContent = journalistStatus ? "Yes" : "No";
			if (journalistStatus){
				document.getElementById('credibility-score').textContent = await getCredibility(address);
			}
			else{
				document.getElementById('credibility-score').textContent = '0';
			}
		} else {
			console.log("You are not connected yet.");
		}
	} catch (error) {
		console.error('Error fetching user information:', error);
	}
})();
