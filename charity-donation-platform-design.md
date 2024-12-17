# Charity Donation Platform - Planning and Design

## Project Overview
A transparent and secure blockchain-based donation platform designed to enable direct, accountable charitable contributions.

## Key Objectives
- Enable transparent and secure donations
- Provide robust accountability and trust mechanisms

## Smart Contract Structure

### Data Structures
1. **Campaign**
   - `id`: Unique identifier
   - `title`: Campaign name
   - `description`: Campaign details
   - `targetAmount`: Fundraising goal
   - `raisedAmount`: Current funds raised
   - `owner`: Campaign creator's address
   - `isCompleted`: Campaign completion status

2. **Donor**
   - `donorAddress`: Contributor's wallet address
   - `amount`: Contributed amount

## Core Functions
1. `createCampaign()`
   - Allows campaign creation
   - Sets initial campaign parameters

2. `donateToCampaign()`
   - Enables ETH contributions
   - Updates raised amount
   - Tracks donor information

3. `withdrawFunds()`
   - Permits fund extraction
   - Implements withdrawal mechanisms
   - Ensures proper access controls

## Event Logging
- `CampaignCreated`
- `DonationReceived`
- `FundsWithdrawn`

## Security Mechanisms
- Role-Based Access Control (RBAC)
- Reentrancy protection
- Strict function access management

## Key Design Principles
- Transparency in donation tracking
- Secure fund management
- Clear accountability for campaign creators
- Immutable donation records
- Controlled fund withdrawal

## Technical Constraints
- Develop using Solidity
- Deploy on Sepolia Testnet
- Integrate with Ethers.js
- Use Hardhat for development and testing

## Evaluation Criteria
- **Functionality**: Complete implementation of specified features
- **Security**: 
  * Robust role-based access controls
  * Reentrancy protection mechanisms
- **Code Quality**: 
  * Clean and modular design
  * Adherence to Solidity best practices
- **Documentation**: 
  * Clear function and contract documentation
- **Test Coverage**: 
  * Comprehensive testing of critical functionalities

## Recommended Development Timeline
- **Week 1**: Core contract development and initial testing
- **Week 2**: Hardhat migration, extensive testing, testnet deployment
- **Week 3**: Frontend integration and final project documentation
