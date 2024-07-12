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

    address[5] public owners = [

    ]

    event   journalist_added
    event   journalist_deactivated
    event   article_made
    event   article_evaluated
    event   article_voted
    event   article_deployed
    event   article_failed
    event   article_fetched

    //Functions
    function addjournalist_to_pool
    function deactivate_journalist
    function make_article
    function evaluate_article
    function vote_article
    function deploy_article
    function fail_article
    function fetch_article
}