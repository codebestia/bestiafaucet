// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract BestiaFaucet{
    address owner;
    mapping(address => mapping(address => uint256)) userTokenTimeStamp;
    address[] public acceptedTokens;
    uint256 defaultInterval = 86400;
    struct TokenInformation {
        address tokenAddress;
        uint256 amountPerRequest;
        uint256 requestInterval;
    }
    mapping(address => TokenInformation) addressToInfo;

    constructor() public{
        owner = msg.sender;
    }
    modifier onlyOwner{
        require(msg.sender == owner, "Unauthorized User");
        _;
    }
    // This is the amount of token of a particular token that a user can per request
    function setAmountPerRequest(address tokenAddress, uint256 amount) public onlyOwner{
        require(amount > 0,"Amount Must be greater than 0");
        addressToInfo[tokenAddress].amountPerRequest = amount;
    }
    function addAcceptedToken(address tokenAddress, uint256 _amountPerRequest) public onlyOwner{
        acceptedTokens.push(tokenAddress);
        TokenInformation memory tokenInfo = TokenInformation(tokenAddress,_amountPerRequest,defaultInterval);
        addressToInfo[tokenAddress] = tokenInfo;

    }
    function changeDefaultInterval(uint256 interval) public onlyOwner{
        defaultInterval = interval;
    }
    function getAcceptedTokens() public view returns (address[] memory){
        return acceptedTokens;
    }
    function getTokenInfo(address tokenAddress) public view returns(uint256, uint256){
        // Returns the amountPerRequest and the request Interval
        TokenInformation memory tokenInfo = addressToInfo[tokenAddress];
        return (tokenInfo.amountPerRequest, tokenInfo.requestInterval);
    }
    function checkToken(address tokenAddress) public view returns(bool){
        for(uint256 index = 0; index < acceptedTokens.length; index++){
            if(acceptedTokens[index] == tokenAddress){
                return true;
            }
        }
        return false;
    }
    function requestTimeValid(address userAddress, address tokenAddress) public view returns(bool){
        if (userTokenTimeStamp[userAddress][tokenAddress] > 0 ){
            uint256 timestamp = userTokenTimeStamp[userAddress][tokenAddress];
            TokenInformation memory tokenInfo = addressToInfo[tokenAddress];
            uint256 currentTime = uint256(block.timestamp);
            if( currentTime - timestamp < tokenInfo.requestInterval ){
                return false;
            }else{
                return true;
            }
        }else{
            return true;
        }
    }
    function deposit(address tokenAddress, uint256 amount) public {
        require(checkToken(tokenAddress),"This Faucet does not accept this token");
        IERC20 token = IERC20(tokenAddress);
        require(token.allowance(msg.sender, address(this)) >= amount, "Please approve the amount of token you want to send first");
        token.transferFrom(msg.sender, address(this), amount);
    }
    function request(address tokenAddress) public {
        require(checkToken(tokenAddress),"This Faucet does not give the requested token");
        require(requestTimeValid(msg.sender,tokenAddress),"You cannot request for this token yet");
        IERC20 token = IERC20(tokenAddress);
        TokenInformation memory tokenInfo = addressToInfo[tokenAddress];
        require(token.balanceOf(address(this)) > tokenInfo.amountPerRequest, "Faucet for this token is empty" );
        
        token.approve(msg.sender, tokenInfo.amountPerRequest);
        token.transfer(msg.sender, tokenInfo.amountPerRequest);
        userTokenTimeStamp[msg.sender][tokenAddress] = block.timestamp; 
    }
    function userLastRequestTime(address userAddress, address tokenAddress) public view returns(uint256){
        return userTokenTimeStamp[userAddress][tokenAddress];
    }
}