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
      const a = await upgrades.erc1967.getImplementationAddress(
        instanceProxy.address
      );
      console.log("admin", a, instanceProxy.address);
      await UUPSTokenFactory.attach(a).initialize("NFTimp", "nfto");
      console.log("name impl", await UUPSTokenFactory.attach(a).name());
      expect(await instanceProxy.name()).to.equal("NFT");

      await upgrades.upgradeProxy(instanceProxy.address, UUPSTokenFactoryV2);
      expect(await instanceProxy.name()).to.equal("NFTv2");
    });

    it("should upgrade using custom proxy", async () => {
      const [owner] = await ethers.getSigners();

      const UUPSTokenFactory = await ethers.getContractFactory("UUPSToken");
      const UUPSTokenFactoryV2 = await ethers.getContractFactory("UUPSTokenV2");
      const UUPSProxyFactory = await ethers.getContractFactory("UUPSTokenCustomProxy");

      const impl = await UUPSTokenFactory.deploy();
      const impl2 = await UUPSTokenFactoryV2.deploy();
      const proxy = await UUPSProxyFactory.deploy(impl.address, []);

      const instanceProxy = UUPSTokenFactory.attach(proxy.address);
      await instanceProxy.initialize("NFT", "nft");
      expect(await instanceProxy.name()).to.equal("NFT");

      await instanceProxy.upgradeTo(impl2.address);
      expect(await instanceProxy.name()).to.equal("NFTv2");
    });
  });
});
