// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

/**
 * @title Loan decentralized appplication
 */
contract BankDapp {

    //1 Ether value
    uint constant ETHER = 1 * 10**18;
    //1 day in seconds value
    uint constant DAY = 86400;

    //Contract owner wallet address
    address private ownerAddress;
    //Application balance
    uint private applicationBalance;

    constructor() payable {
        //Assign contract deployer address as owner address
        ownerAddress = msg.sender;
        //Assign application balance with transaction ether value
        applicationBalance = msg.value;
    }
