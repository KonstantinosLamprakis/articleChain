import { evaluateArticle } from "../contract/write_data.js";

document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("journalist-verification");
    const approveButton = document.getElementById("approve");
    const rejectButton = document.getElementById("reject");
    const approveLabel = document.querySelector("label[for='approve']");
    const rejectLabel = document.querySelector("label[for='reject']");
    
    approveButton.addEventListener("change", function() {
        if (approveButton.checked) {
            approveLabel.classList.add("btn-success", "text-white");
            approveLabel.classList.remove("btn-outline-success", "text-success");
            rejectLabel.classList.add("btn-outline-danger", "text-danger");
            rejectLabel.classList.remove("btn-danger", "text-white");
        }
    });

    rejectButton.addEventListener("change", function() {
        if (rejectButton.checked) {
            rejectLabel.classList.add("btn-danger", "text-white");
            rejectLabel.classList.remove("btn-outline-danger", "text-danger");
            approveLabel.classList.add("btn-outline-success", "text-success");
            approveLabel.classList.remove("btn-success", "text-white");
        }
    });

    form.addEventListener("submit", async function(event) {
        event.preventDefault();
        const comments = document.getElementById("comments").value.trim();
        if (!approveButton.checked && !rejectButton.checked) {
            alert("Please select either Approve or Reject.");
            return;
        }
        if (comments === "") {
            alert("Please enter your comments.");
            return;
        }
        console.log(document.getElementById("article_id").value);
        console.log(approveButton.checked);
        console.log(comments);
        const is_eval = await evaluateArticle(document.getElementById("article_id").value, approveButton.checked, comments);
        if (is_eval){
            window.location.href = '/success?data=' + encodeURIComponent('Evaluation successful!');
            console.log("yes");
        }
        else{
            window.location.href = '/failure?data=' + encodeURIComponent('Evaluation failed. Make sure you are loged in, authorised journalist!');
            console.log("no");
        }
    });
});
