# Loan-Decentralized-Application

Technology stack:
  - Solidity 
  - React Chakra  UI

Loan Dapp is a decentralized application that allows you to:
  - Connect wallet via MetaMask
  - Deposit funds into the application(ETH)
  - Withdraw funds into your wallet
  - Take a loan for a certain amount, interest rate and number of installments in several options
  
How to run it locally:

    1. Clone repository
    2. Compile contract in contract directory by npx hardhat compile
    3. Copy "abi" field value from generated LoanDapp.json file in contract directory into "abi" field in config.json in Loan-Dapp-Client directory
    4. Run npx hardhat node in contract directory
    5. Run npx hardhat run --network localhost scripts/deploy.js in contract directory, then copy contract address, then paste it into "contactAddress" field value in config.json in Loan-Dapp-Client directory
    6. Run npm run dev in Loan-Dapp-Client directory
  
Some screens from application:

Main page
![image](https://user-images.githubusercontent.com/93645494/202867165-8544a9d6-de7e-407b-a2ad-6837d9b0442c.png)


Application with borrower that has taken loan
![image](https://user-images.githubusercontent.com/93645494/202867126-d27f386f-01a6-44c4-9574-528951f85645.png)

  
