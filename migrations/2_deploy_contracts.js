const NewContract = artifacts.require("./NewContract.sol");
const SocialNetwork = artifacts.require("./SocialNetwork.sol")

module.exports = function(deployer) {
  deployer.deploy(NewContract);
  deployer.deploy(SocialNetwork);
};
