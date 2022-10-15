import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MetaMaskProvider } from "./hooks/useMetaMask";
import Home from "./Page/Home";
import Mint from "./Page/Mint";
import Faucet from "./Page/Faucet";
import MainLayout from "./layouts/MainLayout";

function App() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center  text-white">
      <MetaMaskProvider>
        <BrowserRouter>
          <MainLayout />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="Mint" element={<Mint />} />
            <Route path="Faucet" element={<Faucet />} />
          </Routes>
        </BrowserRouter>
      </MetaMaskProvider>
    </div>
  );
}

export default App;
