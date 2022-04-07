pragma solidity ^0.8.3;
pragma abicoder v2;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract MemoryToken is ERC721URIStorage {
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

    function mint(address _to, string memory _tokenURI) public returns (bool) {
        uint256 tokenId = balanceOf(_self).add(1);
        _mint(_to, tokenId);
        _setTokenURI(tokenId, _tokenURI);
        return true;
    }
}
