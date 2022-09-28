// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Humaverse is ERC721, ERC721Enumerable, Ownable {
    
    bool public saleIsActive = false;
    bool public revealState = false;
    bool public isAllowListActive = false;

    string public PROVENANCE;
    string private _baseURIextended = '';
    string public uriSuffix = '.json';
    string public hiddenMetadataUri;

    uint256 public constant MAX_SUPPLY = 20;
    uint256 public constant MAX_PUBLIC_MINT = 2;
    uint256 public constant PRICE_PER_TOKEN = 0.123 ether;
    uint256 public constant whitelistPricePerToken = 0.01 ether;

    mapping(address => uint8) private _allowList;
    mapping(uint256 => string) private _tokenURIs;

    constructor() ERC721("Humaverse", "HMV") {
    }

    function setIsAllowListActive(bool _isAllowListActive) external onlyOwner {
        isAllowListActive = _isAllowListActive;
    }

    function ViewisAllowList() public view returns(bool){
        return isAllowListActive;
    }

    function setAllowList(address[] calldata addresses, uint8 numAllowedToMint) external onlyOwner {
        for (uint256 i = 0; i < addresses.length; i++) {
            _allowList[addresses[i]] = numAllowedToMint;
        }
    }

    function numAvailableToMint(address addr) external view returns (uint8) {
        return _allowList[addr];
    }

    function mintAllowList(uint8 numberOfTokens) external payable {
        uint256 ts = totalSupply();
        require(isAllowListActive, "Allow list is not active");
        require(numberOfTokens <= _allowList[msg.sender], "Exceeded max available to purchase");
        require(ts + numberOfTokens <= MAX_SUPPLY, "Purchase would exceed max tokens");
        require(whitelistPricePerToken * numberOfTokens <= msg.value, "Ether value sent is not correct");

        _allowList[msg.sender] -= numberOfTokens;
        for (uint256 i = 0; i < numberOfTokens; i++) {
            _safeMint(msg.sender, ts + i);
        }
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function setBaseURI(string memory baseURI_) external onlyOwner() {
        _baseURIextended = baseURI_;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseURIextended;
    }

    function setProvenance(string memory provenance) public onlyOwner {
        PROVENANCE = provenance;
    }

    function viewProvenance() public view returns (string memory){
        return PROVENANCE;
    }

    function reserve(uint256 n) public onlyOwner {
      uint supply = totalSupply();
      uint i;
      for (i = 0; i < n; i++) {
          _safeMint(msg.sender, supply + i);
      }
    }

    function setSaleState(bool newState) public onlyOwner {
        saleIsActive = newState;
    }

    function viewSaleState() public view returns(bool){
        return saleIsActive;
    }

    function mint(uint numberOfTokens) public payable {
        uint256 ts = totalSupply();
        require(saleIsActive, "Sale must be active to mint tokens");
        require(numberOfTokens <= MAX_PUBLIC_MINT, "Exceeded max token purchase");
        require(ts + numberOfTokens <= MAX_SUPPLY, "Purchase would exceed max tokens");
        require(PRICE_PER_TOKEN * numberOfTokens <= msg.value, "Ether value sent is not correct");

        for (uint256 i = 0; i < numberOfTokens; i++) {
            _safeMint(msg.sender, ts + i);
        }
    }

    function withdraw() public onlyOwner {
        uint balance = address(this).balance;
        payable(msg.sender).transfer(balance);
    }

    function setRevealed(bool _state) public onlyOwner {
        revealState = _state;
    }

    function viewRevealed() public view returns(bool){
        return revealState;
    }

    function tokenURI(uint256 _tokenId) public view virtual override returns (string memory) {
        require(_exists(_tokenId), 'ERC721Metadata: URI query for nonexistent token');
        string memory _tokenURI = _tokenURIs[_tokenId];

        if (revealState == false) {
            return hiddenMetadataUri;
        } else {
            return _tokenURI;
        }

    }

     function setTokenURI(uint256 _tokenId) public virtual onlyOwner{
        require(_exists(_tokenId), 'ERC721Metadata: URI query for nonexistent token');
        string memory tokenid = Strings.toString(_tokenId);
        string memory currentBaseURI = _baseURI();
        string memory result = '';

        if (bytes(currentBaseURI).length > 0) {
            result = string(abi.encodePacked(currentBaseURI, tokenid, uriSuffix));
        } else {
            result = string(abi.encodePacked(tokenid, uriSuffix));
        }

        _tokenURIs[_tokenId] = result;
    }

    function setHiddenMetadataUri(string memory _hiddenMetadataUri) public onlyOwner {
        hiddenMetadataUri = _hiddenMetadataUri;
    }

    function setUriSuffix(string memory _uriSuffix) public onlyOwner {
        uriSuffix = _uriSuffix;
    }
}