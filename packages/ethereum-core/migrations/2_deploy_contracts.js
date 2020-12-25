var DataManagement = artifacts.require("./DataManagement.sol");

module.exports = function(deployer) {
  deployer.deploy(DataManagement);
};