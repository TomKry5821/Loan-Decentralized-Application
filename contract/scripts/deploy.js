// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const currentTimestampInSeconds = Math.round(Date.now() / 1000);

  const etherAmount = hre.ethers.utils.parseEther("2000");

  const LoanDapp = await hre.ethers.getContractFactory("LoanDapp");
  const loan = await LoanDapp.deploy({ value: etherAmount });

  await loan.deployed();

  console.log(
    `LoanDapp with 2000 ETH and timestamp ${currentTimestampInSeconds} deployed to ${loan.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
