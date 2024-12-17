// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.26;

contract CharityDonation {
    // Events should be declared at contract level
    event CampaignCreated(
        uint256 id,
        string title,
        string description,
        uint256 targetAmount
    );
    event DonationReceived(address indexed donor, uint256 amount);
    event FundsWithdrawn(address indexed owner, uint256 amount);

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
    string public title;
    string public description;
    uint256 public id;
    uint256 private campaignCounter; // Add this state variable at the top with other state variables

    constructor(
        uint256 _targetAmount,
        uint256 _deadline,
        string memory _title,
        string memory _description
    ) {
        require(_targetAmount > 0, "Target amount must be greater than 0");
        require(_deadline > 0, "Deadline must be greater than 0");
        require(bytes(_title).length > 0, "Title cannot be empty");

        id = 1; // Or implement a counter system for multiple campaigns
        title = _title;
        description = _description;
        targetAmount = _targetAmount;
        deadline = block.timestamp + _deadline; // time in seconds
        minimumDonation = 1 wei;
        owner = msg.sender;

        emit CampaignCreated(id, title, description, targetAmount);
    }

    function createCampaign(
        uint256 _targetAmount,
        uint256 _deadline,
        string memory _title,
        string memory _description
    ) public {
        require(_targetAmount > 0, "Target amount must be greater than 0");
        require(_deadline > 0, "Deadline must be greater than 0");
        require(bytes(_title).length > 0, "Title cannot be empty");

        campaignCounter++;
        id = campaignCounter;
        title = _title;
        description = _description;
        targetAmount = _targetAmount;
        deadline = block.timestamp + _deadline;
        owner = msg.sender;

        // Reset campaign state
        raisedAmount = 0;
        isCompleted = false;
        numberOfDonors = 0;
        differenceInDonation = targetAmount;

        emit CampaignCreated(id, title, description, targetAmount);
    }

    function donateToCampaign(uint _donatedAmount) public payable {
        // Check campaign status
        require(!isCompleted, "Campaign has ended");
        require(block.timestamp < deadline, "Deadline has passed!");
        require(raisedAmount < targetAmount, "Campaign target already reached");

        // Validate donation amount
        require(msg.value >= minimumDonation, "Donation below minimum amount");
        require(
            msg.value == _donatedAmount,
            "Sent value doesn't match donation amount"
        );

        // Update donor information
        if (donors[msg.sender] == 0) {
            numberOfDonors++;
        }
        donors[msg.sender] += msg.value;
        donorAddress = msg.sender;
        donatedAmount = msg.value;

        // Update campaign status
        raisedAmount += msg.value;
        differenceInDonation = targetAmount - raisedAmount;

        // Check if target reached after this donation
        if (raisedAmount >= targetAmount) {
            isCompleted = true;
        }

        // Emit event for tracking
        emit DonationReceived(msg.sender, msg.value);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    // Function to withdraw funds, only callable by owner
    function withdrawFunds() public onlyOwner {
        require(address(this).balance > 0, "No funds to withdraw");
        require(
            isCompleted || block.timestamp >= deadline,
            "Campaign is still active"
        );

        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");

        (bool success, ) = payable(owner).call{value: balance}("");
        require(success, "Withdrawal failed");

        emit FundsWithdrawn(owner, balance);
    }
}

/**
 * ============================ constructor() =======================================
 * 1. validates input parameters (target amount, deadline, title)
 * 2. initializes the first campaign with ID 1
 * 3. sets campaign details (title, description, target amount)
 * 4. sets campaign deadline based on current block timestamp
 * 5. establishes minimum donation amount
 * 6. assigns contract owner as campaign creator
 * 7. emits CampaignCreated event
 */

/**
 * ============================ createCampaign() =======================================
 * 1. validates input parameters (target amount, deadline, title)
 * 2. increments campaign counter for unique ID
 * 3. sets new campaign details (title, description, target)
 * 4. calculates deadline from current timestamp
 * 5. assigns campaign owner as the creator
 * 6. resets all campaign state variables
 * 7. emits CampaignCreated event
 */

/**
 * ============================ donateToCampaign() =======================================
 * 1. validates campaign is still active and within deadline
 * 2. checks if campaign target hasn't been reached
 * 3. validates donation meets minimum amount requirement
 * 4. verifies sent ether matches declared donation amount
 * 5. updates donor count if first-time donor
 * 6. records donation in donors mapping
 * 7. updates campaign statistics (raised amount, difference)
 * 8. marks campaign as completed if target reached
 * 9. emits DonationReceived event
 */

/**
 * ============================ withdrawFunds() =======================================
 * 1. verifies caller is campaign owner
 * 2. checks if contract has funds to withdraw
 * 3. ensures campaign is either completed or deadline passed
 * 4. transfers entire balance to campaign owner
 * 5. emits FundsWithdrawn event
 */
