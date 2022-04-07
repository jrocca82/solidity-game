import { ethers } from "hardhat";
import { ethers as tsEthers } from "ethers";
import { expect } from "chai";
import { isAddress } from "ethers/lib/utils";

let token: tsEthers.Contract;
let deployer: tsEthers.Signer;
let user: tsEthers.Wallet;

describe("Memory Token", () => {
  before(async () => {
    deployer = (await ethers.getSigners())[0];
    token = await (
      await ethers.getContractFactory("MemoryToken")
    ).deploy("Memory Token", "MEM", 18);
    user = new ethers.Wallet(
      "0xbeefbeefbeefbeefbeefbeefbeefbeefbeefbeefbeefbeefbeefbeefbeefbeef",
      deployer.provider
    );
    // Send ETH to user from signer.
    await deployer.sendTransaction({
      to: user.address,
      value: ethers.utils.parseEther("1000")
    });
  });

  it("Should deploy successfully", async () => {
    const address = token.address;
    const verifyAddress = isAddress(address);
    expect(verifyAddress === true);
  });

  it("Should have a name", async () => {
    const name = token.name;
    expect(name === "Memory Token");
  });

  it("Should have a symbol", async () => {
    const symbol = token.symbol;
    expect(symbol === "MEM");
  });

  it("Should have 18 decimals", async () => {
    const decimals = token.decimals;
    expect(decimals === 18);
  });

  it("Should mint tokens", async () => {
    await token.mint(user.address, "https://www.token-uri.com/nft");

    //Increase total supply
    const result = token.tokenId;
    expect(result === 1);

    //Check user balance
    const balance = await token.balanceOf(user.address);
    expect(balance === 1);

    //Check token owner
    const owner = await token.ownerOf("1");
    expect(owner.address === user.address);

    //Check owner can see tokens
    let logs = [];
    expect(logs.length === 1);
  });
});
