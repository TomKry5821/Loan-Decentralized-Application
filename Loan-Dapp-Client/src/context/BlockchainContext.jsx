import React, { useEffect, useState } from 'react'
import { abi, contractAddress } from '../config.json'
import { ethers } from "ethers"
import { toast } from 'react-toastify';

export const BlockchainContext = React.createContext("");

export const BlockchainProvider = ({ children }) => {
    const [currentAccount, setCurrentAccount] = useState("");
    //const [balance, setBalance] = useState()
    const [borrowerExists, setBorrowerExists] = useState()
    //const [renter, setRenter] = useState()
    const [borrowerBalance, setBorrowerBalance] = useState()
    //const [due, setDue] = useState()
    //const [duration, setDuration] = useState()

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()

    const address = contractAddress;
    const contractAbi = abi;
    const contract = new ethers.Contract(address, contractAbi, signer);

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
        try{
            if(currentAccount){
                const exists = await contract.borrowerExists(currentAccount)
                setBorrowerExists(exists)
            }

        } catch (error) {
            console.log(error)
            setBorrowerExists(false)
        }
    }

    const getBorrowerBalance = async () => {
        try {
            if (currentAccount) {
                const balance = await contract.getBorrowerBalance(currentAccount)
                setBorrowerBalance(ethers.utils.formatEther(balance))
            }
        } catch (error) {
            console.log(error)
            setBorrowerBalance(ethers.utils.formatEther(0))
        }
    }


    useEffect(() => {
        checkifWalletIsConnected()
        getBorrowerBalance()
        getBorrowerExists()
    }, [currentAccount])



    return (
        <BlockchainContext.Provider
            value={{
                connectWallet,
                currentAccount,
                borrowerBalance,
                borrowerExists
            }}>
            {children}
        </BlockchainContext.Provider>
    )
}