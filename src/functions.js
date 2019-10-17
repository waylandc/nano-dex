import alasql from 'alasql';
import * as Ethers from 'ethers';
import * as oaxBrowserClient from '@oax/client';
import { BigNumber } from 'bignumber.js';

const config = {
  hubUrl: 'http://13.209.182.161:8899/',
  providerUrl: 'https://rinkeby.infura.io/v3/a30e841c5de34252bc7fd125ae3a5ffa',
  operatorAddress: '0x8AB600BAe889cD50b0C06b4cefa4c158d2674a6F',
  mediatorAddress: '0x0be14037032fcc9d3de01bDC0Fa709e3e0f210d1',
  assets: {
    WETH: '0x732C1F2558235B4d67277f82Db83A5dcF66888a3',
    OAX: '0x643CE1A2665F3C11696F8A1Cb147C6cc9268e685'
  },
  fee: {
    asset: 'OAX',
    amount: '0.00001'
  }
};

// config = {
//   hubUrl: "http://localhost:8899/",
//   providerUrl: "http://localhost:8545/",
//   operatorAddress: "0x67a91921971bC1E96d36302DB9E9bE53cC1761fD",
//   mediatorAddress: "0xd9be7C4483996c473B48bb943Af6B8dB342c2533",
//   assets: {
//     OAX: "0x5cc730910A35983ca3Aaf6367431665B3C27d7fC",
//     WETH: "0x646B2655d32EeE7441e819d746d1d0D7a5E40717"
//   },
//   fee: {
//     asset: "OAX",
//     amount: "0.00001"
//   }
// };
export async function loadClient(privKey) {
  const persistence = alasql;
  const provider = new Ethers.providers.JsonRpcProvider(config.providerUrl);
  const identity = new oaxBrowserClient.PrivateKeyIdentity(privKey, provider);

  // Update Wallet Status
  document.getElementById('walletAddress').innerHTML =
    'Wallet Loaded: ' + identity.address;

  await updateWalletEtherBalance(identity);

  // New oaxBrowserClient
  const hubClient = new oaxBrowserClient.L2Client(identity, config.hubUrl, {
    operatorAddress: config.operatorAddress,
    mediator: config.mediatorAddress,
    persistence: persistence
  });

  await hubClient.init();

  // Load Asset Registry
  const assetRegistry = new oaxBrowserClient.AssetRegistry();
  const assetNames = Object.keys(config.assets);
  for (let i = 0; i < assetNames.length; i++) {
    const name = assetNames[ i ];
    const address = config.assets[ name ];
    assetRegistry.add(name, address);
  }
  console.log(config.fee.amount);
  const fee = {
    asset: config.assets[ config.fee.asset ],
    amount: BigNumber(config.fee.amount).times('1e18')
  };

  // load exchangeClient
  var exchangeClient = new oaxBrowserClient.ExchangeClient(
    identity,
    hubClient,
    assetRegistry,
    {
      fee
    }
  );

  // Join the hub
  await exchangeClient.join();

  // Update html join status
  document.getElementById('status').innerHTML =
    'Joined Operator Successfully! </b> Operator Address: ' +
    config.operatorAddress;

  // Get token wallet balance
  await updateTokenWalletBalances(exchangeClient);
  // Get token exchange Balance
  await updateExchangeTokenBalances(exchangeClient);
  // fetchOB
  await updateOB(exchangeClient);

  return exchangeClient;
}

