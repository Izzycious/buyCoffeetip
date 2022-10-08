//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract BuyMeCoffee {
    //event to emit when a memo is created

    event NewMemo (
        address indexed from, 
        uint256 timestamp, 
        string name, 
        string message
        );

    //Memo struct
    struct Memo {
        address from;
        uint256 timestamp;
        string name;
        string message;
    }

    //address of contract deployer, to be marked payable in order for us to be able to withdraw later
    address payable owner;

    //list of memos received from the coffee purchases
    Memo[] memos;

    constructor() {
        //store the address of the deployer as a payable address
        // when we withraw funds it will be refunded here
        owner = payable(msg.sender);
    }
    /**
     * @dev fetches all stored memos.
     */
    function getMemos() public view returns(Memo[] memory) {
        return memos;
    }
    /**
     * @dev buy a coffee for owner (sends an ETH tip and leaves a memo)
     * @param _name name of the purchaser
     * @param _message a nice message from the purchaser
     */
    function buyCoffee(string memory _name, string memory _message) public payable {
        //must accept more than 0ETH for coffee
        require(msg.value > 0, "Puchasing coffee is not free!!");

        //Add memos to storage
        memos.push(Memo(
            msg.sender,
            block.timestamp,
            _name,
            _message
        ));

        //Emit a NewMemo event with details about the memo.
        emit NewMemo(
            msg.sender,
            block.timestamp,
            _name,
            _message
        );

    }
    /**
     * @dev send the entire funds stored in the contract.
     * 
     */
    function withdrawTips() public{
        require(owner.send(address(this).balance));
    }

}