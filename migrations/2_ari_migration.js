const AriSystem = artifacts.require("ARIContract");

module.exports = function(deployer) {
  deployer.deploy(AriSystem);
};