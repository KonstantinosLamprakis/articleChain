const ArticleContract = artifacts.require("ArticleContract");

module.exports = function (deployer) {
  deployer.deploy(ArticleContract);
};