import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers, upgrades } from "hardhat";

describe("UUPSToken", () => {
  describe("deploy version 1 NFT token", () => {
    it("should deploy version 1 NFT token", async () => {
      const [owner] = await ethers.getSigners();

      const UUPSTokenFactory = await ethers.getContractFactory("UUPSToken");
      const UUPSTokenFactoryV2 = await ethers.getContractFactory("UUPSTokenV2");

      const contract = await UUPSTokenFactory.deploy();
      // await contract.connect(owner).initialize("NFT", "nft");
      // expect(await contract.name()).to.equal("NFTv1");

      const instanceProxy = await upgrades.deployProxy(UUPSTokenFactory, [
        "NFT",
        "nft",
      ]);
      expect(await instanceProxy.name()).to.equal("NFT");

      await upgrades.upgradeProxy(instanceProxy.address, UUPSTokenFactoryV2);
      expect(await instanceProxy.name()).to.equal("NFTv2");
    });
  });
});
