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
    }

    // Struct to represent a donor
    struct Donor {
        address donorAddress;
        uint256 amount;
    }

    // Mappings
    mapping(uint256 => Campaign) public campaigns;
    mapping(uint256 => Donor[]) public campaignDonor;
    mapping(uint256 => mapping(address => bool)) public hasDashboard;

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
        uint256 amount
    );
    event CampaignCompleted(uint256 indexed campaignId, uint256 totalRaised);

    // ========================================== Create Campaign ==============================================

    // Create counter for different campaign IDs
    uint256 public campaignCounter = 0;

    /**
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
        require(_deadline > block.timestamp, "Deadline must be in the future");
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
            deadline: _deadline,
            isCompleted: false
        });

        emit CampaignCreated(campaignId, msg.sender, _targetAmount, _deadline);

        return campaignId;
    }

    // ============================================ Donate to Campaign ================================================

    // ========================================== Get Donation difference ==============================================

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
}

/**
 * ========================== getRemainingAmount() =========================
 * Calculates the exact amount still needed
 * Returns 0 if target is already reached
 * Prevents potential underflow
 */
