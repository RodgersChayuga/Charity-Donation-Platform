import {
    time,
    loadFixture,
} from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { parseEther, getAddress } from "viem";

describe("CharityDonationPlatform", function () {
    // First, create our fixture that will be reused across tests
    async function deployCharityFixture() {
        // Define test constants
        const CAMPAIGN_TITLE = "Save the Ocean";
        const CAMPAIGN_DESCRIPTION = "Clean ocean campaign";
        const TARGET_AMOUNT = parseEther("10"); // 10 ETH
        const DEADLINE = 7 * 24 * 60 * 60; // 1 week in seconds
        const MIN_DONATION = parseEther("0.01"); // Minimum donation from contract

        // Get test accounts
        const [deployer, campaignOwner, donor1, donor2] = await hre.viem.getWalletClients();

        // Deploy contract
        const charityPlatform = await hre.viem.deployContract("CharityDonationPlatform");

        // Get public client for reading blockchain state
        const publicClient = await hre.viem.getPublicClient();

        return {
            charityPlatform,
            deployer,
            campaignOwner,
            donor1,
            donor2,
            publicClient,
            CAMPAIGN_TITLE,
            CAMPAIGN_DESCRIPTION,
            TARGET_AMOUNT,
            DEADLINE,
            MIN_DONATION,
        };
    }

    // Move createTestCampaign here, before all describe blocks
    async function createTestCampaign() {
        const fixture = await loadFixture(deployCharityFixture);

        // Create a campaign first
        await fixture.charityPlatform.write.createCampaign([
            fixture.CAMPAIGN_TITLE,
            fixture.CAMPAIGN_DESCRIPTION,
            fixture.TARGET_AMOUNT,
            BigInt(fixture.DEADLINE)
        ], { account: fixture.campaignOwner.account });

        return fixture;
    }

    // Test Campaign Creation
    describe("Campaign Creation", function () {
        it("Should create a campaign with correct parameters", async function () {
            const {
                charityPlatform,
                campaignOwner,
                CAMPAIGN_TITLE,
                CAMPAIGN_DESCRIPTION,
                TARGET_AMOUNT,
                DEADLINE,
            } = await loadFixture(deployCharityFixture);

            // Create campaign
            const tx = await charityPlatform.write.createCampaign([
                CAMPAIGN_TITLE,
                CAMPAIGN_DESCRIPTION,
                TARGET_AMOUNT,
                BigInt(DEADLINE)
            ], { account: campaignOwner.account });

            // Get campaign ID (should be 1 as it's the first campaign)
            const campaignId = 1n;

            type Campaign = {
                id: bigint;
                title: string;
                description: string;
                targetAmount: bigint;
                raisedAmount: bigint;
                owner: string;
                deadline: bigint;
                isCompleted: boolean;
                numberOfDonors: bigint;
            }

            // Get campaign details
            const campaignArray = await charityPlatform.read.campaigns([campaignId]);
            const campaign: Campaign = {
                id: campaignArray[0],
                title: campaignArray[1],
                description: campaignArray[2],
                targetAmount: campaignArray[3],
                raisedAmount: campaignArray[4],
                owner: campaignArray[5],
                deadline: campaignArray[6],
                isCompleted: campaignArray[7],
                numberOfDonors: campaignArray[8]
            };

            // Verify campaign details
            expect(campaign.title).to.equal(CAMPAIGN_TITLE);
            expect(campaign.description).to.equal(CAMPAIGN_DESCRIPTION);
            expect(campaign.targetAmount).to.equal(TARGET_AMOUNT);
            expect(campaign.owner).to.equal(getAddress(campaignOwner.account.address));
            expect(campaign.isCompleted).to.be.false;
            expect(campaign.numberOfDonors).to.equal(0n);
        });

        it("Should revert if target amount is 0", async function () {
            const {
                charityPlatform,
                campaignOwner,
                CAMPAIGN_TITLE,
                CAMPAIGN_DESCRIPTION,
                DEADLINE,
            } = await loadFixture(deployCharityFixture);

            await expect(
                charityPlatform.write.createCampaign([
                    CAMPAIGN_TITLE,
                    CAMPAIGN_DESCRIPTION,
                    0n,
                    BigInt(DEADLINE)
                ], { account: campaignOwner.account })
            ).to.be.rejectedWith("Target amount must be greater than 0");
        });
    });

    // Test Donations
    describe("Donations", function () {
        it("Should accept valid donations", async function () {
            const { charityPlatform, donor1, TARGET_AMOUNT } = await createTestCampaign();
            const donationAmount = parseEther("1");
            const campaignId = 1n;

            await charityPlatform.write.donateToCampaign([campaignId], {
                account: donor1.account,
                value: donationAmount,
            });
            const campaign = await charityPlatform.read.campaigns([campaignId]);
            const [
                id,
                title,
                description,
                targetAmount,
                raisedAmount,
                owner,
                deadline,
                isCompleted,
                numberOfDonors
            ] = campaign;
            expect(raisedAmount).to.equal(donationAmount);
            expect(numberOfDonors).to.equal(1n);
        });

        it("Should track unique donors correctly", async function () {
            const { charityPlatform, donor1 } = await createTestCampaign();
            const donationAmount = parseEther("1");
            const campaignId = 1n;

            // First donation
            await charityPlatform.write.donateToCampaign([campaignId], {
                account: donor1.account,
                value: donationAmount,
            });

            // Second donation from same donor
            await charityPlatform.write.donateToCampaign([campaignId], {
                account: donor1.account,
                value: donationAmount,
            });
            const campaign = await charityPlatform.read.campaigns([campaignId]);
            const [
                id,
                title,
                description,
                targetAmount,
                raisedAmount,
                owner,
                deadline,
                isCompleted,
                numberOfDonors
            ] = campaign;
            expect(numberOfDonors).to.equal(1n); // Should still be 1
            expect(raisedAmount).to.equal(donationAmount * 2n);
        });
    });

    // Test Withdrawals
    describe("Withdrawals", function () {
        it("Should allow owner to withdraw after deadline", async function () {
            const {
                charityPlatform,
                campaignOwner,
                donor1,
                DEADLINE
            } = await createTestCampaign();
            const campaignId = 1n;

            // Make a donation
            await charityPlatform.write.donateToCampaign([campaignId], {
                account: donor1.account,
                value: parseEther("1"),
            });

            // Fast forward time past deadline
            await time.increase(DEADLINE + 1);

            // Withdraw funds
            await charityPlatform.write.withdrawFunds([campaignId], {
                account: campaignOwner.account,
            });
            const campaign = await charityPlatform.read.campaigns([campaignId]);
            const [
                id,
                title,
                description,
                targetAmount,
                raisedAmount,
                owner,
                deadline,
                isCompleted,
                numberOfDonors
            ] = campaign;
            expect(raisedAmount).to.equal(0n);
        });

        it("Should prevent non-owners from withdrawing", async function () {
            const {
                charityPlatform,
                donor1,
                DEADLINE
            } = await createTestCampaign();
            const campaignId = 1n;

            await time.increase(DEADLINE + 1);

            await expect(
                charityPlatform.write.withdrawFunds([campaignId], {
                    account: donor1.account,
                })
            ).to.be.rejectedWith("Only campaign owner can withdraw");
        });
    });

    // Test Campaign Progress
    describe("Campaign Progress", function () {
        it("Should calculate remaining amount correctly", async function () {
            const { charityPlatform, donor1 } = await createTestCampaign();
            const campaignId = 1n;

            await charityPlatform.write.donateToCampaign([campaignId], {
                account: donor1.account,
                value: parseEther("4"),
            });

            const remainingAmount = await charityPlatform.read.getRemainingAmount([campaignId]);
            expect(remainingAmount).to.equal(parseEther("6")); // 10 - 4 = 6
        });

        it("Should calculate progress percentage correctly", async function () {
            const { charityPlatform, donor1 } = await createTestCampaign();
            const campaignId = 1n;

            await charityPlatform.write.donateToCampaign([campaignId], {
                account: donor1.account,
                value: parseEther("2.5"),
            });

            const progress = await charityPlatform.read.getCampaignProgress([campaignId]);
            expect(progress).to.equal(25n); // 25% progress (2.5 out of 10 ETH)
        });
    });
});
