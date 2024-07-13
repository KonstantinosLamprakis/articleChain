// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.0;

contract ArticleContract {
    struct Voter {
        bool    hasVoted;
        bool    vote;
        address userWalletId;
    }

    struct Evaluator {
        bool    hasEvaluated;
        bool    evaluationValue;
        address userWalletId;
        string  comments;
    }

    struct Article {
        uint    id;
        string  filecoinCID;
        address journalistId;
        uint    timeStamp;
        int     upvotes;
        int     downvotes;
        int     reviewScore;
        uint    reviewNumber;
        bool    isPublished;
        bool    isEvaluated;
        mapping(address => Voter) voters;
        mapping(address => Evaluator) reviewers;
        address[] reviewersAddresses;
    }

    struct AllArticles {
        uint    id;
        string  filecoinCID;
        bool    isPublished;
        bool    isEvaluated;
    }

    address[5] public admins = [
	address(0x9F1Ce4B3392f849fA142C0b35932b140B0F48663),
	address(0x7eb5c634A059C2FaA7A39ADFaADce749A045686D),
	address(0x1c6af370b04d2979a92DFa4614059210Af411914),
	address(0x45096426d5CEb2bC2D9e8FB73f36F91Bf5A877CB),
	address(0xE72234a7A2289ad7B1C1c16004668e3E2D3F876d)
    ];

    uint public articleCount;
    uint public targetScore = 300;
    int private constant ownerInfluence = 5;
    int private constant reviewerInfluence = 2;

    Article[] public articles;
    AllArticles[] public allArticles;

    mapping(address => bool) public journalistGroup;
    mapping(address => uint) public credibilityScores;

    event JournalistAdded(address indexed journalist);
    event JournalistDeactivated(address indexed journalist);
    event ArticleCreated(uint256 indexed articleId, string filecoinCID, address indexed journalistId);
    event ReviewCasted(uint256 indexed articleId, address indexed reviewer, bool review);
    event VoteCasted(uint256 indexed articleId, address indexed voter, bool vote);
    event ArticleDeployed(uint256 indexed articleId, int totalReviewScore);
    event ArticleDenied(uint256 indexed articleId, int totalReviewScore, string comments);

    modifier notOwner(uint256 articleId) {
        require(msg.sender != articles[articleId - 1].journalistId, "Owner cannot vote");
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

    function addJournalist(address journalist) public onlyAdmin {
        require(journalist != address(0), "Invalid address");
        require(!journalistGroup[journalist], "Journalist already added");
        journalistGroup[journalist] = true;
        credibilityScores[journalist] = 80;
        emit JournalistAdded(journalist);
    }

    function deactivateJournalist(address journalist) public onlyAdmin {
        require(journalistGroup[journalist], "Journalist not found");
        journalistGroup[journalist] = false;
        emit JournalistDeactivated(journalist);
    }

    function createArticle(string memory _filecoinCID) external onlyJournalist {
        uint credibilityOfOwner = credibilityScores[msg.sender];
        articleCount++;

        articles.push();
        Article storage newArticle = articles[articles.length - 1];
        newArticle.id = articleCount;
        newArticle.filecoinCID = _filecoinCID;
        newArticle.journalistId = msg.sender;
        newArticle.timeStamp = block.timestamp;
        newArticle.reviewScore = int(credibilityOfOwner);
        newArticle.reviewNumber = 0;
        newArticle.upvotes = 0;
        newArticle.downvotes = 0;
        newArticle.isEvaluated = false;
        newArticle.isPublished = false;

        allArticles.push(AllArticles({
            id: articleCount,
            filecoinCID: _filecoinCID,
            isPublished: false,
            isEvaluated: false
        }));

        emit ArticleCreated(articleCount, _filecoinCID, msg.sender);
    }

    function evaluateArticle(uint articleId, bool approve, string memory comment) public onlyJournalist notOwner(articleId) {
        Article storage article = articles[articleId - 1];
        require(!article.reviewers[msg.sender].hasEvaluated, "You have already reviewed");
        require(!article.isEvaluated, "Article already evaluated");

        article.reviewers[msg.sender] = Evaluator({
            hasEvaluated: true,
            evaluationValue: approve,
            userWalletId: msg.sender,
            comments: comment
        });

        article.reviewersAddresses.push(msg.sender);
        article.reviewNumber += 1;

        if (approve) {
            article.reviewScore += int(credibilityScores[msg.sender]);
            if (article.reviewScore >= int(targetScore)) {
                article.isEvaluated = true;
                allArticles[articleId - 1].isEvaluated = true;
                deployArticle(articleId);
            }
        } else {
            article.isEvaluated = true;
            allArticles[articleId - 1].isEvaluated = true;
            denyArticle(articleId);
        }

        emit ReviewCasted(articleId, msg.sender, approve);
    }

    function voteArticle(uint articleId, bool vote) public onlyJournalist notOwner(articleId) {
        Article storage article = articles[articleId - 1];
        require(!article.voters[msg.sender].hasVoted, "You have already voted");
        require(!article.reviewers[msg.sender].hasEvaluated, "Reviewers cannot vote");
        require(article.isPublished, "Article not yet evaluated or is rejected");

        article.voters[msg.sender] = Voter({
            hasVoted: true,
            vote: vote,
            userWalletId: msg.sender
        });

        if (vote) {
            article.upvotes += 1;
            updateCredibility(articleId, ownerInfluence, reviewerInfluence);
        } else {
            article.downvotes += 1;
            updateCredibility(articleId, -ownerInfluence, -reviewerInfluence);
        }

        emit VoteCasted(articleId, msg.sender, vote);
    }

    function deployArticle(uint articleId) internal {
        Article storage article = articles[articleId - 1];
        article.isPublished = true;
        allArticles[articleId - 1].isPublished = true;
        emit ArticleDeployed(articleId, article.reviewScore);
    }

    function denyArticle(uint articleId) internal {
        Article storage article = articles[articleId - 1];
        string memory comments = gatherComments(articleId);
        emit ArticleDenied(articleId, article.reviewScore, comments);
    }

    function gatherComments(uint articleId) internal view returns (string memory) {
        string memory allComments = "";
        Article storage article = articles[articleId - 1];
        for (uint i = 0; i < article.reviewNumber; i++) {
            address reviewerAddress = article.reviewersAddresses[i];
            if (article.reviewers[reviewerAddress].hasEvaluated) {
                allComments = string(abi.encodePacked(allComments, article.reviewers[reviewerAddress].comments, " "));
            }
        }
        return allComments;
    }

    function getArticle(uint256 articleId) public view returns (
        uint256 id, 
        string memory filecoinCID, 
        address journalistId, 
        uint256 timeStamp,
        int reviewScore,
        uint reviewNumber,
        int upvotes,
        int downvotes,
        bool isEvaluated,
        bool isPublished
    ) {
        require(articleId > 0 && articleId <= articleCount, "Invalid article ID");
        Article storage article = articles[articleId - 1];
        
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
            article.isPublished
        );
    }

    function updateCredibility(uint articleId, int ownerInfluenceValue, int reviewerInfluenceValue) internal {
        Article storage article = articles[articleId - 1];
        address owner = article.journalistId;
        credibilityScores[owner] = uint(int(credibilityScores[owner]) + ownerInfluenceValue);
        credibilityScores[owner] = credibilityScores[owner] > 100 ? 100 : credibilityScores[owner];
        credibilityScores[owner] = credibilityScores[owner] < 0 ? 0 : credibilityScores[owner];

        for (uint i = 0; i < article.reviewersAddresses.length; i++) {
            address reviewerAddress = article.reviewersAddresses[i];
            if (article.reviewers[reviewerAddress].hasEvaluated) {
                credibilityScores[reviewerAddress] = uint(int(credibilityScores[reviewerAddress]) + reviewerInfluenceValue);
                credibilityScores[reviewerAddress] = credibilityScores[reviewerAddress] > 100 ? 100 : credibilityScores[reviewerAddress];
                credibilityScores[reviewerAddress] = credibilityScores[reviewerAddress] < 0 ? 0 : credibilityScores[reviewerAddress];
            }
        }
    }

    function getCredibility(address journalistId) public view returns (uint) {
        require(journalistGroup[journalistId], "Journalist not found");
        return credibilityScores[journalistId];
    }

    function getAllArticles() public view returns (AllArticles[] memory) {
        return allArticles;
    }
}
