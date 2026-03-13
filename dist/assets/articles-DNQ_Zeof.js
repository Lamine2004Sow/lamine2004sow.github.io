import"./ScrollTrigger-UQvzuUQL.js";import"./page-init-DVQZc33e.js";const i="/articles";async function n(){const a=document.getElementById("articlesGrid"),t=document.getElementById("articlesLoading");try{const r=await fetch(`${i}/index.json`);if(!r.ok)throw new Error("Impossible de charger les articles");const s=await r.json();if(t&&t.remove(),!s.length){a.innerHTML='<p style="color: var(--text-tertiary);">Aucun article pour le moment.</p>';return}a.innerHTML=s.map(e=>`
      <a href="/pages/article.html?slug=${e.slug}" class="article-card reveal-up">
        <span class="article-card__type">${e.category||"Article"}</span>
        <div class="article-card__body">
          <h3 class="article-card__title">${e.title}</h3>
          <div class="article-card__meta">
            ${e.date?`<span>${e.date}</span>`:""}
            ${e.readTime?`<span>${e.readTime}</span>`:""}
          </div>
        </div>
        <svg class="article-card__arrow" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
      </a>
    `).join("")}catch(r){t&&t.remove(),a.innerHTML=`<p style="color: var(--text-tertiary);">${r.message}</p>`}}document.addEventListener("DOMContentLoaded",n);
