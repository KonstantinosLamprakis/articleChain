// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EthArticleBlockchain {
    struct Voter {
        bool	hasVoted;
        bool 	vote;
        address	userWalletId;
    }

    struct Evaluator {
        bool	hasEvaluated;
        bool	evaluationValue;
        address	userWalletId;
        string	comments;
    }

    struct Article {
        uint	id;
        string	filecoinCID;
        address	journalistId;
        uint	timeStamp;
        int		upvotes;
        int		downvotes;
        int		reviewScore;
        uint	reviewNumber;
        bool	isPublished;
        bool	isEvaluated;
        mapping(address => Voter) voters;
        mapping(address => Evaluator) reviewers;
        address[] reviewersAddresses;
    }

	struct All_articles {
		uint	id;
		string	filecoinCID;
		bool	isPublished;
		bool	isEvaluated;
	}

	mapping(uint => All_articles) public allArticles;

    address[5] public admins = [
        address(0xE72234a7A2289ad7B1C1c16004668e3E2D3F876d),
        address(0x76776371ac9aB86C55E1106FBe04576C92a0070E),
        address(0x7eb5c634A059C2FaA7A39ADFaADce749A045686D),
        address(0xC2FA1b00AB2d3Fd715EfC401fd4da35ba96Da7A2),
        address(0x22a26ABad444aB23fdd84a323d3121442860a7F7)
    ];

    uint public articleCount;
    uint public targetScore = 300;
    int private constant ownerInfluence = 5;
    int private constant reviewerInfluence = 2;

    mapping(uint256 => Article) public articles;
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

        Article storage newArticle = articles[articleCount];
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

        allArticles[articleCount] = All_articles({
            id: articleCount,
            filecoinCID: _filecoinCID,
            isPublished: false,
            isEvaluated: false
        });

        emit ArticleCreated(articleCount, _filecoinCID, msg.sender);
    }

    function evaluateArticle(uint articleId, bool approve, string memory comment) public onlyJournalist notOwner(articleId) {
        require(!articles[articleId].reviewers[msg.sender].hasEvaluated, "You have already reviewed");
        require(!articles[articleId].isEvaluated, "Article already evaluated");

        articles[articleId].reviewers[msg.sender] = Evaluator({
            hasEvaluated: true,
            evaluationValue: approve,
            userWalletId: msg.sender,
            comments: comment
        });

        articles[articleId].reviewersAddresses.push(msg.sender);
        articles[articleId].reviewNumber += 1;

        if (approve) {
            articles[articleId].reviewScore += int(credibilityScores[msg.sender]);
            if (articles[articleId].reviewScore >= int(targetScore)) {
                articles[articleId].isEvaluated = true;
                allArticles[articleId].isEvaluated = true;
                deployArticle(articleId);
            }
        } else {
            articles[articleId].isEvaluated = true;
            allArticles[articleId].isEvaluated = true;
            denyArticle(articleId);
        }

        emit ReviewCasted(articleId, msg.sender, approve);
    }

    function voteArticle(uint articleId, bool vote) public onlyJournalist notOwner(articleId) {
        require(!articles[articleId].voters[msg.sender].hasVoted, "You have already voted");
        require(!articles[articleId].reviewers[msg.sender].hasEvaluated, "Reviewers cannot vote");
        require(articles[articleId].isPublished, "Article not yet evaluated or is rejected");

        articles[articleId].voters[msg.sender] = Voter({
            hasVoted: true,
            vote: vote,
            userWalletId: msg.sender
        });

        if (vote) {
            articles[articleId].upvotes += 1;
            updateCredibility(articleId, ownerInfluence, reviewerInfluence);
        } else {
            articles[articleId].downvotes += 1;
            updateCredibility(articleId, -ownerInfluence, -reviewerInfluence);
        }

        emit VoteCasted(articleId, msg.sender, vote);
    }

    function deployArticle(uint articleId) internal {
        articles[articleId].isPublished = true;
        allArticles[articleId].isPublished = true;
        emit ArticleDeployed(articleId, articles[articleId].reviewScore);
    }

    function denyArticle(uint articleId) internal {
        string memory comments = gatherComments(articleId);
        emit ArticleDenied(articleId, articles[articleId].reviewScore, comments);
    }

    function gatherComments(uint articleId) internal view returns (string memory) {
        string memory allComments = "";
        Article storage article = articles[articleId];
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
        int reviewNumber,
        int upvotes,
        int downvotes,
        bool isEvaluated,
        bool isPublished
    ) {
        require(articleId > 0 && articleId <= articleCount, "Invalid article ID");
        Article storage article = articles[articleId];
        
        // Create a memory copy of the filecoinCID
        string memory filecoinCIDMemory = article.filecoinCID;

        return (
            article.id, 
            filecoinCIDMemory, 
            article.journalistId, 
            article.timeStamp, 
            article.reviewScore, 
            int(article.reviewNumber), 
            article.upvotes, 
            article.downvotes,
            article.isEvaluated,
            article.isPublished
        );
    }

    function updateCredibility(uint articleId, int ownerInfluenceValue, int reviewerInfluenceValue) internal {
        Article storage article = articles[articleId];
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

    function getAllArticles() public view returns (All_articles[] memory) {
        All_articles[] memory allArticlesArray = new All_articles[](articleCount);
        for (uint i = 1; i <= articleCount; i++) {
            allArticlesArray[i - 1] = allArticles[i];
        }
        return allArticlesArray;
    }
}
