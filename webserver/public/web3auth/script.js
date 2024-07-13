import { web3auth, walletServicesPlugin, initPromise } from "./init.js";

$("#login").click(async function (event) {
  try {
    await initPromise;
    await web3auth.connect();
    $(".btn-logged-out").hide();
    $(".btn-logged-in").show();
    uiConsole("Logged in Successfully!");
  } catch (error) {
    console.error(error.message);
  }
});

$("#show-wallet").click(async function (event) {
  await initPromise;
  uiConsole(walletServicesPlugin.status);
  if (walletServicesPlugin.status == "connected") {
    await walletServicesPlugin.showWalletUi();
  }
});

$("#logout").click(async function (event) {
  try {
    await initPromise;
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

