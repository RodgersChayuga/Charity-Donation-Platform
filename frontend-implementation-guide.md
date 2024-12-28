# Charity Donation Platform - Frontend Implementation Guide

## Table of Contents
- [Charity Donation Platform - Frontend Implementation Guide](#charity-donation-platform---frontend-implementation-guide)
  - [Table of Contents](#table-of-contents)
  - [Landing Page](#landing-page)
  - [Campaign Creation](#campaign-creation)
  - [Campaign Details Page](#campaign-details-page)
  - [Donation Flow](#donation-flow)
  - [Withdrawal Flow](#withdrawal-flow)
  - [Technical Implementation](#technical-implementation)
    - [Wallet Connection](#wallet-connection)
    - [Reading Campaign Data](#reading-campaign-data)
    - [Making Donations](#making-donations)
    - [Withdrawing Funds](#withdrawing-funds)
    - [Event Listeners](#event-listeners)
  - [UI Considerations](#ui-considerations)
    - [Real-time Updates](#real-time-updates)
    - [Error Handling](#error-handling)
    - [Responsive Design](#responsive-design)
    - [User Feedback](#user-feedback)

## Landing Page
- List of active charity campaigns
- Campaign cards displaying:
  - Title
  - Description
  - Progress bar (using `getCampaignProgress()`)
  - Amount raised vs target amount
  - Number of donors
  - Time remaining until deadline

## Campaign Creation
1. "Create Campaign" button
2. Form fields:
   - Campaign Title
   - Description
   - Target Amount (in ETH)
   - Duration (converted to deadline timestamp)
3. Metamask popup for transaction approval
4. Loading state while transaction confirms
5. Success notification with campaign ID

## Campaign Details Page
Detailed view showing:
- Campaign information
- Progress metrics:
  - Current amount raised
  - Remaining amount
  - Progress percentage
  - Number of unique donors
  - Time remaining

## Donation Flow
1. "Donate" button on campaign page
2. Input field for donation amount (min 0.01 ETH)
3. Metamask popup showing:
   - Gas fees
   - Donation amount
4. Loading state during transaction
5. Success notification with:
   - Transaction hash
   - Updated campaign progress

## Withdrawal Flow
Campaign owner exclusive:
1. Special section for campaign owner
2. "Withdraw Funds" button (visible when):
   - Campaign target is reached
   - Deadline has passed
3. Metamask popup for withdrawal transaction
4. Success notification with withdrawn amount

## Technical Implementation

### Wallet Connection
```javascript
const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
        try {
            // Update UI to show connected state
            await window.ethereum.request({ method: 'eth_requestAccounts' });
        } catch (error) {
        console.error('User rejected connection');
        }
    }
};
```

### Reading Campaign Data
```javascript
const getCampaignDetails = async (campaignId) => {
  const campaign = await contract.campaigns(campaignId);
  const progress = await contract.getCampaignProgress(campaignId);
  const remaining = await contract.getRemainingAmount(campaignId);
  
  return {
    title: campaign.title,
    description: campaign.description,
    raised: ethers.utils.formatEther(campaign.raisedAmount),
    target: ethers.utils.formatEther(campaign.targetAmount),
    progress: progress.toString(),
    remaining: ethers.utils.formatEther(remaining),
    deadline: new Date(campaign.deadline * 1000),
    donors: campaign.numberOfDonors.toString()
  };
};
```

### Making Donations
```javascript
const donate = async (campaignId, amount) => {
  try {
    const tx = await contract.donateToCampaign(campaignId, {
      value: ethers.utils.parseEther(amount)
    });
    await tx.wait();
    // Update UI to show success
  } catch (error) {
    // Handle errors
  }
};
```

### Withdrawing Funds
```javascript
const withdrawFunds = async (campaignId) => {
  try {
    const tx = await contract.withdrawFunds(campaignId);
    await tx.wait();
    // Update UI to show success
  } catch (error) {
    // Handle errors
  }
};
```

### Event Listeners
```javascript
contract.on("DonationReceived", (campaignId, donor, amount, donors) => {
  // Update UI with new donation
  updateCampaignDisplay(campaignId);
});

contract.on("CampaignCompleted", (campaignId, totalRaised) => {
  // Show campaign completion status
  markCampaignAsCompleted(campaignId);
});
```

## UI Considerations

### Real-time Updates
- Listen to contract events
- Show loading states
- Display transaction confirmations

### Error Handling
- Friendly error messages for:
  - Insufficient funds
  - Campaign ended
  - Minimum donation amount
  - Network issues

### Responsive Design
- Mobile-friendly interface
- Easy-to-read progress indicators
- Clear call-to-action buttons

### User Feedback
- Transaction status notifications
- Success/error messages
- Campaign progress updates