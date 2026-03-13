const ARTICLES_BASE = '/articles';

async function loadArticles() {
  const grid = document.getElementById('articlesGrid');
  const loading = document.getElementById('articlesLoading');

  try {
    const res = await fetch(`${ARTICLES_BASE}/index.json`);
    if (!res.ok) throw new Error('Impossible de charger les articles');
    const articles = await res.json();

    if (loading) loading.remove();

    if (!articles.length) {
      grid.innerHTML = '<p style="color: var(--text-tertiary);">Aucun article pour le moment.</p>';
      return;
    }

    grid.innerHTML = articles.map((article) => `
      <a href="/pages/article.html?slug=${article.slug}" class="article-card reveal-up">
        <span class="article-card__type">${article.category || 'Article'}</span>
        <div class="article-card__body">
          <h3 class="article-card__title">${article.title}</h3>
          <div class="article-card__meta">
            ${article.date ? `<span>${article.date}</span>` : ''}
            ${article.readTime ? `<span>${article.readTime}</span>` : ''}
          </div>
        </div>
        <svg class="article-card__arrow" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
      </a>
    `).join('');

  } catch (err) {
    if (loading) loading.remove();
    grid.innerHTML = `<p style="color: var(--text-tertiary);">${err.message}</p>`;
  }
}

document.addEventListener('DOMContentLoaded', loadArticles);
