import React from "react";
import { ethers } from "ethers";
import Web3 from "web3";
import erc20demoabi from "../contract/erc20demo.json";
const erc20demoaddress = "0x25d688279A0b5f6Dc1132F0BF07Fd357affDD58f";

export default function Faucet() {
  const erc20demomintHandler = async () => {
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
        const erc20democontract = new ethers.Contract(
          erc20demoaddress,
          erc20demoabi,
          signer
        );
        let mintdemo = await erc20democontract.mint(account);
        console.log(mintdemo);
      } else {
        console.log("Object does not exist");
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div>
      <button
        onClick={erc20demomintHandler}
        className="my-10 rounded bg-gray-500 py-2 px-4 text-3xl font-bold text-white hover:bg-gray-900"
      >
        Mint Demo Tokens
      </button>
    </div>
  );
}
