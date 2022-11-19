// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

/**
 * @title Loan decentralized appplication
 */
contract LoanDapp {
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
     * Checks if user with provided wallet address is in borrowers mapping
     */
    function borrowerExists(address walletAddress) public view returns (bool) {
        return
            (borrowers[walletAddress].walletAddress.codehash != "")
                ? true
                : false;
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

    /**
     * Retrieves Borrowers basic info
     */
    function getBorrowerInfo(address borrowerAddress)
        public
        view
        forBorrower(borrowerAddress)
        returns (string memory firstName, string memory lastName)
    {
        firstName = borrowers[borrowerAddress].firstName;
        lastName = borrowers[borrowerAddress].lastName;
    }

    /**
     * Retrieves actual balance for user with provided address
     */
    function getBorrowerBalance(address walletAddress)
        public
        view
        forBorrower(walletAddress)
        returns (uint256)
    {
        return borrowers[walletAddress].balance;
    }

    /**
     * Deposits funds in the borrowers balance in application
     */
    function deposit(address walletAddress)
        public
        payable
        forBorrower(walletAddress)
    {
        borrowers[walletAddress].balance += msg.value;
    }

    /**
     * Withdraws funds from the application to the borrowers wallet
     */
    function withdraw(address walletAddress, uint256 amountToWithdraw)
        public
        payable
        forBorrower(walletAddress)
    {
        require(
            amountToWithdraw <= borrowers[walletAddress].balance,
            "You cannot withdraw more than your balance!"
        );

        borrowers[walletAddress].balance -= amountToWithdraw; //Substract funds that borrower wants to withdraw from his balance in application
        payable(walletAddress).transfer(amountToWithdraw); //Transfer withdrawn funds to borrowers wallet
    }

    /**
     * Deposits funds in the application balance
     */
    function depositToDapp() public payable forOwner {
        applicationBalance += msg.value; //Adding transaction money to the application balance
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
     * Returns true if borrower has not any active loans
     */
    function canTakeLoan(address walletAddress) public view returns (bool) {
        return (borrowers[walletAddress].isLoanTaken == false) ? true : false;
    }

    /**
     * Calculates interest for loan with provided loan amount and installments number
     */
    function calculateInterestInPercent(
        uint256 loanAmount,
        uint256 installmentsNumber
    ) public pure returns (uint256) {
        if (loanAmount < ETHER) {
            return 25;
        } else if (loanAmount >= ETHER && installmentsNumber > 20) {
            return 20;
        } else if (
            loanAmount >= ETHER &&
            installmentsNumber <= 20 &&
            installmentsNumber > 10
        ) {
            return 15;
        } else if (
            loanAmount >= ETHER &&
            installmentsNumber <= 10 &&
            installmentsNumber > 2
        ) {
            return 10;
        } else if (loanAmount >= 10 * ETHER && installmentsNumber > 20) {
            return 5;
        }
        return 3;
    }

    /**
     * Creates loan for user with provided wallet address
     */
    function takeLoan(
        address walletAddress,
        uint256 loanAmount,
        uint256 amountToBePaid,
        uint256 interest,
        uint256 installmentsNumber,
        uint256 loanStartDate
    ) public forBorrower(walletAddress) {
        require(canTakeLoan(walletAddress) == true, "You cannot take loan!");
        require(
            applicationBalance >= loanAmount,
            "Not enough money in application!"
        );

        uint installmentAmount = loanAmount / installmentsNumber;

        loans[walletAddress] = Loan(
            loanAmount,
            amountToBePaid,
            amountToBePaid,
            interest,
            installmentAmount,
            installmentsNumber,
            installmentsNumber,
            loanStartDate,
            loanStartDate + DAY
        ); //Create loan

        borrowers[walletAddress].balance += loanAmount; //Transfer funds to borrowers balance
        borrowers[walletAddress].isLoanTaken = true; //Set is loan taken flag to true
        applicationBalance -= loanAmount; //Substract loan amount from application balance
    }

    /**
     * Transfers installment from the borrowers balance to the application balance
     */
    function payInstallment(address walletAddress)
        public
        forBorrower(walletAddress)
    {
        require(
            borrowers[walletAddress].isLoanTaken == true,
            "Any loan has not been taken for account"
        );
        require(
            borrowers[walletAddress].balance >=
                loans[walletAddress].installmentAmount,
            "Not enough money at account balance!"
        );

        uint256 installmentAmount = loans[walletAddress].installmentAmount; //Assign installment amount to local variable
        borrowers[walletAddress].balance -= installmentAmount; //Substract installment amount from borrower balance
        loans[walletAddress].remaingAmountToPay -= installmentAmount; //Update remaining amount to be paid
        loans[walletAddress].nextInstallmentDate += DAY; //Update next installment date
        loans[walletAddress].remainingInstallments -= 1; //Update remaining installments number
        applicationBalance += installmentAmount; //Add installment amount to the application balance

        if (loans[walletAddress].remainingInstallments == 0) {
            //Close loan if borrower paid last installment
            closeLoan(walletAddress);
        }
    }

    /**
     * Closes loan of borrower with provided wallet address
     */
    function closeLoan(address walletAddress) internal {
        borrowers[walletAddress].isLoanTaken = false; //Set is loan taken flag to false
        delete loans[walletAddress]; //Remove loan from map
    }
}
