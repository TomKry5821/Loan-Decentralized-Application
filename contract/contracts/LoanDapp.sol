// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

/**
 * @title Loan decentralized appplication
 */
contract BankDapp {
    //1 Ether value
    uint256 constant ETHER = 1 * 10**18;
    //1 day in seconds value
    uint256 constant DAY = 86400;

    //Contract owner wallet address
    address private ownerAddress;
    //Application balance
    uint256 private applicationBalance;

    //Map that contains users loans with borrower wallet address as key
    mapping(address => Loan) private loans;

    constructor() payable {
        //Assign contract deployer address as owner address
        ownerAddress = msg.sender;
        //Assign application balance with transaction ether value
        applicationBalance = msg.value;
    }

    struct Loan {
        uint256 loanAmount;
        uint256 amountToBePaid;
        uint256 remaingAmountToPay;
        uint256 interest;
        uint256 installmentAmount;
        uint256 installmentsNumber;
        uint256 remainingInstallments;
        uint256 loanStartDate;
        uint256 nextInstallmentDate;
    }
}
