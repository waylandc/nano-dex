/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React from 'react';
import Web3 from 'web3';
import { loadClient } from './functions.js';

// export default () => (
// 	<div>
// 		<h1>Welcome to React Parcel Micro App!</h1>
// 		<p>Hard to get more minimal than this React app.</p>
// 	</div>
// );

class App extends React.Component {
  componentDidMount() {
    if (window.ethereum) {
      web3 = new Web3(window.ethereum);
      try {
        window.ethereum.enable().then(function () {
          // User has allowed account access to DApp...
        });
      } catch (e) {
        // User has denied account access to DApp...
      }
    } else if (window.web3) {
      web3 = new Web3(window.web3.currentProvider);
    } else {
      alert('You have to install MetaMask');
    }
  }
  badrender() {
    return (
      <div>
        <h1>
          Welcome to OAX L2X Starter DEX
        </h1> 
        <p>This needs to be replaced with a proper title/welcome page</p>
        <button
          onClick={function () {
            // eslint-disable-next-line no-undef
            alert('click');
          }}
        >
          Proceed
        </button>
      </div>
    );
  }

  render() {
    return (
      <div>
        <p><b>Welcome to OAX Exchange</b></p>

        <p>Click the button below to enter your private key.</p>
    
        <button onClick={function () {
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
          
        }}
        >
          Enter Private Key</button>
        <p id="walletAddress"></p>
        <p id="walletBalance"></p>
        <p id="status">Not Connected to Operator</p>
        <button onClick="buyWETH()">Buy Testnet WETH</button>
        <button onClick="buyOAX()">Buy Testnet OAX</button>
        <button onClick="depositWETH()">Deposit Testnet WETH</button>
        <button onClick="depositOAX()">Deposit Testnet OAX</button>
        <p id="walletBalanceTokens"></p>
        <p id="exchangeBalanceTokens"></p>
        <button onClick="refreshBalances()">Refresh Balances</button>
        <button onClick="refreshOB()">Refresh OB</button>
        <p id="orderBook"></p>
        <button onClick="createOrderBuy()">CreateOrder BUY</button>
        <button onClick="createOrderSell()">CreateOrder SELL</button>
        <p id="-----------------------"></p>
        <button onClick="requestWithdrawalOAX()">requestWithdrawalOAX</button>
        <button onClick="requestWithdrawalWETH()">requestWithdrawalWETH</button>
    
      </div>
    );
  }

}

export default App;