export async function updateOB(exchangeClient) {
  const symbol = 'OAX/WETH';
  let book = '<b> OAX/WETH OrderBook: </b> <br/>';
  const orderBook = await exchangeClient.fetchOrderBook(symbol);
  // console.log(JSON.stringify(orderBook, null, 4));

  if (orderBook.asks.length > 0) {
    for (var i = 0; i < orderBook.asks.length; i++) {
      const entry = orderBook.asks[ i ];
      book +=
        entry.amount.toString() +
        ' @ ' +
        entry.price.toString() +
        ' = ' +
        entry.amount.times(entry.price).toString() +
        '<br/>';
    }
  }
  book += '------------------- <br/> ';

  if (orderBook.bids.length > 0) {
    for (i = 0; i < orderBook.bids.length; i++) {
      const entry = orderBook.bids[ i ];
      book +=
        entry.amount.toString() +
        ' @ ' +
        entry.price.toString() +
        ' = ' +
        entry.amount.times(entry.price).toString() +
        '<br/>';
    }
  }

  document.getElementById('orderBook').innerHTML = book;
}

export async function updateWalletEtherBalance(identity) {
  // Update Wallet Balances
  const balance = await identity.getBalance();
  document.getElementById('walletBalance').innerHTML =
    'Wallet Ether Balance: ' + Ethers.utils.formatEther(balance);
}

export async function updateTokenWalletBalances(exchangeClient) {
  const assetNames = Object.keys(config.assets);

  tokenBalanceText = '<b> Wallet Token Balances:</b> <br/> <br/> ';

  for (i in assetNames) {
    const tokenAddress = config.assets[ assetNames[ i ] ];
    const provider = exchangeClient.identity.provider;

    const contract = oaxBrowserClient.getContract(
      tokenAddress,
      'ERC20',
      provider
    );

    const balanceInWei = await contract.balanceOf(
      exchangeClient.identity.address
    );
    const balance = Ethers.utils.formatEther(balanceInWei);

    tokenBalanceText +=
      '<b>' + assetNames[ i ] + '</b>' + '<br/> Balance: ' + balance + '<br/> ';
  }

  document.getElementById('walletBalanceTokens').innerHTML = tokenBalanceText;
}

export async function updateExchangeTokenBalances(exchangeClient) {
  const assetNames = Object.keys(config.assets);
  const tokenBalances = await exchangeClient.fetchBalances();

  tokenBalanceText = '<b> L2X Exchange Balances:</b> <br/> <br/>';

  for (var i in assetNames) {
    const free = tokenBalances[ assetNames[ i ] ][ 'free' ].toString();
    const used = tokenBalances[ assetNames[ i ] ][ 'locked' ].toString();

    tokenBalanceText +=
      '<b>' +
      assetNames[ i ] +
      '</b>' +
      '<br/> Free: ' +
      free +
      '<br/> Locked: ' +
      used +
      ' <br/> ';
  }

  document.getElementById('exchangeBalanceTokens').innerHTML = tokenBalanceText;
}

export async function buy(exchangeClient, symbol, amount) {
  console.log('Trying to buy ' + amount + ' ' + symbol);

  const assetAddr = exchangeClient.assetRegistry.symbolAddresses.get(symbol);

  const tx = await exchangeClient.identity.sendTransaction({
    to: assetAddr,
    value: Ethers.utils.parseEther(amount)
  });
  await tx.wait();
}

export async function deposit(exchangeClient, symbol, amount) {
  console.log('Trying to deposit ' + amount + ' ' + symbol);
  const assetAddr = exchangeClient.assetRegistry.symbolAddresses.get(symbol);
  await exchangeClient.deposit(assetAddr, amount, true);
}

export async function createOrder(exchangeClient, amount, price, side) {
  console.log('Trying to create order amount: ' + amount + ' price: ' + price);
  const result = await exchangeClient.createOrder(
    'OAX/WETH',
    'limit',
    side,
    BigNumber(amount),
    BigNumber(price)
  );
  console.log('Order placed successfully.');
  console.log(JSON.stringify(result, null, 4));
}

export async function requestWithdrawal(exchangeClient, symbol, amount) {
  const amt = BigNumber(amount);
  const assetAddr = exchangeClient.assetRegistry.symbolAddresses.get(symbol);
  const result = await exchangeClient.requestWithdrawalWithWeiConversion(
    assetAddr,
    amt
  );
  console.log(JSON.stringify(result, null, 4));
}