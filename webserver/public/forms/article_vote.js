import { voteArticle } from "../contract/write_data.js";
import { getArticle } from "../contract/read_data.js";

document.addEventListener('DOMContentLoaded', async function () {
    const agreeButton = document.getElementById('agree');
    const disagreeButton = document.getElementById('disagree');

    const article = await getArticle(document.getElementById("article_id").value);
    document.getElementById('upscore').textContent = article.upvotes;
    document.getElementById('downscore').textContent = article.downvotes;  

    agreeButton.addEventListener('click', async function () {
        await sendVote(1);
    });

    disagreeButton.addEventListener('click', async function () {
        await sendVote(0);
    });

    async function sendVote(vote){
        console.log(vote);
        const is_vote = await voteArticle(document.getElementById("article_id").value, vote);
        if (is_vote){
            if (vote){
                document.getElementById('upscore').textContent = parseInt(document.getElementById('upscore').textContent) + 1;
            }
            else{
                document.getElementById('downscore').textContent = parseInt(document.getElementById('downscore').textContent) + 1;
            }
            console.log("yes");
        }
        else{
            window.location.href = '/failure?data=' + encodeURIComponent('Vote failed. Make sure you are loged in, authorised journalist!');
            console.log("no");
        }
    }
});