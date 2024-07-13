export let web3auth = null;
export let walletServicesPlugin = null;
export let initPromise = null;

async function init() {

  $(".btn-logged-in").hide();
  $("#sign-tx").hide();

  // const clientId = "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ"; // public ID
  const clientId = "BKKvD4b4JM8ltnzkKZj37FuIaxu0oaaeJyv-hpN5vceuHrejJdSL67rGkv5qgiacQ2g7-Lqmeq-AMn7EKzBg-G0"; // our ID

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
    web3AuthNetwork: "sapphire_devnet",
    uiConfig: {
      appName: "verified news",
      mode: "dark", // light, dark or auto
      loginMethodsOrder: ["google", "twitter"],
      logoLight: "https://web3auth.io/images/web3auth-logo.svg",
      logoDark: "https://web3auth.io/images/web3auth-logo---Dark.svg",
      defaultLanguage: "en", // en, de, ja, ko, zh, es, fr, pt, nl, tr
      loginGridCol: 3,
      primaryButton: "socialLogin", // "externalLogin" | "socialLogin" | "emailLogin"
    },
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
};

$("#login").click(async function (event) {
  try {
    await web3auth.connect();
    $(".btn-logged-out").hide();
    $(".btn-logged-in").show();
    uiConsole("Logged in Successfully!");
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


$("#logout").click(async function (event) {
  try {
    await web3auth.logout();
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
