import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { updateTokenWalletBalances, 
  updateWalletEtherBalance, 
  updateExchangeTokenBalances,
  updateOB,
  loadClient,
  createOrder
} from './functions.js';

ReactDOM.render(
  <App />,
  // eslint-disable-next-line no-undef
  document.getElementById('root')
);

var exchangeClient = undefined; //

function loadPrivKey() {
  var privKey = prompt(
    'Please enter your wallet private key',
    'Harry Potter'
  );
  if (privKey != null) {
    exchangeClient = loadClient(privKey);
    // sleep(20000).then(() => {
    //   console.log('Exch Client')
    //   console.log(exchangeClient)
    // })
  }
}

async function refreshBalances() {
  await updateTokenWalletBalances(exchangeClient);
  await updateWalletEtherBalance(exchangeClient.identity);
  await updateExchangeTokenBalances(exchangeClient);
}
async function refreshOB() {
  await updateOB(exchangeClient);
}

async function refreshFrontEnd() {
  await refreshOB();
  await refreshBalances();
}

async function buyWETH() {
  var amount = prompt('Please enter amount of WETH', '0.001');
  amount = amount.toString();
  await buy(exchangeClient, 'WETH', amount);
  await refreshFrontEnd();
}

async function buyOAX() {
  var amount = prompt('Please enter amount of OAX', '0.001');
  amount = amount.toString();
  await buy(exchangeClient, 'OAX', amount);
  await refreshFrontEnd();
}

async function depositWETH() {
  var amount = prompt('Please enter amount of WETH', '0.001');
  amount = amount.toString();
  await deposit(exchangeClient, 'WETH', amount);
  await refreshFrontEnd();
}

async function depositOAX() {
  var amount = prompt('Please enter amount of OAX', '0.001');
  amount = amount.toString();
  await deposit(exchangeClient, 'OAX', amount);
}

async function uxcreateOrderBuy() {
  var amount = prompt('Please enter amount', '0.001');
  amount = amount.toString();

  var price = prompt('Please enter price', '0.001');
  price = price.toString();
  await createOrder(exchangeClient, amount, price, 'buy');
  await refreshFrontEnd();
}

async function uxcreateOrderSell() {
  var amount = prompt('Please enter amount', '0.001');
  amount = amount.toString();

  var price = prompt('Please enter price', '0.001');
  price = price.toString();
  await createOrder(exchangeClient, amount, price, 'sell');
  await refreshFrontEnd();
}

async function requestWithdrawalWETH() {
  var amount = prompt('Please enter amount', '0.001');
  amount = amount.toString();
  await requestWithdrawal(exchangeClient, 'WETH', amount);
  await refreshFrontEnd();
}
async function requestWithdrawalOAX() {
  var amount = prompt('Please enter amount', '0.001');
  amount = amount.toString();
  await requestWithdrawal(exchangeClient, 'OAX', amount);
  await refreshFrontEnd();
}

window.setInterval(async function() {
  try {
    console.log('Background balance & ob update');
    await refreshFrontEnd();
  } catch (e) {
    console.log('Please load your wallet!');
  }
}, 5000);

function sleep(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}
