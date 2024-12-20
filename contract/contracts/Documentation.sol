// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

/**
 * ============================ CharityDonationPlatform ===========================
 * @title A decentralized charity donation platform
 * @dev Enables creation and management of charitable campaigns with the following:
 *
 * Core Components:
 * 1. Campaign Management
 *    - Stores campaign details (ID, title, description, targets)
 *    - Tracks campaign progress and completion status
 *    - Manages campaign deadlines and ownership
 *
 * 2. Donor Management
 *    - Records donor contributions
 *    - Maintains donor-campaign relationships
 *    - Tracks individual donation amounts
 *
 * 3. Financial Controls
 *    - Enforces minimum donation amount (0.01 ETH)
 *    - Tracks raised amounts per campaign
 *    - Validates campaign targets
 *
 * Key Structures:
 * - Campaign: Stores complete campaign information
 * - Donor: Records individual donor details
 *
 * State Management:
 * - campaigns: Maps campaign IDs to Campaign details
 * - campaignDonor: Maps campaign IDs to array of donors
 * - hasDashboard: Tracks dashboard access rights
 *
 * Events:
 * - CampaignCreated: Triggered when new campaign is created
 * - DonationReceived: Triggered when donation is made
 * - CampaignCompleted: Triggered when campaign reaches target
 */

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

    // Create counter for campaign IDs
    /**
     * This can be done in a better way eg
     * 1. Hash-based Unique ID,
     * 2. OpenZeppelin's Counters Library etc
     */

    uint256 public campaignCounter = 0;

    /**
     * @notice Create a new charity campaign
     * @dev Creates a new campaign with specified parameters and emits CampaignCreated event
     *
     * Core Functions:
     * 1. Input Validation
     *    - Validates deadline is future timestamp
     *    - Ensures target amount is positive
     *
     * 2. Campaign Creation
     *    - Generates unique campaign ID
     *    - Initializes campaign structure
     *    - Sets owner to message sender
     *
     * 3. State Management
     *    - Stores campaign in campaigns mapping
     *    - Updates campaign counter
     *
     * @param _title Campaign title for display
     * @param _description Detailed campaign description
     * @param _targetAmount Fundraising goal in wei
     * @param _deadline Duration in seconds from now until campaign ends
     * @return uint256 Newly created campaign ID
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
            isCompleted: false
        });

        emit CampaignCreated(campaignId, msg.sender, _targetAmount, _deadline);

        return campaignId;
    }
}

/**
 *  ----------------------
 *  | Blockchain Doctor  |
 *  | by Rodgers Chayuga |
 *  ----------------------
 */
