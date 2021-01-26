const { assert } = require('chai')
const { default: Web3 } = require('web3')

const SocialNetwork = artifacts.require("./SocialNetwork.sol")

require('chai').use(require('chai-as-promised')).should()

contract('SocialNetwork', ([deployer, author, tipper]) => {
    let socialNetwork 
    before(async () => {
        socialNetwork = await SocialNetwork.deployed()
    })
    describe('deployment', async () => {
        it('deploys Sucessfully', async () => {
            const address = await socialNetwork.address
            assert.notEqual(address, 0x0)
            assert.notEqual(address, null)
            assert.notEqual(address, '')
            assert.notEqual(address, undefined)
        }) 

        it('has a name', async () => {
            const name = await socialNetwork.name()
            assert.equal(name, 'Nrupali')
        })
    })

    describe('posts', async () => {
        let result , postCount
        before(async () => {
            result = await socialNetwork.createPost('This is my first post', { from: author })
            postCount = await socialNetwork.postCount()
        })
        it('creates posts', async () => {
            assert.equal(postCount, 1)
            const event = result.logs[0].args
            assert.equal(event.id.toNumber(), postCount.toNumber(), 'id is correct')
            assert.equal(event.content, 'This is my first post', 'content is correct')
            assert.equal(event.tipAmount, 0, 'tip amount is correct')
            assert.equal(event.author, author, 'author is correct')

            await socialNetwork.createPost('', { from: author }).should.be.rejected;
        })
        it('Lists posts', async () => {
            const post = await socialNetwork.posts(postCount)
            assert.equal(post.id.toNumber(), postCount.toNumber(), 'id is correct')
            assert.equal(post.content, 'This is my first post', 'content is correct')
            assert.equal(post.tipAmount, '0', 'tip amount is correct')
            assert.equal(post.author, author, 'author is correct')
        })
        it('allow users to tip posts', async () => {
            // success
            let oldAuthorBalance
            oldAuthorBalance = await web3.eth.getBalance(author)
            oldAuthorBalance = new web3.utils.BN(oldAuthorBalance)
            result = await socialNetwork.tipPost(postCount, { from: tipper , value: web3.utils.toWei('1', 'Ether') })
            const event = result.logs[0].args
            assert.equal(event.id.toNumber(), postCount.toNumber(), 'id is correct')
            assert.equal(event.content, 'This is my first post', 'content is correct')
            assert.equal(event.tipAmount, web3.utils.toWei('1', 'Ether'), 'tip amount is correct')
            assert.equal(event.author, author, 'author is correct')

            let newAuthorBalance
            newAuthorBalance = await web3.eth.getBalance(author)
            newAuthorBalance = new web3.utils.BN(newAuthorBalance)

            let tipAmount
            tipAmount = web3.utils.toWei('1', 'Ether')
            tipAmount = new web3.utils.BN(tipAmount)

            const expectedBal = oldAuthorBalance.add(tipAmount)

            assert.equal(expectedBal.toString(), newAuthorBalance.toString())

            // Fail try to tip a post that doesnot exist
            await socialNetwork.tipPost(90, { from: tipper , value: web3.utils.toWei('1', 'Ether')}).should.be.rejected;
        })
    })
})