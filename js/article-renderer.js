import { Marked } from 'marked';
import katex from 'katex';

const ARTICLES_BASE = '/articles';

async function init() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');

  if (!slug) {
    showError('Aucun article spécifié.');
    return;
  }

  try {
    const [indexRes, mdRes] = await Promise.all([
      fetch(`${ARTICLES_BASE}/index.json`),
      fetch(`${ARTICLES_BASE}/${slug}.md`),
    ]);

    if (!mdRes.ok) throw new Error('Article introuvable');

    const articles = await indexRes.json();
    const markdown = await mdRes.text();
    const meta = articles.find((a) => a.slug === slug) || {};

    renderHeader(meta);
    renderArticle(markdown);
    document.title = `${meta.title || slug} — Lamine Sow`;
  } catch (err) {
    showError(err.message || 'Erreur lors du chargement.');
  }
}

function renderHeader(meta) {
  const header = document.getElementById('articleHeader');
  if (!header || !meta.title) return;

  header.innerHTML = `
    <div class="article-viewer__meta">
      ${meta.category ? `<span class="article-viewer__tag">${meta.category}</span>` : ''}
      ${meta.date ? `<span class="article-viewer__date">${meta.date}</span>` : ''}
    </div>
    <h1 class="article-viewer__title">${meta.title}</h1>
    ${meta.subtitle ? `<p class="article-viewer__subtitle">${meta.subtitle}</p>` : ''}
  `;
}

function renderArticle(markdown) {
  const container = document.getElementById('articleContent');
  const loading = document.getElementById('articleLoading');
  if (loading) loading.remove();

  const processed = processLatex(markdown);

  const marked = new Marked({
    gfm: true,
    breaks: false,
    pedantic: false,
  });

  container.innerHTML = marked.parse(processed);
  renderMathInElement(container);
}

function processLatex(text) {
  // Block math: $$...$$ → placeholder
  text = text.replace(/\$\$([\s\S]*?)\$\$/g, (_, expr) => {
    try {
      return `<div class="katex-display">${katex.renderToString(expr.trim(), { displayMode: true, throwOnError: false })}</div>`;
    } catch {
      return `<div class="katex-display katex-error">${expr}</div>`;
    }
  });

  // Inline math: $...$ (not preceded/followed by $)
  text = text.replace(/(?<!\$)\$(?!\$)(.*?)(?<!\$)\$(?!\$)/g, (_, expr) => {
    try {
      return katex.renderToString(expr.trim(), { displayMode: false, throwOnError: false });
    } catch {
      return `<span class="katex-error">${expr}</span>`;
    }
  });

  // \[ ... \] block math
  text = text.replace(/\\\[([\s\S]*?)\\\]/g, (_, expr) => {
    try {
      return `<div class="katex-display">${katex.renderToString(expr.trim(), { displayMode: true, throwOnError: false })}</div>`;
    } catch {
      return `<div class="katex-display katex-error">${expr}</div>`;
    }
  });

  // \( ... \) inline math
  text = text.replace(/\\\((.*?)\\\)/g, (_, expr) => {
    try {
      return katex.renderToString(expr.trim(), { displayMode: false, throwOnError: false });
    } catch {
      return `<span class="katex-error">${expr}</span>`;
    }
  });

  return text;
}

function renderMathInElement(container) {
  // Already handled in processLatex, but catch any remaining LaTeX-style delimiters
  container.querySelectorAll('code').forEach((code) => {
    if (code.parentElement.tagName === 'PRE') return;
    const text = code.textContent;
    if (text.startsWith('$') && text.endsWith('$')) {
      const expr = text.slice(1, -1);
      try {
        const span = document.createElement('span');
        span.innerHTML = katex.renderToString(expr, { displayMode: false, throwOnError: false });
        code.replaceWith(span);
      } catch { /* keep code block as-is */ }
    }
  });
}

function showError(message) {
  const container = document.getElementById('articleContent');
  const loading = document.getElementById('articleLoading');
  if (loading) loading.remove();

  container.innerHTML = `
    <div class="article-error">
      <h2 class="article-error__title">Article introuvable</h2>
      <p>${message}</p>
      <br />
      <a href="/pages/articles.html" class="btn btn--outline">Voir tous les articles</a>
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', init);
