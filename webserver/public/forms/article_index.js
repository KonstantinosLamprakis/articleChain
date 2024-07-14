document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('indexArticle');
        const articles = await response.json();
        const articleContainer = document.getElementById('article-container');
        articles.forEach(article => {
            const { id, headline, image, short_text } = article;
    
            const articleElement = document.createElement('div');
            articleElement.classList.add('col', 'mb-4');
            articleElement.innerHTML = `
                <div class="col card px-4 border-0 art-card">
                    <a href="/article?id=${id}" class="text-decoration-none text-dark">
                        <img class="card-img-top scale-on-hover" src="${image}" alt="${headline}">
                        <div class="card-body">
                            <h3>${headline}</h3>
                            <p class="text-muted card-text">${short_text}</p>
                        </div>
                    </a>
                </div>
            `;
    
            articleContainer.appendChild(articleElement);
        });
    } catch (error) {
        console.error('Error fetching articles:', error);
    }
});
