import { generateHumanCheck } from "./humancheck.js";
import { createArticle } from "../contract/write_data.js";

document.addEventListener("DOMContentLoaded", function () {
  const quill = new Quill("#editor", {
    theme: "snow",
    modules: {
      toolbar: [
        [{ header: [1, 2, false] }],
        ["bold", "italic", "underline"],
        ["image", "code-block"],
      ],
    },
  });

  const form = document.getElementById("submit-article");
  const contentInput = document.getElementById("content");
  const waitingIcon = document.getElementById("waiting-icon");
  const submitButton = form.querySelector('button[type="submit"]');

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    contentInput.value = quill.root.innerHTML;

    waitingIcon.style.display = 'block';
    submitButton.disabled = true;

    const formData = new FormData(form);

    try {
      const response = await fetch('/submit-article', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.cid) {
		    console.log(`Using cid: ${data.cid}`);
        const res = await createArticle(data.cid);
        if (res){
          window.location.href = '/success?data=' + encodeURIComponent('Article created successfully!');
        }
        else {
          window.location.href = '/failure?data=' + encodeURIComponent('Error occured during article submission.');
        }
      } else {
        window.location.href = '/failure?data=' + encodeURIComponent(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      window.location.href = '/failure?data=' + encodeURIComponent(data.message);
    } finally {
      waitingIcon.style.display = 'none';
      submitButton.disabled = false;
    }
  });

  generateHumanCheck();
});
