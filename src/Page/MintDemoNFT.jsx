import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Web3 from "web3";
import { useNavigate } from "react-router-dom";

import demoNFTabi from "../contract/demoNFT.json";
const demoNFTaddress = "0x51e46C7bd052797E9c0635bac77C3855AAC35B3B";

export default function MintDemoNFT() {
  const [error, setError] = useState(null);
  const [balance, setBalance] = useState(null);
  const navigate = useNavigate();
  const demoNFTmintHandler = async () => {
    await setError(null);
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const { chainId } = await provider.getNetwork();
        console.log(chainId);
        if (chainId != 5) {
          const switchGoerli = await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: Web3.utils.toHex(5) }],
          });
        }
        const signer = provider.getSigner();
        const accounts = await ethereum.request({ method: "eth_accounts" });
        const account = accounts[0];
        const demoNFTcontract = new ethers.Contract(
          demoNFTaddress,
          demoNFTabi,
          signer
        );
        let mintdemo = await demoNFTcontract.mint(account, 3);
        console.log('mintdemo', mintdemo);
      } else {
        console.log("Object does not exist");
      }
    } catch (err) {
      console.log(err);
      await setError("Mint transaction failed. To mint a demo NFT, you must be on the Goerli network and cannot currently have an NFT minted.");
    }
  };
  const demoNFTremoveHandler = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const { chainId } = await provider.getNetwork();
        console.log(chainId);
        if (chainId != 5) {
          const switchGoerli = await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: Web3.utils.toHex(5) }],
          });
        }
        const signer = provider.getSigner();
        const accounts = await ethereum.request({ method: "eth_accounts" });
        const account = accounts[0];
        const demoNFTcontract = new ethers.Contract(
          demoNFTaddress,
          demoNFTabi,
          signer
        );
        let removedemo = await demoNFTcontract.burn(account, 3);
        console.log('removedemo', removedemo);
      } else {
        console.log("Object does not exist");
      }
    } catch (err) {
      console.log(err);
    }
  };
  const balancechecker = async () => {
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
        demoNFTaddress,
        demoNFTabi,
          signer
        );
        const demobalance = parseFloat(
          await erc20democontract.balanceOf(account, 3)
        );
        setBalance(demobalance);
        console.log('checked balance', balance);
      } else {
        console.log("Object does not exist");
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    const balancecheckerInterval = setInterval(() => {
      console.log('balancechecker interval');
      balancechecker();
    }, 5000);
    return () => clearInterval(balancecheckerInterval);
  }, []);
  balancechecker();
  return (
    <div>
       
      <div style={{width:'100%'}}>
        {balance > 0 ? (
            <>
            <div className="text-center" style={{width:'100%'}}>You currently have a minted credential NFT. You can now use the restricted ERC-20 faucet.</div>
            <div className="text-center" style={{width:'100%'}}><p className="text-center"><button  onClick={() => navigate("/faucet")} className="my-10 rounded bg-gray-500 py-2 px-4 text-3xl font-bold text-white hover:bg-gray-900">ERC-20 Faucet</button></p></div>
            <div className="text-center" style={{width:'100%'}}>
        <button
          onClick={demoNFTremoveHandler}
          className="my-10 rounded bg-gray-500 py-2 px-4 text-3xl font-bold text-white hover:bg-gray-900"
        >
          Burn Credential NFT
        </button>
      </div>
            </>
        ) : (
            <>
             <div className="text-center" style={{width:'100%'}}>
                <div className="text-center" >Use the button below to mint a demo credential NFT that enables the restricted ERC-20 faucet.</div>
                <div className="text-center" >
                <button
onClick={demoNFTmintHandler}
className="my-10 rounded bg-gray-500 py-2 px-4 text-3xl font-bold text-white hover:bg-gray-900"
>
Mint Credential NFT
</button>
                </div>
             
             </div>
             

</>
        )}
        
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
