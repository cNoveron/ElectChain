var Migrations = artifacts.require("./Migrations.sol");

module.exports = function(deployer) {
  console.log("1_initial_migration.js")
  deployer.deploy(Migrations);
};