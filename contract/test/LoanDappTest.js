const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");


describe("LoanDapp contract", function () {
    async function deployLoanDappFixture() {
        const LoanDapp = await ethers.getContractFactory("LoanDapp");
        const [owner, addr1, addr2] = await ethers.getSigners();

        const hardhatLoanDapp = await LoanDapp.deploy();

        await hardhatLoanDapp.deployed();

        return { LoanDapp, hardhatLoanDapp, owner, addr1, addr2 };
    }

    // You can nest describe calls to create subsections.
    describe("LoanDapp tests", function () {
        it("Should return false with not existing borrower", async function () {
            const { hardhatLoanDapp, addr1 } = await loadFixture(deployLoanDappFixture);

            expect(await hardhatLoanDapp.borrowerExists(addr1.address)).to.equal(false);
        });

        it("Should add new borrower", async function () {
            const { hardhatLoanDapp, addr1 } = await loadFixture(deployLoanDappFixture);
            hardhatLoanDapp.addNewBorrower(addr1.address, "Test", "Test", {value: "1000000000000000000"});

            expect(await hardhatLoanDapp.borrowerExists(addr1.address)).to.equal(true);
        });

        it("Should not add new borrower with not enough register fee", async function () {
            const { hardhatLoanDapp, addr1 } = await loadFixture(deployLoanDappFixture);
            hardhatLoanDapp.addNewBorrower(addr1.address, "Test", "Test", {value: "10000"});

            expect(await hardhatLoanDapp.borrowerExists(addr1.address)).to.equal(false);
        });

        it("Should retrieve borrower info", async function () {
            const { hardhatLoanDapp, owner } = await loadFixture(deployLoanDappFixture);
            hardhatLoanDapp.addNewBorrower(owner.address, "Test", "Test", {value: "1000000000000000000"});
            let reponse = await hardhatLoanDapp.getBorrowerInfo(owner.address);

            expect(response.firstName).to.equal("Test").and(reponse.lastName).to.equal("Test");
        });
    });
});