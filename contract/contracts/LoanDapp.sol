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
     * Registration fee
     */
    uint256 private registrationFeePool;

    /**
     * Map that contains users loans with borrower wallet address as key
     */
    Loan[] private loans;

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
        bool isActive;
        address borrowerAddress;
        bool registrationFreeFreezed;
    }

    struct LoanDTO {
        uint256 loanAmount;
        uint256 interest;
        uint256 installmentsNumber;
        uint256 loanStartDate;
        bool isActive;
    }

    struct Borrower {
        address payable walletAddress;
        string firstName;
        string lastName;
        uint256 balance;
        bool isLoanTaken;
        uint256 loansCount;
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
    ) public payable {
        borrowers[walletAddress] = Borrower(
            walletAddress,
            firstName,
            lastName,
            0,
            false,
            0
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
     * Retrieves installment amount for borrower with provided wallet address
     */
    function getBorrowersInstallmentAmount(address walletAddress)
        public
        view
        forBorrower(walletAddress)
        returns (uint256)
    {
        for (uint256 i = 0; i < loans.length; i++) {
            if (
                loans[i].isActive == true &&
                loans[i].borrowerAddress == walletAddress
            ) {
                return loans[i].installmentAmount;
            }
        }
        return 0;
    }

    /**
     * Retrieves next installment date for borrower with provided wallet address
     */
    function getBorrowersNextInstallmentDate(address walletAddress)
        public
        view
        forBorrower(walletAddress)
        returns (uint256)
    {
        for (uint256 i = 0; i < loans.length; i++) {
            if (
                loans[i].isActive == true &&
                loans[i].borrowerAddress == walletAddress
            ) {
                return loans[i].nextInstallmentDate;
            }
        }
        return 0;
    }

    /**
     * Retrieves remaining installment number for borrower with provided wallet address
     */
    function getBorrowersRemainingInstallmentNumber(address walletAddress)
        public
        view
        forBorrower(walletAddress)
        returns (uint256)
    {
        for (uint256 i = 0; i < loans.length; i++) {
            if (
                loans[i].isActive == true &&
                loans[i].borrowerAddress == walletAddress
            ) {
                return loans[i].remainingInstallments;
            }
        }
        return 0;
    }

    /**
     * Retrieves loan interest for borrower with provided wallet address
     */
    function getBorrowersInterest(address walletAddress)
        public
        view
        forBorrower(walletAddress)
        returns (uint256)
    {
        for (uint256 i = 0; i < loans.length; i++) {
            if (
                loans[i].isActive == true &&
                loans[i].borrowerAddress == walletAddress
            ) {
                return loans[i].interest;
            }
        }
        return 0;
    }

    /**
     * Returns true if borrower has not any active loans
     */
    function canTakeLoan(address walletAddress) public view returns (bool) {
        return !borrowers[walletAddress].isLoanTaken;
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
    ) public payable forBorrower(walletAddress) {
        require(canTakeLoan(walletAddress) == true, "You cannot take loan!");
        require(
            applicationBalance >= loanAmount,
            "Not enough money in application!"
        );

        uint256 registrationFee = loanAmount > 50 * ETHER
            ? loanAmount / 100
            : ETHER / 2;
        require(
            msg.value >= registrationFee,
            "Not enough funds for pay registration fee"
        );
        registrationFeePool += msg.value;
        uint256 installmentAmount = amountToBePaid / installmentsNumber;

        borrowers[walletAddress].loansCount += 1;
        loans.push(
            Loan(
                loanAmount,
                amountToBePaid,
                amountToBePaid,
                interest,
                installmentAmount,
                installmentsNumber,
                installmentsNumber,
                loanStartDate,
                loanStartDate + DAY,
                true,
                walletAddress,
                false
            )
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
        uint256 index;
        for (uint256 i = 0; i < loans.length; i++) {
            if (
                loans[i].isActive == true &&
                loans[i].borrowerAddress == walletAddress
            ) {
                index = i;
                break;
            }
        }
        require(
            borrowers[walletAddress].balance >= loans[index].installmentAmount,
            "Not enough money at account balance!"
        );

        uint256 installmentAmount = loans[index].installmentAmount; //Assign installment amount to local variable
        borrowers[walletAddress].balance -= installmentAmount; //Substract installment amount from borrower balance
        loans[index].remaingAmountToPay -= installmentAmount; //Update remaining amount to be paid
        loans[index].nextInstallmentDate += DAY; //Update next installment date
        loans[index].remainingInstallments -= 1; //Update remaining installments number
        applicationBalance += installmentAmount; //Add installment amount to the application balance
        if (block.timestamp > loans[index].nextInstallmentDate) {
            loans[index].registrationFreeFreezed = true;
        }

        if (loans[index].remainingInstallments == 0) {
            //Close loan if borrower paid last installment
            closeLoan(walletAddress);
        }
    }

    /**
     * Closes loan of borrower with provided wallet address
     */
    function closeLoan(address walletAddress) internal {
        borrowers[walletAddress].isLoanTaken = false; //Set is loan taken flag to false
        uint256 registrationFee;
        for (uint256 i = 0; i < loans.length; i++) {
            if (
                loans[i].isActive == true &&
                loans[i].borrowerAddress == walletAddress
            ) {
                if (loans[i].registrationFreeFreezed == false) {
                    registrationFee = loans[i].loanAmount > 50 * ETHER
                        ? loans[i].loanAmount / 100
                        : ETHER / 2;
                    borrowers[walletAddress].balance += registrationFee;
                }
                loans[i].isActive = false;
                break;
            }
        }
    }

    /**
     * Retrieves borrowers loan history
     */
    function getBorrowerLoansHistory(address walletAddress)
        public
        view
        forBorrower(walletAddress)
        returns (LoanDTO[] memory)
    {
        LoanDTO[] memory loanHistory = new LoanDTO[](
            borrowers[walletAddress].loansCount
        );
        uint256 count = 0;

        for (uint256 i = 0; i < loans.length; i++) {
            if (loans[i].borrowerAddress == walletAddress) {
                loanHistory[count] = LoanDTO(
                    loans[i].loanAmount,
                    loans[i].interest,
                    loans[i].installmentsNumber,
                    loans[i].loanStartDate,
                    loans[i].isActive
                );
                count += 1;
            }
        }
        return loanHistory;
    }
}
