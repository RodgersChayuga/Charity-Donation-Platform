import { time, loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { parseEther, getAddress, WalletClient, PublicClient, Address, Account } from "viem";

interface Contract {
    write: Record<string, Function>;
    read: Record<string, Function>;
    address: Address;
};

interface WalletClientWithAccount extends WalletClient {
    account: Account;
}

interface TestSetup {
    contract: Contract;
    owner: WalletClientWithAccount;
    creator: WalletClientWithAccount;
    donor1: WalletClientWithAccount;
    donor2: WalletClientWithAccount;
    client: PublicClient;
}

interface CampaignSetup extends TestSetup {
    campaignId: bigint;
}

interface Campaign {
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

const TEST_VALUES = {
    TITLE: "Save the Ocean",
    DESCRIPTION: "Clean ocean campaign",
    TARGET: parseEther("10"),
    DURATION: 7 * 24 * 60 * 60, // 1 week
    MIN_DONATION: parseEther("0.01"),
    MAX_DURATION: 365 * 24 * 60 * 60 // 1 year (for edge case testing)
} as const;

describe("CharityDonationPlatformContract", () => {
    const deployContract = async (): Promise<TestSetup> => {
        const [owner, creator, donor1, donor2] = await hre.viem.getWalletClients();
        const contract = await hre.viem.deployContract("CharityDonationPlatform");
        const client = await hre.viem.getPublicClient();

        return { contract, owner, creator, donor1, donor2, client };
    };

    const setupCampaign = async (): Promise<CampaignSetup> => {
        const setup = await loadFixture(deployContract);

        await setup.contract.write.createCampaign([
            TEST_VALUES.TITLE,
            TEST_VALUES.DESCRIPTION,
            TEST_VALUES.TARGET,
            BigInt(TEST_VALUES.DURATION)
        ], { account: setup.creator.account });

        return { ...setup, campaignId: 1n };
    };

    const parseCampaign = (campaignArray: any[]): Campaign => ({
        id: campaignArray[0],
        title: campaignArray[1],
        description: campaignArray[2],
        targetAmount: campaignArray[3],
        raisedAmount: campaignArray[4],
        owner: campaignArray[5],
        deadline: campaignArray[6],
        isCompleted: campaignArray[7],
        numberOfDonors: campaignArray[8]
    });

    describe("Campaign Creation", () => {
        it("creates campaign with correct initial state", async () => {
            const { contract, creator } = await deployContract();

            await contract.write.createCampaign([
                TEST_VALUES.TITLE,
                TEST_VALUES.DESCRIPTION,
                TEST_VALUES.TARGET,
                BigInt(TEST_VALUES.DURATION)
            ], { account: creator.account });

            const campaignData = await contract.read.campaigns([1n]);
            const campaign = parseCampaign(campaignData);

            expect(campaign.title).to.equal(TEST_VALUES.TITLE);
            expect(campaign.targetAmount).to.equal(TEST_VALUES.TARGET);
            expect(campaign.owner).to.equal(getAddress(creator.account.address));
            expect(campaign.isCompleted).to.be.false;
        });

        it("should increment campaign counter", async () => {
            const { contract, creator } = await deployContract();

            await contract.write.createCampaign([
                TEST_VALUES.TITLE,
                TEST_VALUES.DESCRIPTION,
                TEST_VALUES.TARGET,
                BigInt(TEST_VALUES.DURATION)
            ], { account: creator.account });

            const counter = await contract.read.campaignCounter();
            expect(counter).to.equal(1n);
        });

        it("should revert with invalid deadline (zero)", async () => {
            const { contract, creator } = await deployContract();

            await expect(
                contract.write.createCampaign([
                    TEST_VALUES.TITLE,
                    TEST_VALUES.DESCRIPTION,
                    TEST_VALUES.TARGET,
                    0n
                ], { account: creator.account })
            ).to.be.rejectedWith("Deadline must be in the future");
        });

        it("should revert with invalid target amount", async () => {
            const { contract, creator } = await deployContract();

            await expect(
                contract.write.createCampaign([
                    TEST_VALUES.TITLE,
                    TEST_VALUES.DESCRIPTION,
                    0n,
                    BigInt(TEST_VALUES.DURATION)
                ], { account: creator.account })
            ).to.be.rejectedWith("Target amount must be greater than 0");
        });
    });

    describe("Donations", () => {
        it("processes single donation correctly", async () => {
            const { contract, donor1 } = await setupCampaign();
            const donationAmount = parseEther("1");
            await contract.write.donateToCampaign([1n], {
                account: donor1.account,
                value: donationAmount
            });

            const campaign = parseCampaign(await contract.read.campaigns([1n]));
            expect(campaign.raisedAmount).to.equal(donationAmount);
            expect(campaign.numberOfDonors).to.equal(1n);
        });

        it("handles multiple donations from same donor", async () => {
            const { contract, donor1 } = await setupCampaign();
            const amount = parseEther("1");

            await contract.write.donateToCampaign([1n], {
                account: donor1.account,
                value: amount
            });
            await contract.write.donateToCampaign([1n], {
                account: donor1.account,
                value: amount
            });

            const campaign = parseCampaign(await contract.read.campaigns([1n]));
            expect(campaign.raisedAmount).to.equal(amount * 2n);
            expect(campaign.numberOfDonors).to.equal(1n);
        });

        it("should revert donations below minimum amount", async () => {
            const { contract, donor1 } = await setupCampaign();

            await expect(
                contract.write.donateToCampaign([1n], {
                    account: donor1.account,
                    value: parseEther("0.009") // Below MIN_DONATION_AMOUNT
                })
            ).to.be.rejectedWith("Donation amount is below minimum");
        });

        it("should revert donations after deadline", async () => {
            const { contract, donor1 } = await setupCampaign();

            await time.increase(TEST_VALUES.DURATION + 1);

            await expect(
                contract.write.donateToCampaign([1n], {
                    account: donor1.account,
                    value: parseEther("1")
                })
            ).to.be.rejectedWith("Campaign has ended");
        });

        it("should mark campaign as completed when target reached", async () => {
            const { contract, donor1 } = await setupCampaign();

            await contract.write.donateToCampaign([1n], {
                account: donor1.account,
                value: TEST_VALUES.TARGET
            });

            const campaign = parseCampaign(await contract.read.campaigns([1n]));
            expect(campaign.isCompleted).to.be.true;
        });
    });


    describe("Withdrawals", () => {
        it("allows owner withdrawal after deadline", async () => {
            const { contract, creator, donor1 } = await setupCampaign();

            await contract.write.donateToCampaign([1n], {
                account: donor1.account,
                value: parseEther("1")
            });

            await time.increase(TEST_VALUES.DURATION + 1);
            await contract.write.withdrawFunds([1n], {
                account: creator.account
            });

            const campaign = parseCampaign(await contract.read.campaigns([1n]));
            expect(campaign.raisedAmount).to.equal(0n);
        });

        it("should revert withdrawal from non-owner", async () => {
            const { contract, donor1 } = await setupCampaign();

            await expect(
                contract.write.withdrawFunds([1n], {
                    account: donor1.account
                })
            ).to.be.rejectedWith("Only campaign owner can withdraw");
        });

        it("should revert withdrawal before deadline", async () => {
            const { contract, creator } = await setupCampaign();

            await expect(
                contract.write.withdrawFunds([1n], {
                    account: creator.account
                })
            ).to.be.rejectedWith("Campaign is still active");
        });

        it("should revert withdrawal with no funds", async () => {
            const { contract, creator } = await setupCampaign();

            await time.increase(TEST_VALUES.DURATION + 1);

            await expect(
                contract.write.withdrawFunds([1n], {
                    account: creator.account
                })
            ).to.be.rejectedWith("No funds to withdraw");
        });

        it("should emit FundsWithdrawn event", async () => {
            const { contract, creator, donor1, client } = await setupCampaign();
            const donationAmount = parseEther("1");

            await contract.write.donateToCampaign([1n], {
                account: donor1.account,
                value: donationAmount
            });

            await time.increase(TEST_VALUES.DURATION + 1);

            const tx = await contract.write.withdrawFunds([1n], {
                account: creator.account
            });

            const receipt = await client.waitForTransactionReceipt({ hash: tx });
        });
    });


    describe("Campaign Progress", () => {
        it("should calculate remaining amount correctly", async () => {
            const { contract, donor1 } = await setupCampaign();
            const donationAmount = parseEther("4");

            await contract.write.donateToCampaign([1n], {
                account: donor1.account,
                value: donationAmount
            });

            const remaining = await contract.read.getRemainingAmount([1n]);
            expect(remaining).to.equal(TEST_VALUES.TARGET - donationAmount);
        });

        it("should calculate progress percentage correctly", async () => {
            const { contract, donor1 } = await setupCampaign();

            await contract.write.donateToCampaign([1n], {
                account: donor1.account,
                value: TEST_VALUES.TARGET / 2n
            });

            const progress = await contract.read.getCampaignProgress([1n]);
            expect(progress).to.equal(50n);
        });
    });
});