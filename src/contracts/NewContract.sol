pragma solidity ^0.5.0;

contract NewContract {
    uint public notNumber = 2;
    constructor() public {
        notNumber++;
    }
}