const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");


describe("LoanDapp contract", function () {
    const ETHER = "1000000000000000000";
    const TEN_ETHER = "10000000000000000000";
    const AMOUNT_TO_BE_PAID = "11000000000000000000";
    const INSTALLMENT_AMOUNT = "1100000000000000000";
    const INSTALLMENTS_NUMBER = 10;
    const INTEREST = 10;
    const LOAN_START_DATE = 1000000;
    const NEXT_INSTALLMENT_DUE = 1086400;

    async function deployLoanDappFixture() {
        const LoanDapp = await ethers.getContractFactory("LoanDapp");
        const [owner, addr1] = await ethers.getSigners();

        const hardhatLoanDapp = await LoanDapp.deploy();

        await hardhatLoanDapp.deployed();

        return { LoanDapp, hardhatLoanDapp, owner, addr1 };
    }

    // You can nest describe calls to create subsections.
    describe("LoanDapp tests", function () {

        it("Should return false with not existing borrower", async function () {
            //GIVEN
            const { hardhatLoanDapp, addr1 } = await loadFixture(deployLoanDappFixture);

            //WHEN
            //THEN
            expect(await hardhatLoanDapp.borrowerExists(addr1.address)).to.equal(false);
        });

        it("Should add new borrower", async function () {
            //GIVEN
            const { hardhatLoanDapp, addr1 } = await loadFixture(deployLoanDappFixture);
            hardhatLoanDapp.addNewBorrower(addr1.address, "Test", "Test");

            //WHEN
            //THEN
            expect(await hardhatLoanDapp.borrowerExists(addr1.address)).to.equal(true);
        });

        it("Should throw you can only manage your account error", async function () {
            //GIVEN
            const { hardhatLoanDapp, addr1 } = await loadFixture(deployLoanDappFixture);
            hardhatLoanDapp.addNewBorrower(addr1.address, "firstName", "lastName", { value: ETHER });

            //WHEN
            //THEN
            await expect(hardhatLoanDapp.getBorrowerInfo(addr1.address))
                .to
                .be
                .revertedWith('You can only manage your account');
        });

        it("Should retrieve valid borrower info with added borrower", async function () {
            //GIVEN
            const { hardhatLoanDapp, addr1 } = await loadFixture(deployLoanDappFixture);
            hardhatLoanDapp.addNewBorrower(addr1.address, "firstName", "lastName", { value: ETHER });

            //WHEN
            let response = await hardhatLoanDapp.connect(addr1).getBorrowerInfo(addr1.address);

            //THEN
            expect(response.firstName).to.equal("firstName");
            expect(response.lastName).to.equal("lastName");
        });

        it("Should retrieve valid borrower balance with equal to 0", async function () {
            //GIVEN
            const { hardhatLoanDapp, addr1 } = await loadFixture(deployLoanDappFixture);
            hardhatLoanDapp.addNewBorrower(addr1.address, "firstName", "lastName", { value: ETHER });

            //WHEN
            let response = await hardhatLoanDapp.connect(addr1).getBorrowerBalance(addr1.address);

            //THEN
            expect(response).to.equal(0);
        });

        it("Should successfully deposit balance", async function () {
            //GIVEN
            const { hardhatLoanDapp, addr1 } = await loadFixture(deployLoanDappFixture);
            hardhatLoanDapp.addNewBorrower(addr1.address, "firstName", "lastName", { value: ETHER });
            hardhatLoanDapp.connect(addr1).deposit(addr1.address, { value: ETHER });

            //WHEN
            let response = await hardhatLoanDapp.connect(addr1).getBorrowerBalance(addr1.address);

            //THEN
            expect(response).to.equal(ETHER);
        });

        it("Should successfully withdraw 1ETH", async function () {
            //GIVEN
            const { hardhatLoanDapp, addr1 } = await loadFixture(deployLoanDappFixture);
            hardhatLoanDapp.addNewBorrower(addr1.address, "firstName", "lastName", { value: ETHER });
            hardhatLoanDapp.connect(addr1).deposit(addr1.address, { value: ETHER });
            hardhatLoanDapp.connect(addr1).withdraw(addr1.address, ETHER);

            //WHEN
            let response = await hardhatLoanDapp.connect(addr1).getBorrowerBalance(addr1.address);

            //THEN
            expect(response).to.equal("0");
        });

        it("Should return true with borrower without loan", async function () {
            //GIVEN
            const { hardhatLoanDapp, addr1 } = await loadFixture(deployLoanDappFixture);
            hardhatLoanDapp.addNewBorrower(addr1.address, "firstName", "lastName", { value: ETHER });

            //WHEN
            let response = await hardhatLoanDapp.connect(addr1).canTakeLoan(addr1.address);

            //THEN
            expect(response).to.equal(true);
        });

        it("Should calculate valid interest", async function () {
            //GIVEN
            const { hardhatLoanDapp, addr1 } = await loadFixture(deployLoanDappFixture);

            //WHEN
            let response = await hardhatLoanDapp.connect(addr1).calculateInterestInPercent(TEN_ETHER,
                INSTALLMENTS_NUMBER);

            //THEN
            expect(response).to.equal(10);
        });

        it("Should throw not enough application balance error for take loan", async function () {
            //GIVEN
            const { hardhatLoanDapp, addr1 } = await loadFixture(deployLoanDappFixture);
            hardhatLoanDapp.addNewBorrower(addr1.address, "firstName", "lastName");

            //WHEN
            //THEN
            await expect(hardhatLoanDapp.connect(addr1).takeLoan(addr1.address,
                TEN_ETHER,
                AMOUNT_TO_BE_PAID,
                INTEREST,
                INSTALLMENTS_NUMBER,
                LOAN_START_DATE))
                .to
                .be
                .revertedWith('Not enough money in application!');
        });

        it("Should throw not enough registration fee error for take loan", async function () {
            //GIVEN
            const { hardhatLoanDapp, addr1 } = await loadFixture(deployLoanDappFixture);
            hardhatLoanDapp.depositToDapp({ value: TEN_ETHER });
            hardhatLoanDapp.addNewBorrower(addr1.address, "firstName", "lastName");

            //WHEN
            //THEN
            await expect(hardhatLoanDapp.connect(addr1).takeLoan(addr1.address,
                TEN_ETHER,
                AMOUNT_TO_BE_PAID,
                INTEREST,
                INSTALLMENTS_NUMBER,
                LOAN_START_DATE))
                .to
                .be
                .revertedWith('Not enough funds for pay registration fee');
        });

        it("Should return false with borrower with loan", async function () {
            //GIVEN
            const { hardhatLoanDapp, addr1 } = await loadFixture(deployLoanDappFixture);
            hardhatLoanDapp.depositToDapp({ value: TEN_ETHER });
            hardhatLoanDapp.addNewBorrower(addr1.address, "firstName", "lastName");
            await hardhatLoanDapp.connect(addr1).takeLoan(addr1.address,
                TEN_ETHER,
                AMOUNT_TO_BE_PAID,
                INTEREST,
                INSTALLMENTS_NUMBER,
                LOAN_START_DATE,
                { value: ETHER });

            //WHEN
            let response = await hardhatLoanDapp.connect(addr1).canTakeLoan(addr1.address);

            //THEN
            expect(response).to.equal(false);
        });

        it("Should return valid installment amount for borrower with loan", async function () {
            //GIVEN
            const { hardhatLoanDapp, addr1 } = await loadFixture(deployLoanDappFixture);
            hardhatLoanDapp.depositToDapp({ value: TEN_ETHER });
            hardhatLoanDapp.addNewBorrower(addr1.address, "firstName", "lastName");
            await hardhatLoanDapp.connect(addr1).takeLoan(addr1.address,
                TEN_ETHER,
                AMOUNT_TO_BE_PAID,
                INTEREST,
                INSTALLMENTS_NUMBER,
                LOAN_START_DATE,
                { value: ETHER });

            //WHEN
            let response = await hardhatLoanDapp.connect(addr1).getBorrowersInstallmentAmount(addr1.address);

            //THEN
            expect(response).to.equal(INSTALLMENT_AMOUNT);
        });

        it("Should return valid next installment due for borrower with loan", async function () {
            //GIVEN
            const { hardhatLoanDapp, addr1 } = await loadFixture(deployLoanDappFixture);
            hardhatLoanDapp.depositToDapp({ value: TEN_ETHER });
            hardhatLoanDapp.addNewBorrower(addr1.address, "firstName", "lastName");
            await hardhatLoanDapp.connect(addr1).takeLoan(addr1.address,
                TEN_ETHER,
                AMOUNT_TO_BE_PAID,
                INTEREST,
                INSTALLMENTS_NUMBER,
                LOAN_START_DATE,
                { value: ETHER });

            //WHEN
            let response = await hardhatLoanDapp.connect(addr1).getBorrowersNextInstallmentDate(addr1.address);

            //THEN
            expect(response).to.equal(NEXT_INSTALLMENT_DUE);
        });

        it("Should return valid remaining installments number for borrower with loan", async function () {
            //GIVEN
            const { hardhatLoanDapp, addr1 } = await loadFixture(deployLoanDappFixture);
            hardhatLoanDapp.depositToDapp({ value: TEN_ETHER });
            hardhatLoanDapp.addNewBorrower(addr1.address, "firstName", "lastName");
            await hardhatLoanDapp.connect(addr1).takeLoan(addr1.address,
                TEN_ETHER,
                AMOUNT_TO_BE_PAID,
                INTEREST,
                INSTALLMENTS_NUMBER,
                LOAN_START_DATE,
                { value: ETHER });

            //WHEN
            let response = await hardhatLoanDapp.connect(addr1).getBorrowersRemainingInstallmentNumber(addr1.address);

            //THEN
            expect(response).to.equal(INSTALLMENTS_NUMBER);
        });

        it("Should return valid interest for borrower with loan", async function () {
            //GIVEN
            const { hardhatLoanDapp, addr1 } = await loadFixture(deployLoanDappFixture);
            hardhatLoanDapp.depositToDapp({ value: TEN_ETHER });
            hardhatLoanDapp.addNewBorrower(addr1.address, "firstName", "lastName");
            await hardhatLoanDapp.connect(addr1).takeLoan(addr1.address,
                TEN_ETHER,
                AMOUNT_TO_BE_PAID,
                INTEREST,
                INSTALLMENTS_NUMBER,
                LOAN_START_DATE,
                { value: ETHER });

            //WHEN
            let response = await hardhatLoanDapp.connect(addr1).getBorrowersInterest(addr1.address);

            //THEN
            expect(response).to.equal(INTEREST);
        });

        it("Should successfully pay installment", async function () {
            //GIVEN
            //WHEN
            const { hardhatLoanDapp, addr1 } = await loadFixture(deployLoanDappFixture);
            hardhatLoanDapp.depositToDapp({ value: TEN_ETHER });
            hardhatLoanDapp.addNewBorrower(addr1.address, "firstName", "lastName");
            await hardhatLoanDapp.connect(addr1).takeLoan(addr1.address,
                TEN_ETHER,
                AMOUNT_TO_BE_PAID,
                INTEREST,
                INSTALLMENTS_NUMBER,
                LOAN_START_DATE,
                { value: ETHER });
            await hardhatLoanDapp.connect(addr1).deposit(addr1.address, { value: AMOUNT_TO_BE_PAID });

            //THEN
            await hardhatLoanDapp.connect(addr1).payInstallment(addr1.address);
        });

        it("Should throw not loan taken error", async function () {
            //GIVEN
            const { hardhatLoanDapp, addr1 } = await loadFixture(deployLoanDappFixture);
            hardhatLoanDapp.depositToDapp({ value: TEN_ETHER });
            hardhatLoanDapp.addNewBorrower(addr1.address, "firstName", "lastName");

            //WHEN
            //THEN
            await expect(hardhatLoanDapp.connect(addr1).payInstallment(addr1.address))
                .to
                .be
                .revertedWith('Any loan has not been taken for account');
        });

        it("Should throw not enough balance error", async function () {
            //GIVEN
            const { hardhatLoanDapp, addr1 } = await loadFixture(deployLoanDappFixture);
            hardhatLoanDapp.depositToDapp({ value: TEN_ETHER });
            hardhatLoanDapp.addNewBorrower(addr1.address, "firstName", "lastName");
            await hardhatLoanDapp.connect(addr1).takeLoan(addr1.address,
                TEN_ETHER,
                AMOUNT_TO_BE_PAID,
                INTEREST,
                INSTALLMENTS_NUMBER,
                LOAN_START_DATE,
                { value: ETHER });
            hardhatLoanDapp.connect(addr1).withdraw(addr1.address, TEN_ETHER);

            //WHEN
            //THEN
            await expect(hardhatLoanDapp.connect(addr1).payInstallment(addr1.address))
                .to
                .be
                .revertedWith('Not enough money at account balance!');
        });

        it("Should close paid loan and return registration fee to borrowers balance", async function () {
            //GIVEN
            const { hardhatLoanDapp, addr1 } = await loadFixture(deployLoanDappFixture);
            hardhatLoanDapp.depositToDapp({ value: TEN_ETHER });
            hardhatLoanDapp.addNewBorrower(addr1.address, "firstName", "lastName");
            await hardhatLoanDapp.connect(addr1).takeLoan(addr1.address,
                TEN_ETHER,
                AMOUNT_TO_BE_PAID,
                INTEREST,
                1,
                LOAN_START_DATE,
                { value: ETHER });
            hardhatLoanDapp.connect(addr1).deposit(addr1.address, { value: ETHER });
            hardhatLoanDapp.connect(addr1).payInstallment(addr1.address);

            //WHEN
            let response = await hardhatLoanDapp.connect(addr1).canTakeLoan(addr1.address);
            let borrowersBalance = await hardhatLoanDapp.connect(addr1). getBorrowerBalance(addr1.address);

            //THEN
            expect(response).to.be.equal(true);
            expect(borrowersBalance == 500000000000000000);
        });

        it("Should close paid loan and not return registration fee to borrowers balance", async function () {
            //GIVEN
            const { hardhatLoanDapp, addr1 } = await loadFixture(deployLoanDappFixture);
            hardhatLoanDapp.depositToDapp({ value: TEN_ETHER });
            hardhatLoanDapp.addNewBorrower(addr1.address, "firstName", "lastName");
            await hardhatLoanDapp.connect(addr1).takeLoan(addr1.address,
                TEN_ETHER,
                AMOUNT_TO_BE_PAID,
                INTEREST,
                1,
                100,
                { value: ETHER });
            hardhatLoanDapp.connect(addr1).deposit(addr1.address, { value: ETHER });
            hardhatLoanDapp.connect(addr1).payInstallment(addr1.address);

            //WHEN
            let response = await hardhatLoanDapp.connect(addr1).canTakeLoan(addr1.address);
            let borrowersBalance = await hardhatLoanDapp.connect(addr1). getBorrowerBalance(addr1.address);

            //THEN
            expect(response).to.be.equal(true);
            expect(borrowersBalance == 0);
        });
    });
});