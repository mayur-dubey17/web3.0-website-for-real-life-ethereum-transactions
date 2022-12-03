import abi from './Transactions.json';
// in smart_contract/artifacts/contracts/transaction.sol/transactions.json we find the abi for our contract
// it contains all the information relating to our specific smart contract
// it is used to connect a contract with contract or outside the blockchain


export const contractABI = abi.abi;
export const contractAddress= '0xBDa04b84766499D52028a225da3f96a897cbD495';
