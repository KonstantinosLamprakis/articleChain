document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('indexArticle');
        const articles = await response.json();
        const articleContainer = document.getElementById('article-container');
        articles.forEach(article => {
            const { headline, image, short_text } = article; // Ensure `id` or unique identifier is available in the article object
            const articleElement = document.createElement('div');
            articleElement.classList.add('col');
            articleElement.innerHTML = `
				<a href="/article?id=0" class="text-decoration-none text-dark">
                    <div class="col-md-6 col-lg-6">
                        <div class="card border-0"><a href="#"><img class="card-img-top scale-on-hover" src="${image}"></a>
                            <div class="card-body">
                                <h3><a href="#">${headline}</a></h3>
                                <p class="text-muted card-text">${short_text}</p>
                            </div>
                        </div>
                    </div>
				</a>
			`;
            articleContainer.appendChild(articleElement);
        });
    } catch (error) {
        console.error('Error fetching articles:', error);
    }
});
