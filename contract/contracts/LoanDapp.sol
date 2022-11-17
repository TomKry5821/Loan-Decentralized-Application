// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

/**
 * @title Loan decentralized appplication
 */
contract BankDapp {
    /**
     * 1 Ether value
     */
    uint256 constant ETHER = 1 * 10**18;

    /**
     * 1 day in seconds value
     */
    uint256 constant DAY = 86400;

    /**
     * Contract owner wallet address
     */
    address private ownerAddress;

    /**
     * Application balance
     */
    uint256 private applicationBalance;

    /**
     * Map that contains users loans with borrower wallet address as key
     */
    mapping(address => Loan) private loans;

    /**
     * Map that contains application users - borrowers with they wallet address as key
     */
    mapping(address => Borrower) private borrowers;

    constructor() payable {
        ownerAddress = msg.sender; //Assign contract deployer address as owner address
        applicationBalance = msg.value; //Assign application balance with transaction ether value
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

    struct Borrower {
        address payable walletAddress;
        string firstName;
        string lastName;
        uint256 balance;
        bool isLoanTaken;
    }

    /**
     * Modifer that checks if message sender is an owner of the application
     */
    modifier forOwner() {
        require(
            msg.sender == ownerAddress,
            "You are not allowed to access this"
        );
        _;
    }

    /**
     * Modifer that checks if message sender is a borrower in the application
     */
    modifier forBorrower(address walletAddress) {
        require(
            msg.sender == walletAddress,
            "You can only manage your account"
        );
        require(
            borrowers[msg.sender].walletAddress.codehash != "",
            "You have to be a borrower in application"
        );
        _;
    }

    /**
     * Deposits funds in the application balance
     */
    function depositToDapp() public payable forOwner {
        applicationBalance += msg.value; //Adding transaction money to the application balance
    }

    /**
     * Retrieves actual balance for user with provided address
     */
    function getBorrowerInfo(address walletAddress)
        public
        view
        forBorrower(walletAddress)
        returns (
            string memory,
            string memory,
            uint256
        )
    {
        return (
            borrowers[walletAddress].firstName,
            borrowers[walletAddress].lastName,
            borrowers[walletAddress].balance
        );
    }

    /**
     * Retrieves actual loan information for borrower with provided wallet address
     */
    function getBorrowersLoanInfo(address walletAddress)
        public
        view
        forBorrower(walletAddress)
        returns (Loan memory)
    {
        return loans[walletAddress];
    }

    /**
     * Adds new borrower to the application
     */
    function addNewBorrower(
        address payable walletAddress,
        string memory firstName,
        string memory lastName
    ) public {
        borrowers[walletAddress] = Borrower(
            walletAddress,
            firstName,
            lastName,
            0,
            false
        );
    }
}
