// "SPDX-License-Identifier: UNLICENSED"
pragma solidity ^0.8.0;
contract Transactions {  //like a class in OOPs
    uint256 transactionCount;

    event Transfer(address from, address receiver, uint amount, string message, uint256 timestamp, string keyword);
    // event is like a function which is to be called later

    struct TransferStruct {  //similar to an object but it is not been declared, only the attributes are defined
        address sender;
        address receiver;
        uint amount;
        string message;
        uint256 timestamp;
        string keyword;
    }

    TransferStruct[] transactions;
                                //must be there //                         may may not be
                            // receiver address which is payable address,  specific data stored in the memory of transaction
    function addToBlockchain (address payable receiver, uint amount, string memory message, string memory keyword) public{
        transactionCount+=1;
        transactions.push(TransferStruct(msg.sender, receiver, amount, message, block.timestamp, keyword));
        // upper code only to push it to array but not to carry out transaction
        emit Transfer(msg.sender, receiver, amount, message, block.timestamp, keyword);// to actually carry out transaction
    }
    function getAllTransactions() public view returns(TransferStruct[] memory) { /*return tranferstruct 
    object structures and it is going to get this from memory*/
       return transactions;
    
    }
    function getTransactionCount() public view returns (uint256) {
        return transactionCount;

    }

}