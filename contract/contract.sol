// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EthArticleBlockchain {
    struct Voter {
        bool hasVoted;
        bool vote;
        address userWalletId;
    }

    struct Evaluator {
        bool hasEvaluated;
        bool evaluationValue;
        address userWalletId;
    }

    struct Article {
        uint id;
        string filecoinCID;
        address journalistId;
        uint timeStamp;
        int upvotes;
        int downvotes;
        int reviewScore;
        int reviewNumber;
        bool isDeployed;
        bool isEvaluated;
    }

    address[5] public admins;
    uint public articleCount;

    mapping(uint256 => Article) public articles;
    mapping(address => bool) public journalistGroup;

    event JournalistAdded(address journalist);
    event JournalistDeactivated(address journalist);
    event ArticleMade(uint articleId, string filecoinCID, address journalist);
    event ArticleEvaluated(uint articleId, address evaluator, bool approved);
    event ArticleVoted(uint articleId, address voter, bool vote);
    event ArticleDeployed(uint articleId);
    event ArticleFailed(uint articleId);
    event ArticleFetched(uint articleId, address requester);

    modifier notOwner(uint256 articleId) {
        require(msg.sender != articles[articleId].journalistId, "Owner cannot vote");
        _;
    }

    modifier onlyJournalist() {
        require(journalistGroup[msg.sender], "Only journalists can vote");
        _;
    }

    modifier onlyAdmin() {
        require(isAdmin(msg.sender), "Only admins can perform this action");
        _;
    }

    function isAdmin(address user) public view returns (bool) {
        for (uint i = 0; i < admins.length; i++) {
            if (admins[i] == user) {
                return true;
            }
        }
        return false;
    }

    function addJournalistToPool(address journalist) public onlyAdmin {
        require(journalist != address(0), "Invalid address");
        require(!journalistGroup[journalist], "Journalist already added");
        journalistGroup[journalist] = true;
        emit JournalistAdded(journalist);
    }

    function deactivateJournalist(address journalist) public onlyAdmin {
        require(journalistGroup[journalist], "Journalist not found");
        journalistGroup[journalist] = false;
        emit JournalistDeactivated(journalist);
    }

    function makeArticle(string memory _filecoinCID) external onlyJournalist {
        articleCount++;

        Article storage newArticle = articles[articleCount];
        newArticle.id = articleCount;
        newArticle.filecoinCID = _filecoinCID;
        newArticle.journalistId = msg.sender;
        newArticle.timeStamp = block.timestamp;
        newArticle.reviewNumber = 0;
        newArticle.upvotes = 0;
        newArticle.downvotes = 0;
        newArticle.isEvaluated = false;
        newArticle.isDeployed = false;

        emit ArticleMade(articleCount, _filecoinCID, msg.sender);
    }

    function evaluateArticle(uint articleId, bool approve) public onlyJournalist notOwner(articleId) {
        require(!articles[articleId].isEvaluated, "Article already evaluated");

        articles[articleId].reviewNumber += 1;

        if (approve) {
            articles[articleId].reviewScore += 1;
            if (articles[articleId].reviewScore >= 1) { 
                articles[articleId].isEvaluated = true;
                deployArticle(articleId);
            }
        } else {
            articles[articleId].reviewScore -= 1;
            articles[articleId].isEvaluated = true;
            denyArticle(articleId);
        }

        emit ArticleEvaluated(articleId, msg.sender, approve);
    }

    function deployArticle(uint articleId) internal {
        articles[articleId].isDeployed = true;
        emit ArticleDeployed(articleId);
    }

    function denyArticle(uint articleId) internal {
        articles[articleId].isDeployed = false;
        emit ArticleFailed(articleId);
    }
}
