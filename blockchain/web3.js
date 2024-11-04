import Web3 from 'web3';

let web3;

if (window.ethereum) {
  // Modern dapp browsers (like MetaMask)
  web3 = new Web3(window.ethereum);
  try {
    // Request account access
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    
    // Check for connected accounts
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    if (accounts.length === 0) {
      console.error("No accounts found. Please connect to MetaMask.");
      return;
    }
  } catch (error) {
    console.error("User denied account access", error);
  }
} else if (window.web3) {
  // Legacy dapp browsers
  web3 = new Web3(window.web3.currentProvider);
} else {
  // If no Ethereum provider is detected, fall back to local node or Ganache
  const provider = new Web3.providers.HttpProvider('http://localhost:8545');
  web3 = new Web3(provider);
}

// Listen for account and network changes
if (window.ethereum) {
  window.ethereum.on('accountsChanged', function (accounts) {
    console.log('Accounts changed to:', accounts);
  });

  window.ethereum.on('chainChanged', (chainId) => {
    console.log('Network changed to:', chainId);
    window.location.reload(); // Reload the page if the network changes
  });
}

export default web3;
