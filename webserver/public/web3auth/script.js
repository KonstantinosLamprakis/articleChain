export let web3auth = null;
export let walletServicesPlugin = null;
export let initPromise = null;

(async function init() {
  $(".btn-logged-in").hide();
  $("#sign-tx").hide();

  const clientId = "BKKvD4b4JM8ltnzkKZj37FuIaxu0oaaeJyv-hpN5vceuHrejJdSL67rGkv5qgiacQ2g7-Lqmeq-AMn7EKzBg-G0";

  const chainConfig = {
    chainNamespace: "eip155",
    chainId: "0x1",
    rpcTarget: "https://rpc.ankr.com/eth",
    displayName: "Ethereum Mainnet",
    blockExplorerUrl: "https://etherscan.io/",
    ticker: "ETH",
    tickerName: "Ethereum",
  };

  const privateKeyProvider = new window.EthereumProvider.EthereumPrivateKeyProvider({ config: { chainConfig } });

  web3auth = new window.Modal.Web3Auth({
    clientId,
    privateKeyProvider,
    web3AuthNetwork: "sapphire_mainnet",
  });

  // Add wallet service plugin
  walletServicesPlugin = new window.WalletServicesPlugin.WalletServicesPlugin();
  web3auth.addPlugin(walletServicesPlugin); // Add the plugin to web3auth

  await web3auth.initModal();

  if (web3auth.connected) {
    $(".btn-logged-in").show();
    $(".btn-logged-out").hide();
    if (web3auth.connected === "openlogin") {
      $("#sign-tx").show();
    }
  } else {
    $(".btn-logged-out").show();
    $(".btn-logged-in").hide();
  }
})();

$("#login").click(async function (event) {
  try {
    // IMP START - Login
    await web3auth.connect();
    // IMP END - Login
    $(".btn-logged-out").hide();
    $(".btn-logged-in").show();
    uiConsole("Logged in Successfully!");
  } catch (error) {
    console.error(error.message);
  }
});

$("#get-user-info").click(async function (event) {
  try {
    // IMP START - Get User Information
    const user = await web3auth.getUserInfo();
    // IMP END - Get User Information
    uiConsole(user);
  } catch (error) {
    console.error(error.message);
  }
});

// IMP START - Blockchain Calls
$("#get-accounts").click(async function (event) {
  try {
    const web3 = new Web3(web3auth.provider);

    // Get user's Ethereum public address
    const address = await web3.eth.getAccounts();
    uiConsole(address);
  } catch (error) {
    console.error(error.message);
  }
});

$("#get-balance").click(async function (event) {
  try {
    const web3 = new Web3(web3auth.provider);

    // Get user's Ethereum public address
    const address = (await web3.eth.getAccounts())[0];

    // Get user's balance in ether
    const balance = web3.utils.fromWei(
      await web3.eth.getBalance(address), // Balance is in wei
      "ether"
    );
    uiConsole(balance);
  } catch (error) {
    console.error(error.message);
  }
});

$("#show-wallet").click(async function (event) {
  // print status in console
  uiConsole(walletServicesPlugin.status);
  if (walletServicesPlugin.status == "connected") {
    // check if wallet is connected
    await walletServicesPlugin.showWalletUi();
  }
});

$("#sign-message").click(async function (event) {
  try {
    const web3 = new Web3(web3auth.provider);
    // Get user's Ethereum public address
    const fromAddress = (await web3.eth.getAccounts())[0];

    const originalMessage = "YOUR_MESSAGE";

    // Sign the message
    const signedMessage = await web3.eth.personal.sign(
      originalMessage,
      fromAddress,
      "test password!" // configure your own password here.
    );
    uiConsole(signedMessage);
  } catch (error) {
    console.error(error.message);
  }
});
// IMP END - Blockchain Calls

$("#logout").click(async function (event) {
  try {
    // IMP START - Logout
    await web3auth.logout();
    // IMP END - Logout
    $(".btn-logged-in").hide();
    $(".btn-logged-out").show();
  } catch (error) {
    console.error(error.message);
  }
});

function uiConsole(...args) {
  const el = document.querySelector("#console>p");
  if (el) {
    el.innerHTML = JSON.stringify(args || {}, null, 2);
    console.log(...args);
  }
}

initPromise = init();
