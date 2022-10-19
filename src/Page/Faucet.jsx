import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Web3 from "web3";
import erc20demoabi from "../contract/erc20demo.json";
const erc20demoaddress = "0x29D1192326EF75D8BEB62F7f53f4c335D8C119Bc";

const MINTING_MESSAGE = 'Minting ERC-20 Token...';

export default function Faucet() {
  const [balance, setBalance] = useState(0);
  const [error, setError] = useState(null);
  const [faucetTxMessage, setFaucetTxMessage] = useState(null);
  const erc20demomintHandler = async () => {
    await setError(null);
    try {
      const { ethereum } = window;
      if (!ethereum) {
        return alert('Sign into a web3 wallet to continue');
      }
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        if (!provider) {
          return alert('Sign into a web3 wallet to continue');
        }
        const signer = provider.getSigner();
        const accounts = await ethereum.request({ method: "eth_accounts" });
        if (!signer || !accounts || accounts.length === 0) {
          return alert('Sign into a web3 wallet to continue');
        }
        const account = accounts[0];
        const erc20democontract = new ethers.Contract(
          erc20demoaddress,
          erc20demoabi,
          signer
        );
        console.log('setting mint message');
        setFaucetTxMessage(MINTING_MESSAGE);
        let mintdemo = await erc20democontract.mint(account);
        console.log('mintdemo', mintdemo);
        setTimeout(async () => {
          const demobalance = parseFloat(
            await erc20democontract.balanceOf(account)
          );
          setBalance(demobalance / 10 ** 18);
          console.log('balance after minting', balance);
          setTimeout(function() { setFaucetTxMessage(null); }, 10000);
        }, [5000]);
      } else {
        console.log("Object does not exist");
      }
    } catch (err) {
      console.log(err);
      setFaucetTxMessage(null);
      await setError(
        "Faucet transaction failed. Please check that you have a supported credential and try again."
      );
    }
  };

  const balancechecker = async () => {
    if (faucetTxMessage) {
      return;
    }
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const { chainId } = await provider.getNetwork();
        console.log('chainId', chainId);
        if (chainId != 5) {
          const switchGoerli = await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: Web3.utils.toHex(5) }],
          });
        }
        const signer = provider.getSigner();
        const accounts = await ethereum.request({ method: "eth_accounts" });
        const account = accounts[0];
        const erc20democontract = new ethers.Contract(
          erc20demoaddress,
          erc20demoabi,
          signer
        );
        const demobalance = parseFloat(
          await erc20democontract.balanceOf(account)
        );
        setFaucetTxMessage(null);
        setBalance(demobalance / 10 ** 18);
        console.log('checked balance', balance);
      } else {
        console.log("Object does not exist");
      }
    } catch (err) {
      setFaucetTxMessage(null);
      console.log(err);
    }
  };
  useEffect(() => {
    const balancecheckerInterval = setInterval(() => {
      console.log('balancechecker interval');
      balancechecker();
    }, 15000);
    return () => clearInterval(balancecheckerInterval);
  }, []);
  balancechecker();
  

  return (
    <div>
      
     {(balance || faucetTxMessage) && (
      <div className="flex justify-center">
        <button className="my-14 rounded py-2 px-4 text-5xl font-bold text-white bg-gray-800">
        {faucetTxMessage === MINTING_MESSAGE ?  (<span>{faucetTxMessage}</span>) : balance ? (<span>Restricted ERC-20 Token Balance: {balance}</span>) : faucetTxMessage ? (<span>{faucetTxMessage}</span>) : ''}
        </button>
      </div>
     )} 
      <p>Use the button below to mint 1 restricted ERC-20 token. A valid NFT or Verite credential is required.</p>
      <div className="flex justify-center">
        <button
          onClick={erc20demomintHandler}
          className="my-10 rounded bg-gray-500 py-2 px-4 text-3xl font-bold text-white hover:bg-gray-900"
        >
          Mint 1 Demo ERC-20 Token
        </button>
      </div>
      {error && (
        <div
          className="relative rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"
          role="alert"
        >
          <strong className="font-bold">Error: {error}</strong>
        </div>
      )}
    </div>
  );
}
