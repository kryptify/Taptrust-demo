import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import Web3 from "web3";
import { JsonRpcSigner, Web3Provider } from "@ethersproject/providers";
import { Page, PageError } from "@quadrata/kyc-react";
import QUAD_PASSPORT_ABI from "../contract/Quadrata.json";
import { QuadrataKyc } from "@quadrata/kyc-react";

// Contact SpringLabs.com to request a testnet API key and a backend URL.
const API_KEY =
  "e46afbad64892adff74e1d55956247ba9d63cc49b21135d531f1e27d4575190e";
const BACKEND_URL =
  "https://prod-testnet-ky0x-processor-api.springlabs.network/v2";
const QUAD_PASSPORT_ADDRESS = "0xF4d4F629eDD73680767eb7b509C7C2D1fE551522";
const ErrorType = {
  INSUFFICIENT_FUNDS: "INSUFFICIENT_FUNDS",
  OTHER: "OTHER",
};

export default function MintQuadrata() {
  // State
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signature, setSignature] = useState(null);
  const [mintComplete, setMintComplete] = useState(false);
  const [transactionHash, setTransactionHash] = useState(null);
  const checkWalletIsConnected = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      console.log("Make sure you have Metamask installed.");
      return;
    } else {
      console.log("Wallet exists!,We're ready to go!");
    }
    const accounts = await ethereum.request({ method: "eth_accounts" });
    if (accounts.length !== 0) {
      const userAccount = accounts[0];
      console.log("Found an authorized account:", userAccount);
      setAccount(userAccount);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);
      // Getting current chainId
      const { chainId } = await provider.getNetwork();
      if (chainId != 5) {
        const switchGoerli = await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: Web3.utils.toHex(5) }],
        });
      }
      console.log(chainId);
      setChainId(5);
    } else {
      console.log("No aurhorized account found");
      setAccount(null);
    }
  };
  useEffect(() => {
    checkWalletIsConnected();
  }, []);

  // Event Handlers

  const handleSign = async () => {
    // User clicked the initial sign button
    // Signing the message and updating state.
    // kyc form will automatically navigate to the next step upon signature update
    // Getting account address & signer.
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    setSigner(signer);
    const accounts = await ethereum.request({ method: "eth_accounts" });
    const account = accounts[0];
    setAccount(account);
    if (signer && account) {
      const signature = await signer.signMessage(
        "Welcome to Quadrata! By signing, you agree to the Terms of Service."
      );
      setSignature(signature);
    }
  };

  const handleMintClick = async ({ params, signature, signatureIssuer }) => {
    // User clicked Approve & Mint Passport button
    // the parameters that are being passed to this function is all you need to mint the passport on chain

    // QuadPassport contract interface (you may use any provider or library to interact with the blockchain)
    const quadPassportContract = new ethers.Contract(
      QUAD_PASSPORT_ADDRESS,
      QUAD_PASSPORT_ABI,
      provider
    );

    if (signer) {
      try {
        // Minting passport
        const transaction = await quadPassportContract
          .connect(signer)
          .setAttributes(params, signatureIssuer, signature, {
            value: params.fee,
          });
        // Setting the transaction hash prop (required)
        // When defined, the from will automatically navigate to the "minting in progress" page
        // the tx hash will be added to the "View in Etherscan" link
        setTransactionHash(transaction.hash);
        transaction
          .wait()
          .then((receipt) => {
            // Setting the mintComplete prop to true (required)
            // The form will automatically navigate to the last page.
            console.log("Passport minted successfully...", receipt);
            setMintComplete(true);
          })
          .catch((error) => {
            // Setting the mintComplete prop to false
            // You may handle errors here
            console.error("Passport minting failed, ", error);
            setMintComplete(false);
          });
      } catch (e) {
        // Catching insufficient funds error
        if (e && e.code === ErrorType.INSUFFICIENT_FUNDS) {
        }
        // Caching any other errors here
      }
    } else {
      console.error("Missing required params to mint: ", { signer });
    }
  };

  if (!account) {
    return (
      <div>
        Sign into your wallet and refresh to continue.
      </div>
    )
  }

  if (!chainId || !API_KEY) {
    return null;
  }

  return (
    <div className="mt-24">
      <QuadrataKyc
        apiKey={API_KEY}
        onSign={handleSign}
        chainId={chainId}
        account={account}
        signature={signature}
        backendUrl={BACKEND_URL}
        onMintClick={handleMintClick}
        mintComplete={mintComplete}
        transactionHash={transactionHash}
      >
        <div>Loading Quadrata component...</div>
      </QuadrataKyc>
    </div>
  );
}
