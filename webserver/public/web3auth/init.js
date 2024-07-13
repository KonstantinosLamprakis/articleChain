export let web3auth = null;
export let walletServicesPlugin = null;
export let initPromise = null;
export let contractABI = null;
export let contractAddress = "0x26f20aa4EBEcBB027f57b53DBcED5959F36C2AF2";

async function init() {

  await loadABI();

  $(".btn-logged-in").hide();
  $("#sign-tx").hide();

  // const clientId = "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ"; // public ID
  const clientId = "BKKvD4b4JM8ltnzkKZj37FuIaxu0oaaeJyv-hpN5vceuHrejJdSL67rGkv5qgiacQ2g7-Lqmeq-AMn7EKzBg-G0"; // our ID
  const chainConfig = {
    chainNamespace: "eip155",
    chainId: "0xaa36a7",
    rpcTarget: "https://rpc.ankr.com/eth_sepolia",
    displayName: "Ethereum Sepolia Testnet",
    blockExplorerUrl: "https://sepolia.etherscan.io",
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

async function loadABI() {
  try {
    const response = await fetch("/contract/abi.json");
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    contractABI = await response.json();
  } catch (error) {
    console.error("Failed to load ABI:", error);
  }
}

initPromise = init();
