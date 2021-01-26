const NewContract = artifacts.require("./NewContract.sol");

module.exports = function(deployer) {
  deployer.deploy(NewContract);
};
