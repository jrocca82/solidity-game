import React, { Component } from "react";
import { ethers } from "ethers";
import "./App.css";
//Note: Must run hh:compile to produce .build folder with abi
import MemoryToken from "../build/src/contracts/MemoryToken.sol/MemoryToken.json";
import brain from "./images/brain.png";
import detectEthereumProvider from "@metamask/detect-provider";
import MetaMask from "./images/Metamask";
import fries from "./images/fries.png";
import cheeseburger from "./images/cheeseburger.png";
import hotdog from "./images/hotdog.png";
import icecream from "./images/ice-cream.png";
import milkshake from "./images/milkshake.png";
import pizza from "./images/pizza.png";
import blank from "./images/blank.png";
import white from "./images/white.png";

const CARD_ARRAY = [
  {
    name: "cheeseburger",
    img: cheeseburger,
  },
  {
    name: "fries",
    img: fries,
  },
  {
    name: "hotdog",
    img: hotdog,
  },
  {
    name: "icecream",
    img: icecream,
  },
  {
    name: "milkshake",
    img: milkshake,
  },
  {
    name: "pizza",
    img: pizza,
  },
  {
    name: "cheeseburger",
    img: cheeseburger,
  },
  {
    name: "fries",
    img: fries,
  },
  {
    name: "hotdog",
    img: hotdog,
  },
  {
    name: "icecream",
    img: icecream,
  },
  {
    name: "milkshake",
    img: milkshake,
  },
  {
    name: "pizza",
    img: pizza,
  },
];

const MemoryGame: React.FC = () => {
  // Connect to Web3 provider
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const [account, setAccount] = React.useState<string | undefined>("0x0");
  const [tokenArray, setTokenArray] = React.useState<string[]>([]);
  const [cardsChosen, setCardsChosen] = React.useState<string[]>([]);
  const [cardsChosenId, setCardsChosenId] = React.useState<number[]>([]);
  const [cardsWon, setCardsWon] = React.useState<number[]>([]);

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

  const randomCardArray = CARD_ARRAY.sort(() => 0.5 - Math.random());

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
    return tokenArray;
  };

  const chooseImage = (cardId) => {
    cardId = cardId.toString();
    //@ts-ignore
    if (cardsWon.includes(cardId)) {
      return white;
    }
    //@ts-ignore
    else if (cardsChosenId.includes(cardId)) {
      return randomCardArray[cardId].img;
    } else {
      return blank;
    }
  };

  const flipCard = async (cardId: number) => {
    let alreadyChosen = cardsChosen.length;
    setCardsChosen([...cardsChosen, CARD_ARRAY[cardId].name]);
    setCardsChosenId([...cardsChosenId, cardId]);

    if (alreadyChosen === 1) {
      setTimeout(checkForMatch, 100);
    }
  };

  const getAttribute = (event) => event.target.getAttribute("data-id");

  const checkForMatch = async () => {
    const optionOneId = cardsChosenId[0];
    const optionTwoId = cardsChosenId[1];

    if (optionOneId == optionTwoId) {
      alert("You have clicked the same image!");
    } else if (cardsChosen[0] === cardsChosen[1]) {
      alert("You found a match");
      token.methods
        .mint(account, CARD_ARRAY[optionOneId].img.toString())
        .send({ from: account })
        .on("transactionHash", (hash) => {
          setCardsWon([...cardsWon, optionOneId, optionTwoId]);
          setTokenArray([...tokenArray, CARD_ARRAY[optionOneId].img]);
        });
    } else {
      alert("Sorry, try again");
    }
    setCardsChosen([]);
    setCardsChosenId([]);
    if (cardsWon.length === CARD_ARRAY.length) {
      alert("Congratulations! You found them all!");
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
        <div className="game-wrapper">
          <div className="matching-grid">
            {randomCardArray.map((card, key) => {
              return (
                <img
                  key={key}
                  data-id={key}
                  //@ts-ignore
                  src={chooseImage(key)}
                  className="game-piece"
                  onClick={(event) => {
                    let cardId = getAttribute(event);
                    //@ts-ignore
                    if (!cardsWon.includes(cardId.toString())) {
                      flipCard(cardId);
                    }
                  }}
                />
              );
            })}
          </div>
        </div>
        <div>
          <h5>
            Tokens Collected:<span id="result">&nbsp;{tokenArray.length}</span>
          </h5>
          <button onClick={updateTokens}>Refresh Tokens</button>

          <div className="grid mb-4">
            {tokenArray.map((tokenURI, key) => {
              return <img key={key} src={fries} className="token" />;
            })}
          </div>
        </div>
      </main>
    </body>
  );
};

export default MemoryGame;
