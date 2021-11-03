const { expect } = require('chai')
const { ethers } = require('hardhat')

describe('TokenPaymentSplitter Tests', () => {
    let deployer
    let account1
    let account2
    let account3
    let account4
    let testPaymentToken
    let nft

    beforeEach(async () => {
        [deployer, account1, account2, account3, account4] = await ethers.getSigners()

        const TestPaymentToken = await ethers.getContractFactory('ERC20PresetMinterPauser')
        testPaymentToken = await TestPaymentToken.deploy('TestPaymentToken', 'TPT')
        await testPaymentToken.deployed()

    })

    describe('Add payees with varying amounts and distribute payments', async () => {

        it('payment token is distributed evenly to multiple payees', async () => {

            payeeAddressArray = [account1.address, account2.address, account3.address, account4.address]
            payeeShareArray = [10, 10, 10, 10]

            const NFT = await ethers.getContractFactory('NFT')
            nft = await NFT.deploy(
                payeeAddressArray,
                payeeShareArray,
                testPaymentToken.address
            )
            await nft.deployed()

            await testPaymentToken.mint(nft.address, 100000)

            await nft
                .connect(account1)
                .release(account1.address)

            await nft
                .connect(account2)
                .release(account2.address)

            await nft
                .connect(account3)
                .release(account3.address)

            await nft
                .connect(account4)
                .release(account4.address)

            const account1TokenBalance = await testPaymentToken.balanceOf(account1.address)
            const account2TokenBalance = await testPaymentToken.balanceOf(account2.address)
            const account3TokenBalance = await testPaymentToken.balanceOf(account3.address)
            const account4TokenBalance = await testPaymentToken.balanceOf(account4.address)

            expect(account1TokenBalance).to.equal(25000)
            expect(account2TokenBalance).to.equal(25000)
            expect(account3TokenBalance).to.equal(25000)
            expect(account4TokenBalance).to.equal(25000)
        })

        it('payment token is distributed unevenly to multiple payees', async () => {

            payeeAddressArray = [account1.address, account2.address, account3.address, account4.address]
            payeeShareArray = [10, 5, 11, 7]

            const NFT = await ethers.getContractFactory('NFT')
            nft = await NFT.deploy(
                payeeAddressArray,
                payeeShareArray,
                testPaymentToken.address
            )
            await nft.deployed()

            await testPaymentToken.mint(nft.address, 100000)

            await nft
                .connect(account1)
                .release(account1.address)

            await nft
                .connect(account2)
                .release(account2.address)

            await nft
                .connect(account3)
                .release(account3.address)

            await nft
                .connect(account4)
                .release(account4.address)

            const nftTestPaymentTokenBalance = await testPaymentToken.balanceOf(
                nft.address
            )

            const account1TokenBalance = await testPaymentToken.balanceOf(account1.address)
            const account2TokenBalance = await testPaymentToken.balanceOf(account2.address)
            const account3TokenBalance = await testPaymentToken.balanceOf(account3.address)
            const account4TokenBalance = await testPaymentToken.balanceOf(account4.address)

            expect(nftTestPaymentTokenBalance).to.equal(1)
            expect(account1TokenBalance).to.equal(30303)
            expect(account2TokenBalance).to.equal(15151)
            expect(account3TokenBalance).to.equal(33333)
            expect(account4TokenBalance).to.equal(21212)
        })

        it('payment token is distributed unevenly to multiple payees with additional payment token sent to pool', async () => {

            payeeAddressArray = [account1.address, account2.address, account3.address, account4.address]
            payeeShareArray = [10, 5, 11, 7]

            const NFT = await ethers.getContractFactory('NFT')
            nft = await NFT.deploy(
                payeeAddressArray,
                payeeShareArray,
                testPaymentToken.address
            )
            await nft.deployed()

            await testPaymentToken.mint(nft.address, 100000)

            await nft
                .connect(account1)
                .release(account1.address)

            await nft
                .connect(account2)
                .release(account2.address)

            await testPaymentToken.mint(nft.address, 100000)

            await nft
                .connect(account3)
                .release(account3.address)

            await nft
                .connect(account4)
                .release(account4.address)

            await nft
                .connect(account1)
                .release(account1.address)

            await nft
                .connect(account2)
                .release(account2.address)

            const nftTestPaymentTokenBalance = await testPaymentToken.balanceOf(
                nft.address
            )

            const account1TokenBalance = await testPaymentToken.balanceOf(account1.address)
            const account2TokenBalance = await testPaymentToken.balanceOf(account2.address)
            const account3TokenBalance = await testPaymentToken.balanceOf(account3.address)
            const account4TokenBalance = await testPaymentToken.balanceOf(account4.address)

            expect(nftTestPaymentTokenBalance).to.equal(1)
            expect(account1TokenBalance).to.equal(60606)
            expect(account2TokenBalance).to.equal(30303)
            expect(account3TokenBalance).to.equal(66666)
            expect(account4TokenBalance).to.equal(42424)
        })

    })
})