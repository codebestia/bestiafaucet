// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract BestiaToken is ERC20{
    constructor(uint256 initialSupply)ERC20("BestiaToken","BST"){
        _mint(msg.sender, initialSupply);
    }
}