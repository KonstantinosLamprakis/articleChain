import { fetchAndRenderArticles } from "./article.js";

document.addEventListener('DOMContentLoaded', async () => {
    await fetchAndRenderArticles('reviewArticle');
});
