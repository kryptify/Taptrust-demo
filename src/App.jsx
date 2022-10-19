import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MetaMaskProvider } from "./hooks/useMetaMask";
import Home from "./Page/Home";
import MintQuadrata from "./Page/MintQuadrata";
import MintDemoNFT from "./Page/MintDemoNFT";
import Faucet from "./Page/Faucet";
import MainLayout from "./layouts/MainLayout";

function App() {
  return (
    <div className="flex min-h-screen items-center justify-center  text-white">
      <MetaMaskProvider>
        <BrowserRouter>
          <MainLayout />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="demo-nft" element={<MintDemoNFT />} />
            <Route path="quadrata" element={<MintQuadrata />} />
            <Route path="faucet" element={<Faucet />} />
          </Routes>
        </BrowserRouter>
      </MetaMaskProvider>
    </div>
  );
}

export default App;
