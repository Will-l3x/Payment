const { expect } = require('chai')
const { ethers } = require('hardhat')

describe('TokenPaymentSplitter Tests', () => {
    let deployer
    let treasury
    let RUBY
    let BNFT
    
    let testPaymentToken
    let nft

    beforeEach(async () => {
        [deployer, treasury, RUBY, BNFT] = await ethers.getSigners()

        const TestPaymentToken = await ethers.getContractFactory('ERC20PresetMinterPauser')
        testPaymentToken = await TestPaymentToken.deploy('TestPaymentToken', 'TPT')
        await testPaymentToken.deployed()

    })

    describe('Add payees with varying amounts and distribute payments', async () => {

        it('payment token is distributed evenly to multiple payees', async () => {

            payeeAddressArray = [treasury.address, RUBY.address, BNFT.address]
            payeeShareArray = [10, 10, 10]

            const NFT = await ethers.getContractFactory('NFT')
            nft = await NFT.deploy(
                payeeAddressArray,
                payeeShareArray,
                testPaymentToken.address
            )
            await nft.deployed()

            await testPaymentToken.mint(nft.address, 100000)

            await nft
                .connect(treasury)
                .release(treasury.address)

            await nft
                .connect(RUBY)
                .release(RUBY.address)

            await nft
                .connect(BNFT)
                .release(BNFT.address)

            

            const treasuryTokenBalance = await testPaymentToken.balanceOf(treasury.address)
            const RUBYTokenBalance = await testPaymentToken.balanceOf(RUBY.address)
            const BNFTTokenBalance = await testPaymentToken.balanceOf(BNFT.address)
           

            expect(treasuryTokenBalance).to.equal(33333)
            expect(RUBYTokenBalance).to.equal(33333)
            expect(BNFTTokenBalance).to.equal(33333)
            
        })

        it('payment token is distributed unevenly to multiple payees', async () => {

            payeeAddressArray = [treasury.address, RUBY.address, BNFT.address]
            payeeShareArray = [10, 5, 11 ]

            const NFT = await ethers.getContractFactory('NFT')
            nft = await NFT.deploy(
                payeeAddressArray,
                payeeShareArray,
                testPaymentToken.address
            )
            await nft.deployed()

            await testPaymentToken.mint(nft.address, 100000)

            await nft
                .connect(treasury)
                .release(treasury.address)

            await nft
                .connect(RUBY)
                .release(RUBY.address)

            await nft
                .connect(BNFT)
                .release(BNFT.address)

            

            const nftTestPaymentTokenBalance = await testPaymentToken.balanceOf(
                nft.address
            )

            const treasuryTokenBalance = await testPaymentToken.balanceOf(treasury.address)
            const RUBYTokenBalance = await testPaymentToken.balanceOf(RUBY.address)
            const BNFTTokenBalance = await testPaymentToken.balanceOf(BNFT.address)
            

            expect(nftTestPaymentTokenBalance).to.equal(2)
            expect(treasuryTokenBalance).to.equal(38461)
            expect(RUBYTokenBalance).to.equal(19230)
            expect(BNFTTokenBalance).to.equal(42307)
            
        })

        it('payment token is distributed unevenly to multiple payees with additional payment token sent to be burned ', async () => {

            payeeAddressArray = [treasury.address, RUBY.address, BNFT.address]
            payeeShareArray = [5, 5, 90,]

            const NFT = await ethers.getContractFactory('NFT')
            nft = await NFT.deploy(
                payeeAddressArray,
                payeeShareArray,
                testPaymentToken.address
            )
            await nft.deployed()

            await testPaymentToken.mint(nft.address, 100000)

            await nft
                .connect(treasury)
                .release(treasury.address)

            await nft
                .connect(RUBY)
                .release(RUBY.address)

            await testPaymentToken.mint(nft.address, 100000)

            await nft
                .connect(BNFT)
                .release(BNFT.address)

            

            await nft
                .connect(treasury)
                .release(treasury.address)

            await nft
                .connect(RUBY)
                .release(RUBY.address)

            const nftTestPaymentTokenBalance = await testPaymentToken.balanceOf(
                nft.address
            )

            const treasuryTokenBalance = await testPaymentToken.balanceOf(treasury.address)
            const RUBYTokenBalance = await testPaymentToken.balanceOf(RUBY.address)
            const BNFTTokenBalance = await testPaymentToken.balanceOf(BNFT.address)
            

            expect(nftTestPaymentTokenBalance).to.equal(0)
            expect(treasuryTokenBalance).to.equal(10000)
            expect(RUBYTokenBalance).to.equal(10000)
            expect(BNFTTokenBalance).to.equal(180000)
            
        })

    })
})