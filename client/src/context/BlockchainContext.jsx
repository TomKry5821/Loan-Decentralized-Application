import React, { useEffect, useState } from 'react'
import { abi, contractAddress } from '../config.json'
import { ethers } from "ethers"

export const BlockchainContext = React.createContext("");

export const BlockchainProvider = ({ children }) => {
    const [currentAccount, setCurrentAccount] = useState("");
    const [canTakeLoan, setCanTakeLoan] = useState()
    const [borrowerExists, setBorrowerExists] = useState()
    const [borrower, setBorrower] = useState()
    const [borrowerBalance, setBorrowerBalance] = useState()
    const [installmentAmount, setInstallmentAmount] = useState()
    const [interest, setInterest] = useState()
    const [remainingInstallments, setRemainingInstallments] = useState()
    const [nextInstallmentDueDate, setNextInstallmentDueDate] = useState()
    const [loanInterest, setLoanInterest] = useState()
    const [loanHistory, setLoanHistory] = useState([])

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()

    const address = contractAddress;
    const contractAbi = abi;
    const contract = new ethers.Contract(address, contractAbi, signer);

    // The ABI of the object

    const dataType = "(uint256,uint256,uint256,uint256,bool)[]";

    const connectWallet = async () => {
        try {
            if (!window.ethereum) return alert("Please install Metamask")

            const accounts = await provider.send("eth_requestAccounts");
            console.log(accounts[0])
            setCurrentAccount(accounts[0])
        } catch (error) {
            console.log(error)
            throw new Error("No ethereum object")
        }
    }

    const checkifWalletIsConnected = async () => {
        try {
            if (!window.ethereum) return alert("Please install Metamask")

            const accounts = await provider.send("eth_accounts");
            if (accounts.length) {
                setCurrentAccount(accounts[0])
            } else {
                console.log("No accounts found")
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getBorrowerExists = async () => {
        try {
            if (currentAccount) {
                const exists = await contract.borrowerExists(currentAccount)
                setBorrowerExists(exists)
                if (exists) {
                    await getBorrowerInfo();
                }
            }

        } catch (error) {
            console.log(error)
            setBorrowerExists(false)
        }
    }

    const addNewBorrower = async (walletAddress, firstName, lastName) => {
        try {
            const newBorrower = await contract.addNewBorrower(walletAddress, firstName, lastName)
            await newBorrower.wait()
            console.log(`${firstName} added!`)
            getBorrowerExists()
        } catch (error) {
            console.log(error)
        }
    }

    const getBorrowerInfo = async () => {
        try {
            if (currentAccount) {
                const borrower = await contract.getBorrowerInfo(currentAccount)
                setBorrower(borrower);
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getBorrowerBalance = async () => {
        try {
            if (currentAccount) {
                const balance = await contract.getBorrowerBalance(currentAccount)
                setBorrowerBalance(ethers.utils.formatEther(balance).toString().slice(0, 5))
            }
        } catch (error) {
            console.log(error)
            setBorrowerBalance(ethers.utils.formatEther(0))
        }
    }

    const getCanTakeLoan = async () => {
        try {
            if (currentAccount) {
                const canTake = await contract.canTakeLoan(currentAccount)
                setCanTakeLoan(canTake)
            }
        } catch (error) {
            console.log(error)
            setCanTakeLoan(false)
        }

    }

    const deposit = async (value) => {
        try {
            const weiValue = ethers.utils.parseEther(value);
            const deposit = await contract.deposit(currentAccount, { value: weiValue })
            await deposit.wait()
            await getBorrowerBalance();
        } catch (error) {
            console.log(error)
        }
    }

    const withdraw = async (value) => {
        try {
            const weiValue = ethers.utils.parseUnits(value.toString(), "ether")
            const withdraw = await contract.withdraw(currentAccount, weiValue)
            await withdraw.wait();
            await getBorrowerBalance();

        } catch (error) {
            console.log(error)
            alert("You cannot withdraw more than you have on your balance")
        }
    }

    const calculateLoanInterest = async (loanAmount, installmentNumber) => {
        try {
            const weiValue = ethers.utils.parseEther(loanAmount.toString());
            const loanInterest = await contract.calculateInterestInPercent(weiValue, installmentNumber)
            await loanInterest.wait
            setLoanInterest(loanInterest)
            alert("Calculated loan interest - " + loanInterest + "%")

        } catch (error) {
            console.log(error)
        }
    }

    const takeLoan = async (amount, installmentsNumber, interest) => {
        try {
            const weiValue = ethers.utils.parseEther(amount.toString());
            const amountToBePaid = ethers.BigNumber.from((weiValue * (1 + (interest / 100))).toString())
            const loanStartDate = Math.floor(new Date(Date.now()).getTime() / 1000)
            const registerFee = loanAmount > 50
                ? loanAmount / 100
                : 0.5;
            const newLoan = await contract.takeLoan(currentAccount, weiValue, amountToBePaid, interest, installmentsNumber, loanStartDate,
                { value: ethers.utils.parseEther(registerFee.toString()) })
            await newLoan.wait
            alert("Loan took successfully!")
            await getBorrowerBalance()
            await getLoanInfo()
        } catch (error) {
            console.log(error)
        }
    }

    const getLoanInfo = async () => {
        try {
            const installmentAmount = await contract.getBorrowersInstallmentAmount(currentAccount)
            const installmentAmountEther = ethers.utils.formatEther(installmentAmount)
            setInstallmentAmount(installmentAmountEther.toString().slice(0, 5))
            console.log(installmentAmount.toString())
            const interest = await contract.getBorrowersInterest(currentAccount)
            setInterest(interest)
            const remainingInstallments = await contract.getBorrowersRemainingInstallmentNumber(currentAccount)
            setRemainingInstallments(remainingInstallments.toString())
            const nextInstallmentDueDate = await contract.getBorrowersNextInstallmentDate(currentAccount)
            const parsedDate = new Date(nextInstallmentDueDate * 1000)
            setNextInstallmentDueDate(parsedDate.toISOString().slice(0, 10))
        } catch (error) {
            console.log(error)
        }
    }

    const payInstallment = async (amountToPay) => {
        try {
            const payment = await contract.payInstallment(currentAccount, { value: amountToPay })
            await payment.wait
            alert("Installment paid successfully")
            await getLoanInfo()
            await getBorrowerBalance()
        } catch (error) {
            console.log(error)
        }
    }

    const getLoanHistory = async () => {
        try {
            if (currentAccount) {
                const loans = await contract.getBorrowerLoansHistory(currentAccount);
                setLoanHistory([... loans]);
            }
        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        checkifWalletIsConnected()
        getBorrowerBalance()
        getBorrowerInfo()
        getBorrowerExists()
        getCanTakeLoan()
        getLoanInfo()
        getLoanHistory()
    }, [currentAccount])



    return (
        <BlockchainContext.Provider
            value={{
                connectWallet,
                currentAccount,
                borrowerBalance,
                borrowerExists,
                borrower,
                addNewBorrower,
                canTakeLoan,
                deposit,
                withdraw,
                takeLoan,
                installmentAmount,
                interest,
                remainingInstallments,
                nextInstallmentDueDate,
                payInstallment,
                loanInterest,
                calculateLoanInterest,
                loanHistory
            }}>
            {children}
        </BlockchainContext.Provider>
    )
}