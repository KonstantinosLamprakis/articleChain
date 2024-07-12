document.addEventListener("DOMContentLoaded", function () {
  var quill = new Quill("#editor", {
    theme: "snow",
    modules: {
      toolbar: [
        [{ header: [1, 2, false] }],
        ["bold", "italic", "underline"],
        ["image", "code-block"],
      ],
    },
  });

  document
    .getElementById("submit-form")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      var content = quill.root.innerHTML;
      document.getElementById("content").value = content;
      this.submit(); // Submit the form
    });
});
