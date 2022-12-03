//we are using react context to connect our blockchain to the client side
// instead of writing it in all components we will write it in a single file and import

import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

import { contractABI, contractAddress } from "../utils/constants";
import { AiOutlineReload } from "react-icons/ai";

export const TransactionContext = React.createContext();

const { ethereum } = window;  // This is an object we can use this because we have metamask

const getEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(contractAddress, contractABI, signer);

    return transactionContract;
}






export const TransactionProvider = ({children}) => {
    
    const [currentAccount,setCurrentAccount] = useState('');
    const [formData, setformData] = useState({ addressTo: "", amount: "", keyword: "", message: "" });
    ///created state variable in above code
    const [isLoading, setIsLoading] = useState(false);
    const [transactionCount, setTransactionCount] = useState(localStorage.getItem("transactionCount"));
    const [transactions, setTransactions] = useState([]);
    const handleChange = (e, name) => {
        setformData((prevState) => ({ ...prevState, [name]: e.target.value }));
      };
    
    


    
    
    const checkIfWalletIsConnected =async () => {
        try {
            if(!ethereum) return alert('Please install metamask');
            const accounts = await ethereum.request({method: 'eth_accounts'});
            
            if(accounts.length) {
                setCurrentAccount(accounts[0])
                getAllTransactions();

            } else {
                console.log("No accounts found")
            }
        } catch (error) {
            console.log(error)
            throw new Error(" No ethereum object")
        }
    }


    const checkIfTransactionsExists = async () => {
        try {
            if (!ethereum) return alert("Please install MetaMask.");
            const transactionsContract = getEthereumContract();
            const currentTransactionCount = await transactionsContract.getTransactionCount();
    
            window.localStorage.setItem("transactionCount", currentTransactionCount);
          
        } catch (error) {
          console.log(error);
    
          throw new Error("No ethereum object");
        }
      };

    const getAllTransactions = async () => {
        try{
            if(!ethereum) return alert('Please install metamask');
            const transactionsContract = getEthereumContract();

            const availableTransactions = await transactionsContract.getAllTransactions();
            const structuredTransactions = availableTransactions.map((transaction) => ({
                addressTo: transaction.receiver,
                addressFrom: transaction.sender,
                timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
                message: transaction.message,
                keyword: transaction.keyword,
                amount: parseInt(transaction.amount._hex) / (10 ** 18)
              }));
              console.log(structuredTransactions);

              setTransactions(structuredTransactions);
        } catch (error) {
            console.log(error);
        }
    }

    const connectWallet= async () => {
        try{
            if(!ethereum) return alert('Please install metamask');
            const accounts = await ethereum.request({method: 'eth_requestAccounts',});
            
            setCurrentAccount(accounts[0])
                
        } catch (error) {
            console.log(error);
    
            throw new Error('No ethereum object');
        }
    } 


    const sendTransaction = async () => {
        //logic for sending and storing Transaction
        try{
            if(!ethereum) return alert('Please install metamask');
            const {addressTo, amount, keyword, message} = formData;
            const transactionContract = getEthereumContract();
            const parsedAmount = ethers.utils.parseEther(amount);
            
            // if transactionCount was set to 0 it is going to reload with page
            //so we are storing it in local storage
            await ethereum.request({
                method: 'eth_sendTransaction' ,
                params: [{
                    from: currentAccount,
                    to: addressTo,
                    gas: "0x5208", // 21000 GWEI
                    value: parsedAmount._hex,// to convert amount to GWEI
                  }],
                

            });

            const transactionHash = await transactionContract.addToBlockchain(addressTo, parsedAmount, message, keyword);

            setIsLoading(true);
            console.log(`Loading - ${transactionHash.hash}`);
            await transactionHash.wait();
            console.log(`Success - ${transactionHash.hash}`);
            setIsLoading(false);

            const transactionsCount = await transactionContract.getTransactionCount();
            setTransactionCount(transactionsCount.toNumber());
            
            window.reload();
            
        } catch (error) {
            console.log(error);

            throw new Error("No ethereum object");
        }
    }


    useEffect(() => {
        checkIfWalletIsConnected();
        checkIfTransactionsExists();
    },[]);
    
    
    return(
        <TransactionContext.Provider value={{connectWallet, currentAccount, formData, setformData, handleChange, sendTransaction, transactions, isLoading}}>
            {children}
        </TransactionContext.Provider>
    )
}