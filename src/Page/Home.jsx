import React from "react";
import { Navigate, useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const mintButton = () => {
    return (
      <button
        onClick={() => navigate("/Mint")}
        className="my-10 rounded bg-gray-500 py-2 px-4 text-3xl font-bold text-white hover:bg-gray-900"
      >
        Mint Quadrata Passport
      </button>
    );
  };
  const faucetButton = () => {
    return (
      <button
        onClick={() => navigate("/Faucet")}
        className="my-10 rounded bg-gray-500 py-2 px-4 text-3xl font-bold text-white hover:bg-gray-900"
      >
        Faucet Demo
      </button>
    );
  };

  return (
    <div className="flex-col items-center justify-center">
      <div>{mintButton()}</div>
      <div>{faucetButton()}</div>
    </div>
  );
}
