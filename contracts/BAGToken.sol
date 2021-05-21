pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

import "hardhat/console.sol";

contract BAGToken is ERC20 {
    bytes32 private rootHash;
    mapping(address => bool) claimed;

    constructor(bytes32 root) ERC20("Blockchain AG", "BAG") {
        // _mint(msg.sender, initialSupply);
        rootHash = root;
    }

    function claim(bytes32[] calldata proof) external {
        require(verify(proof), "Sorry we are full tonight");
        require(!claimed[msg.sender], "You've been there already");
        claimed[msg.sender] = true;
        _mint(msg.sender, 5000);
    }

    function verify(bytes32[] memory proof) internal view returns (bool) {
        bytes32 leaf = keccak256(abi.encodePacked(msg.sender));
        return MerkleProof.verify(proof, rootHash, leaf);
    }
}
