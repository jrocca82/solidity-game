pragma solidity ^0.8.3;
pragma abicoder v2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract MemoryToken is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
    using SafeMath for uint256;

    uint8 private immutable _decimals;
    address public _self;

    constructor(
        string memory name_,
        string memory symbol_,
        uint8 decimals_
    ) ERC721(name_, symbol_) {
        _decimals = decimals_;
        _self = address(this);
    }

    //Functions needed to override duplicates in inherited contracts
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function safeMint(address to, uint256 tokenId) public onlyOwner {
        _safeMint(to, tokenId);
    }

    function mint(address _to, string memory _tokenURI) public returns (bool) {
        uint256 tokenId = balanceOf(_self).add(1);
        _mint(_to, tokenId);
        _setTokenURI(tokenId, _tokenURI);
        return true;
    }
}
