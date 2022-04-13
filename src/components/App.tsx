import React, { Component, useCallback } from "react";
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

let CARD_ARRAY = [
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
  //Set states
  const [account, setAccount] = React.useState<string | undefined>("0x0");
  const [tokenArray, setTokenArray] = React.useState<string[]>([]);
  const [cardsChosen, setCardsChosen] = React.useState<string[]>([]);
  const [cardsChosenId, setCardsChosenId] = React.useState<(string | number)[]>(
    []
  );
  const [cardsWon, setCardsWon] = React.useState<(string | number)[]>([]);

  // Connect to Web3 provider
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  // Account signer...
  const signer = provider.getSigner();

  //Connect user metamask
  const connectMetamask = async () => {
    await provider.send("eth_requestAccounts", []);
    setAccount(await signer.getAddress());
  };

  //Connect contract
  const abi = MemoryToken.abi;
  var tokenAddress = "0x0431eddEFC03a2DB949411DE234b674818F7b8c3";

  const token = new ethers.Contract(tokenAddress, abi, signer);

  //Check user connection
  //@ts-ignore
  const connected = ethereum.isConnected();

  //Front end logic
  React.useEffect(() => {
    const randomCardArray = () => CARD_ARRAY.sort(() => 0.5 - Math.random());
    CARD_ARRAY = randomCardArray();
  }, []);

  //Update Tokens won
  const updateTokens = async () => {
    const totalSupply = await token.balanceOf(signer._address);
    for (let i = 0; i < totalSupply; i++) {
      let id = token.tokenOfOwnerByIndex(signer._address, i);
      let tokenURI = token.tokenURI(id);
      setTokenArray(tokenURI);
    }
    return tokenArray;
  };

  //Image src attribute
  const getAttribute = (event) => event.target.getAttribute("data-id");

  const chooseImage = (cardId: number | string) => {
    cardId = cardId.toString();
    if (cardsWon.includes(cardId)) {
      return white;
    } else if (cardsChosenId.includes(cardId)) {
      return CARD_ARRAY[cardId].img;
    } else {
      return blank;
    }
  };

  //Game logic
  React.useEffect(() => {
    if (cardsChosen.length !== 2) {
      return;
    }
    checkForMatch();
  }, [cardsChosenId, cardsChosen]);

  const flipCard = async (cardId: number) => {
    setCardsChosen([...cardsChosen, CARD_ARRAY[cardId].name]);
    setCardsChosenId([...cardsChosenId, cardId]);
  };

  const checkForMatch = async () => {
    const optionOneId = cardsChosenId[0];
    const optionTwoId = cardsChosenId[1];

    if (optionOneId == optionTwoId) {
      alert("You have clicked the same image!");
    } else if (cardsChosen[0] === cardsChosen[1]) {
      alert("You found a match!");
      //Mint and send token
      await token.mint(account, CARD_ARRAY[optionOneId].img.toString());
      await token.send({ from: account });
      token.on("transactionHash", () => {
        setCardsWon([...cardsWon, optionOneId, optionTwoId]);
        setTokenArray([...tokenArray, CARD_ARRAY[optionOneId].img]);
      });
    } else {
      alert("Sorry, try again");
    }

    //Reset game
    setCardsChosen([]);
    setCardsChosenId([]);

    //Game end
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
        {connected === true ? (
          <></>
        ) : (
          <h5 className="alert">
            Please connnect your metamask before playing!
          </h5>
        )}
        <div className="game-wrapper">
          <div className="matching-grid">
            {CARD_ARRAY.map((_, key) => {
              return (
                <img
                  key={key}
                  data-id={key}
                  src={chooseImage(key)}
                  className="game-piece"
                  onClick={(event) => {
                    let cardId = getAttribute(event);
                    if (!cardsWon.includes(cardId)) {
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
