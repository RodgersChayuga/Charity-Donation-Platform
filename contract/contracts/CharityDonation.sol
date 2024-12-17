// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.28;

contract CharityDonation {
    mapping(address => uint) public donors;
    address public owner; //stores the owner of the campaign
    address public donorAddress; // stores the address of the donor
    uint256 public numberOfDonors; // stores the number of Donors in a campaign
    uint256 public targetAmount; // stores the targeted amount
    uint256 public minimumDonation; // stores the value of the minimum
    uint256 public donatedAmount; // Stores the amount donated by a Donor
    uint256 public raisedAmount; // Stores total amount raised in a campaign
    uint256 public differenceInDonation; // Stores the difference between target amount and the raised amount in a campaign.
    uint256 public deadline; // timestamp in seconds
    bool public isCompleted; // indicates whether or not the campaign has ended.

    // string public title;
    // string public description;
    // uint256 public id;

    constructor(uint _targetAmount, uint _deadline) {
        targetAmount = _targetAmount;
        deadline = block.timestamp + _deadline; //_deadline in seconds
        minimumDonation = 100 wei;
        owner = msg.sender;
    }

    // TODO: Create Campaign function
    function createCampaign() public {}

    function donateToCampaign() public payable {
        require(block.timestamp < deadline, "Deadline has passed!");
        require(msg.value > minimumDonation, "Mini Contribution not met!");
        require(msg.value > donatedAmount, "Try a lesser amount");

        // If the donor is donating the first time, we increase the number of Donors by one, else it remains the same.
        if (donors[msg.sender] == 0) {
            numberOfDonors += 1;
        }

        // We are adding the value added with the address to the donors mapping.
        donors[msg.sender] += msg.value;

        // We increase the total value (raisedAmount) in the donors, by adding the amount donated by the donor (donatedAmount)
        raisedAmount += msg.value;

        // Updated the difference between the total raised amount and the target amount
        differenceInDonation = targetAmount - raisedAmount;
    }

    // TODO: Withdraw Fund function.
    function withdrawFunds() public {}

    // the contract will receive eth, if there is a payable function called receive.
    // This will be replaced by a frontend button
    // TODO: remove once frontend is ready.
    receive() external payable {
        donateToCampaign();
    }
}
