// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract etharticleblockchain {

    structure voter {
        boolean     has_voted;
        boolean     vote;
        address     wallet_id;
    }

    structure evaluator {
        boolean     has_evaluated;
        boolean     evaluation_value;
        address     wallet_id;

    }


    structure article {
        uint        article_id;
        string      filecoinCID;
        address     owner_id;
        uint        time_stamp;
        int         upvote;
        int         downvote;
        int         review_score;
        int         review_number;
        boolean     is_deployed;
        boolean     is_evaluated;
    }

}