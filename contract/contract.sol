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
        string comments;
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
        mapping(address => Voter) voters;
        mapping(address => Evaluator) reviewers;
    }

    address[5] public admins;
    uint public articleCount;
    uint public targetScore = 1; // Assumed target score for evaluation

    mapping(uint256 => Article) public articles;
    mapping(address => bool) public journalistGroup;

    event JournalistAdded(address journalist);
    event JournalistDeactivated(address journalist);
    event ArticleMade(uint articleId, string filecoinCID, address journalist);
    event ArticleEvaluated(uint articleId, address evaluator, bool approved);
    event ArticleVoted(uint articleId, address voter, bool vote);
    event ArticleDeployed(uint articleId);
    event ArticleFailed(uint articleId);

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
        require(!articles[articleId].reviewers[msg.sender].hasEvaluated, "You have already reviewed");
        require(!articles[articleId].isEvaluated, "Article already evaluated");

        articles[articleId].reviewers[msg.sender] = Evaluator({
            hasEvaluated: true,
            evaluationValue: approve,
            userWalletId: msg.sender,
            comments: ""
        });

        articles[articleId].reviewNumber += 1;

        if (approve) {
            articles[articleId].reviewScore += 1;
            if (articles[articleId].reviewScore >= targetScore) { 
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

    function voteArticle(uint articleId, bool vote) public onlyJournalist notOwner(articleId) {
        require(!articles[articleId].voters[msg.sender].hasVoted, "You have already voted");
        require(!articles[articleId].reviewers[msg.sender].hasEvaluated, "Reviewers cannot vote");
        require(articles[articleId].isDeployed, "Article not yet evaluated or is rejected");

        articles[articleId].voters[msg.sender] = Voter({
            hasVoted: true,
            vote: vote,
            userWalletId: msg.sender
        });

        if (vote) {
            articles[articleId].upvotes += 1;
        } else {
            articles[articleId].downvotes += 1;
        }

        emit ArticleVoted(articleId, msg.sender, vote);
    }

    function deployArticle(uint articleId) internal {
        articles[articleId].isDeployed = true;
        emit ArticleDeployed(articleId);
    }

    function denyArticle(uint articleId) internal {
        emit ArticleFailed(articleId);
    }

    function getArticle(uint256 articleId) public view returns (
        uint256 id, 
        string memory filecoinCID, 
        address journalistId, 
        uint256 timeStamp,
        int reviewScore,
        int reviewNumber,
        int upvotes,
        int downvotes,
        bool isEvaluated,
        bool isDeployed
    ) {
        require(articleId > 0 && articleId <= articleCount, "Invalid article ID");
        Article storage article = articles[articleId];
        return (
            article.id, 
            article.filecoinCID, 
            article.journalistId, 
            article.timeStamp, 
            article.reviewScore, 
            article.reviewNumber, 
            article.upvotes, 
            article.downvotes,
            article.isEvaluated,
            article.isDeployed
        );
    }
}
