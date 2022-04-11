import React, { Component } from "react";
import { ethers } from "ethers";
import "./App.css";
//Note: Must run hh:compile to produce .build folder with abi
import MemoryToken from "../build/src/contracts/MemoryToken.sol/MemoryToken.json";
import brain from "../brain.png";
import detectEthereumProvider from "@metamask/detect-provider";
import MetaMask from "./Metamask";

const MemoryGame: React.FC = () => {
  // Connect to Web3 provider
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const [account, setAccount] = React.useState<string | undefined>("0x0");
  const [tokenArray, setTokenArray] = React.useState<[]>([]);

  // Account signer...
  const signer = provider.getSigner();

  //Connect contract
  const abi = MemoryToken.abi;
  const token = new ethers.Contract(
    "0x0431eddEFC03a2DB949411DE234b674818F7b8c3",
    abi,
    signer
  );

  //@ts-ignore
  const connected = ethereum.isConnected();

  const connectMetamask = async () => {
    await provider.send("eth_requestAccounts", []);
  };

  const updateTokens = async () => {
    const userAddress = setAccount(await signer.getAddress());
    const totalSupply = await token.balanceOf(userAddress);
    for (let i = 0; i < totalSupply; i++) {
      let id = token.tokenOfOwnerByIndex(userAddress, i);
      let tokenURI = token.tokenURI(id);
      setTokenArray(tokenURI);
    }
  };

  return (
    <body>
      <div className="headerBar">
        <a
          className="titleWrapper"
          href="http://www.roccabusiness.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={brain}
            width="30"
            height="30"
            className="headerIcon"
            alt=""
          />
          <h2 className="headerTitle">Memory Tokens</h2>
        </a>
      </div>

      <main>
        <div className="web3">
          {connected == true ? (
            <span className="account">Connected to: {account}</span>
          ) : (
            <span className="account">
              Connect your Metamask:
              <div className="metamaskWrapper">
                <MetaMask onClick={connectMetamask} />
              </div>
            </span>
          )}
          <a href="https://rinkeby.etherscan.io/address/0x0431eddefc03a2db949411de234b674818f7b8c3">
            <span className="account">Rinkeby Contract ({token.address})</span>
          </a>
        </div>
        <div className="grid mb-4">{/* Code goes here... */}</div>
        <div>
          {/* Code goes here... */}

          <div className="grid mb-4">{/* Code goes here... */}</div>
        </div>
      </main>
    </body>
  );
};

export default MemoryGame;
