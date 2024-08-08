import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import contractABI from './contract_abi.json';

function App() {

  const [walletAddress, setWalletAddress] = useState('');
  const [balance, setBalance] = useState(null);
  const CONTRACT_ADDRESS = '0xCE01DD4088D32B556433D83918F56d7f56Fb63Ef';
  const [contract, setContract] = useState(null);
  const [number, setNumber] = useState(null);


  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const getWalletAddress = async() => {
    try {
      await provider.send("eth_requestAccounts", []);

      const signer = provider.getSigner();

      const address = await signer.getAddress();
      console.log("Connected wallet address:", address);

      return address;
    } catch (error) {
      console.error("Error requesting account access or getting address:", error);
      throw error;
    }
  }

  useEffect(() => {
    const fetchWalletAddress = async () => {
      const address = await getWalletAddress();
      setWalletAddress(address);
    };

    fetchWalletAddress();

    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, provider);
    setContract(contract);

    const fetchNumber = async () => {
      const number = await contract.number();
      setNumber(number.toNumber());
    }

    fetchNumber();

  }, []);

  const getBalance = async () => {
  try {
      const balance = await provider.getBalance(walletAddress);
      setBalance(ethers.utils.formatEther(balance));
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  return (
    <div className="App">
      <h1>Check ETH Balance</h1>
      <p>Connected Wallet Address: { walletAddress }</p>
      <button onClick={getBalance}>Get Balance</button>
      {balance && (
        <div>
          <h2>Balance:</h2>
          <p>{balance} ETH</p>
        </div>
      )}
      <hr />
      <p>Smart Contract Address: { contract && contract.address }</p>
      <p>Number: { number }</p>
    </div>
  );
}

export default App;
