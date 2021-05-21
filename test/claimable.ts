import { expect } from "chai";
import Merkletree from "merkletreejs";
import keccak256 from "keccak256";
import { Contract } from "ethers";
import { ethers } from "hardhat";
import { BAGToken } from "../codegen";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

async function deploy<T extends Contract>(
  contractName: string,
  ...args: any[]
): Promise<T> {
  return (await (
    await ethers.getContractFactory(contractName)
  ).deploy(...args)) as T;
}

// assert
describe("BAGToken", function () {
  // For test purpose, let's use the 10 accounts provided by hardhat and pretend they are a much bigger user base (ex: uniswap token holders)
  let tokenHolders: SignerWithAddress[];
  let bagToken: BAGToken;
  let tree: Merkletree;
  let leaves: string[];
  let signer: SignerWithAddress;

  before(async () => {
    // For test purpose, let's use the 10 accounts provided by hardhat and pretend they are a much bigger user base (ex: uniswap token holders from etherscan)
    tokenHolders = await ethers.getSigners();
    signer = tokenHolders[0];
    leaves = tokenHolders.map((th) => th.address);
    tree = new Merkletree(leaves, keccak256);
    const root = tree.getHexRoot();
    bagToken = await deploy<BAGToken>("BAGToken", root);
  });

  describe("Claim token", () => {
    it("should be able to claim the token", async () => {
      const leaf = keccak256(signer.address);
      const proof = tree.getHexProof(leaf);
      await bagToken.claim(proof);
      const amount = await bagToken.balanceOf(tokenHolders[0].address);
      expect(amount).to.be.greaterThan(0);
    });

    it("should not claim the token twice", async () => {
      const leaf = keccak256(tokenHolders[0].address);
      const proof = tree.getHexProof(leaf);
      await expect(bagToken.claim(proof)).to.be.revertedWith(
        "You've been there already"
      );
    });

    it("Unknown should not claim a token", async () => {
      const leaf = keccak256(ethers.constants.AddressZero);
      const proof = tree.getHexProof(leaf);
      await expect(bagToken.claim(proof)).to.be.revertedWith(
        "Sorry we are full tonight"
      );
    });
  });
});
