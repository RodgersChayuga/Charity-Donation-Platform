// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract CharityDonationPlatform {
    // Struct to represent a campaign
    struct Campaign {
        uint256 id;
        string title;
        string description;
        uint256 targetAmount;
        uint256 raisedAmount;
        address owner;
        uint256 deadline;
        bool isCompleted;
        uint256 numberOfDonors;
    }

    // Struct to represent a donor
    struct Donor {
        address donorAddress;
        uint256 amount;
    }

    // Maps campaign IDs to Campaign struct data
    mapping(uint256 => Campaign) public campaigns;

    // Maps campaign IDs to an array of donors and their donation amounts
    mapping(uint256 => Donor[]) public campaignDonors;

    // Maps campaign IDs to donor addresses to track if they've already donated
    // Used to count unique donors per campaign
    mapping(uint256 => mapping(address => bool)) public hasDonated;

    // Minimum donation amount ( can be adjusted)
    uint256 public constant MIN_DONATION_AMOUNT = 0.01 ether;

    // Events
    event CampaignCreated(
        uint256 indexed campaignId,
        address indexed owner,
        uint256 targetAmount,
        uint256 deadline
    );
    event DonationReceived(
        uint256 indexed campaignId,
        address indexed donor,
        uint256 numberOfDonors,
        uint256 amount
    );
    event CampaignCompleted(uint256 indexed campaignId, uint256 totalRaised);
    event FundsWithdrawn(
        uint256 indexed campaignId,
        address indexed owner,
        uint256 amount
    );

    // ========================================== Create Campaign ==============================================

    // Create counter for different campaign IDs
    uint256 public campaignCounter = 0;

    /**
     * ========================== createCampaign() =========================
     * Creates a new fundraising campaign with specified parameters
     * Validates deadline and target amount
     * Returns unique campaign ID for future reference
     * Emits CampaignCreated event
     *
     * @notice Create a new charity campaign
     * @param _title Campaign title
     * @param _description Campaign description
     * @param _targetAmount Fundraising target amount
     * @param _deadline Campaign end timestamp
     */
    function createCampaign(
        string memory _title,
        string memory _description,
        uint256 _targetAmount,
        uint256 _deadline
    ) public returns (uint256) {
        require(_deadline > 0, "Deadline must be in the future");
        require(_targetAmount > 0, "Target amount must be greater than 0");

        campaignCounter++;
        uint256 campaignId = campaignCounter;

        campaigns[campaignId] = Campaign({
            id: campaignId,
            title: _title,
            description: _description,
            targetAmount: _targetAmount,
            raisedAmount: 0,
            owner: msg.sender,
            deadline: block.timestamp + _deadline, // time in seconds
            isCompleted: false,
            numberOfDonors: 0 // Keep track of the numbers of non repeating donors
        });

        emit CampaignCreated(campaignId, msg.sender, _targetAmount, _deadline);

        return campaignId;
    }

    // ============================================ Donate to Campaign ================================================

    /**
     * ========================== donateToCampaign() =========================
     * Allows users to donate ETH to specific campaigns
     * Enforces minimum donation amount and campaign deadlines
     * Tracks unique donors and updates campaign statistics
     * Automatically marks campaign as complete when target reached
     * Emits DonationReceived event
     */

    /**
     * @notice Donate to a specific Campaign
     * @param _campaignId The ID of the campaign to donate to
     */

    function donateToCampaign(uint256 _campaignId) public payable {
        // 1. Validate campaign is still active and within deadline
        require(
            block.timestamp <= campaigns[_campaignId].deadline,
            "Campaign has ended"
        );
        require(
            !campaigns[_campaignId].isCompleted,
            "Campaign is already completed"
        );

        //2. Check campaign target hasn't been reached
        require(
            campaigns[_campaignId].raisedAmount + msg.value <=
                campaigns[_campaignId].targetAmount,
            "Donation would exceed campaign target"
        );

        // 3. Validate minimum donation amount
        require(
            msg.value >= MIN_DONATION_AMOUNT,
            "Donation amount is below minimum"
        );

        // 4. Verify sent ether matches declared donation amount (implicit in payable function)

        // 5. Update donor count if first-time donor
        if (!hasDonated[_campaignId][msg.sender]) {
            hasDonated[_campaignId][msg.sender] = true;
            campaigns[_campaignId].numberOfDonors += 1;
        }

        // 6. Record donation in donors mapping
        campaignDonors[_campaignId].push(
            Donor({donorAddress: msg.sender, amount: msg.value})
        );

        // 7. Update campaign raised amount
        campaigns[_campaignId].raisedAmount += msg.value;

        // 8. Mark campaign as completed if target reached
        if (
            campaigns[_campaignId].raisedAmount >=
            campaigns[_campaignId].targetAmount
        ) {
            campaigns[_campaignId].isCompleted = true;
            emit CampaignCompleted(
                _campaignId,
                campaigns[_campaignId].raisedAmount
            );
        }

        emit DonationReceived(
            _campaignId,
            msg.sender,
            msg.value,
            campaigns[_campaignId].numberOfDonors
        );
    }

    // ============================================= Withdraw Function ================================================
    /**
     * ========================== withdrawFunds() =========================
     * Allows campaign owner to withdraw raised funds
     * Implements role-based access control for campaign owners
     * Only accessible after campaign completion or deadline
     * Includes re-entrancy protection
     * Emits FundsWithdrawn event
     */
    /**
     * @notice Withdraw funds from a completed campaign
     * @param _campaignId The ID of the campaign to withdraw from
     */
    function withdrawFunds(uint256 _campaignId) public {
        Campaign storage campaign = campaigns[_campaignId];

        // Check if caller is the campaign owner
        require(
            msg.sender == campaign.owner,
            "Only campaign owner can withdraw"
        );

        // Ensure campaign is completed either by reaching target or deadline
        require(
            campaign.isCompleted || block.timestamp > campaign.deadline,
            "Campaign is still active"
        );

        // Ensure there are funds to withdraw
        require(campaign.raisedAmount > 0, "No funds to withdraw");

        // Get the amount to transfer
        uint256 amountToWithdraw = campaign.raisedAmount;

        // Reset raised amount to prevent re-entrancy
        campaign.raisedAmount = 0;

        // Transfer funds to campaign owner
        (bool success, ) = payable(campaign.owner).call{
            value: amountToWithdraw
        }("");
        require(success, "Transfer failed");

        // Emit withdrawal event
        emit FundsWithdrawn(_campaignId, campaign.owner, amountToWithdraw);
    }

    // ================================== Get Donation difference and Percentage  =====================================

    /**
     * ========================== getRemainingAmount() =========================
     * Calculates the exact amount still needed
     * Returns 0 if target is already reached
     * Prevents potential underflow
     */
    /**
     * @notice Calculate the remaining amount needed to reach the campaign target.
     * @param _campaignId The ID of the Campaign.
     * @return remainingAmount The amount still needed to complete the campaign.
     */
    function getRemainingAmount(
        uint256 _campaignId
    ) public view returns (uint256 remainingAmount) {
        Campaign memory campaign = campaigns[_campaignId];

        // Prevent underflow by using safeMath-like approach
        if (campaign.raisedAmount >= campaign.targetAmount) {
            return 0;
        }

        return campaign.targetAmount - campaign.raisedAmount;
    }

    /**
     * ========================== getCampaignProgress() =========================
     * Calculates the percentage of target amount that has been raised
     * Returns 0 if target amount is zero to prevent division by zero
     * Returns whole number percentage (e.g., 75 for 75%)
     */
    /**
     * @notice Get campaign progress percentage
     * @param _campaignId The ID of the campaign
     * @return progressPercentage Percentage of target amount raised
     */
    function getCampaignProgress(
        uint256 _campaignId
    ) public view returns (uint256 progressPercentage) {
        Campaign memory campaign = campaigns[_campaignId];

        // Prevent division by zero and handle overflow
        if (campaign.targetAmount == 0) {
            return 0;
        }

        // Calculate percentage with 2 decimal places of precision
        return (campaign.raisedAmount * 100) / campaign.targetAmount;
    }
}
