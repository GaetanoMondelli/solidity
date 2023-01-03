// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract UUPSToken is
    Initializable,
    ERC721Upgradeable,
    OwnableUpgradeable,
    UUPSUpgradeable
{
    uint256 public count;

    // /// @custom:oz-upgrades-unsafe-allow constructor
    // constructor() {
    //     _disableInitializers();
    // }

    function initialize(
        string memory name,
        string memory symbol
    ) public initializer {
        __ERC721_init(name, symbol);
        __Ownable_init();
        __UUPSUpgradeable_init();
    }

    function safeMint(address to) public onlyOwner {
        uint256 tokenId = ++count;
        _safeMint(to, tokenId);
    }

    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyOwner {}
}
