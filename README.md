# Charity Donation Platform Smart Contract

A decentralized charity donation platform built on Ethereum that enables transparent, secure, and efficient fundraising campaigns.

## Features

- **Campaign Creation**: Create fundraising campaigns with customizable titles, descriptions, targets, and deadlines
- **Secure Donations**: Direct ETH donations with minimum amount requirements
- **Progress Tracking**: Real-time tracking of campaign progress and remaining amounts
- **Donor Management**: Unique donor tracking and donation history
- **Automated Completion**: Automatic campaign completion upon reaching targets
- **Secure Withdrawals**: Role-based access control for campaign fund withdrawals

## Smart Contract Details

### Core Functions

1. **Campaign Management**
   - `createCampaign()`: Create new fundraising campaigns
   - `getCampaignProgress()`: Track campaign completion percentage
   - `getRemainingAmount()`: View remaining amount needed

2. **Donation Handling**
   - `donateToCampaign()`: Make ETH donations to campaigns
   - Minimum donation: 0.01 ETH
   - Automatic tracking of unique donors

3. **Fund Management**
   - `withdrawFunds()`: Secure withdrawal system for campaign owners
   - Built-in protection against re-entrancy attacks
   - Role-based access control

### Events

- `CampaignCreated`
- `DonationReceived`
- `CampaignCompleted`
- `FundsWithdrawn`

## Technical Stack

- Solidity ^0.8.26
- Hardhat Development Environment
- Ethereum Network

## Getting Started

### Prerequisites

- Node.js
- npm or yarn
- Hardhat

### Installation

1. Clone the repository
```bash
git clone [https://github.com/RodgersChayuga/charity-donation-platform]
```

2. Install dependencies
```bash
npm install / yarn 
```

3. Compile contracts
```bash
npx hardhat compile
```

4. Run tests
```bash
npx hardhat test
```

### Deployment

1. Set up your environment variables
```bash
cp .env.example .env
# Add your network API keys and private key
```

2. Deploy to network
```bash
npx hardhat run scripts/deploy.js --network [network-name]
```

## Testing

Run the test suite:
```bash
npx hardhat test
```

For gas reporting:
```bash
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.ts
```

## Security Considerations

- Role-based access control for withdrawals
- Re-entrancy protection
- Minimum donation requirements
- Deadline enforcement
- Safe math operations

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

This is project has a Project Brief - see the [Project Brief](Assignment_Charity_Donation_Platform_Brief.pdf) file for details

This is project has a Design Structure - see the [Design Structure](charity-donation-platform-design.md) file for details

This is project has a Project Roadmap - see the [Project Roadmap](charity-donation-platform-roadmap.md) file for details



## Contact

Blockchain Doctor - [@BlockchainDocta](https://x.com/BlockchainDocta)
By [Rodgers Chayuga](https://www.rodgerschayuga.com)
Project Link: [https://github.com/RodgersChayuga/charity-donation-platform](https://github.com/RodgersChayuga/charity-donation-platform)

## Acknowledgments

- OpenZeppelin for security patterns
- Hardhat development environment
- Ethereum community
