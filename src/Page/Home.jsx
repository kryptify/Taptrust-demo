import React from "react";
import { Navigate, useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const mintQuadrataButton = () => {
    return (
      <button
        onClick={() => navigate("/quadrata")}
        className="mb-3 mt-10 rounded bg-gray-500 py-2 px-4 text-3xl font-bold text-white hover:bg-gray-900"
      >
        Mint Quadrata Passport NFT
      </button>
    );
  };
  const mintERC1155Button = () => {
    return (
      <button
        onClick={() => navigate("/demo-nft")}
        className="my-3 rounded bg-gray-500 py-2 px-4 text-3xl font-bold text-white hover:bg-gray-900"
      >
        Mint Demo Credential NFT
      </button>
    );
  };
  const faucetButton = () => {
    return (
      <button
        onClick={() => navigate("/faucet")}
        className="my-3 rounded bg-gray-500 py-2 px-4 text-3xl font-bold text-white hover:bg-gray-900"
      >
        Restricted ERC-20 Faucet
      </button>
    );
  };

  return (
    <div className="flex-col items-center justify-center" style={{maxWidth: '800px'}}>
      <div>
        This app demonstrates a faucet for a restricted ERC-20 token that uses
        the TapTrust protocol to require a supported credential for all token
        holders using an on-chain credential requirement registry.
      </div>
      <br/>
      <div>
        Supported credentials can be provided either by a <a>Verite</a> verifier or with a credential NFT added to the credential requirement registry.
      </div>
      <br />
      <div>
        To enable the demo faucet, either complete Quadrata Passport
        verification or mint a demo NFT.
      </div>
      <div>{mintQuadrataButton()}</div>
      <div>{mintERC1155Button()}</div>
      <div>{faucetButton()}</div>
    </div>
  );
}
