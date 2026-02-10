document.addEventListener("DOMContentLoaded", () => {
  generateTOC();
  renderRelatedArticles();
  hideLoading();
});

// =========================
// 目次生成
// =========================
function generateTOC() {
  const content = document.getElementById("article-content");
  const tocList = document.getElementById("toc-list");
  if (!content || !tocList) return;

  const headings = content.querySelectorAll("h2, h3");
  const fragment = document.createDocumentFragment();

  headings.forEach((heading) => {
    const rawText = heading.textContent.trim();
    const safeId = generateSafeId(rawText);

    if (!heading.id) {
      heading.id = safeId || "heading-" + Math.random().toString(36).slice(2, 8);
    }

    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = "#" + heading.id;
    a.textContent = rawText;

    li.appendChild(a);
    if (heading.tagName.toLowerCase() === "h3") li.style.marginLeft = "1em";

    fragment.appendChild(li);
  });

  tocList.appendChild(fragment);
}

// =========================
// 安全なID生成（空白・記号除去）
// =========================
function generateSafeId(text) {
  return text
    .replace(/\s+/g, '-')                  // 空白 → ハイフン
    .replace(/[^\w\-ぁ-んァ-ン一-龥]/g, '') // 記号除去（日本語は許可）
    .toLowerCase();
}

// =========================
// 関連記事描画
// =========================
function renderRelatedArticles() {
  if (!window.ARTICLES || !window.RELATED_IDS) return;

  const relatedArticles = window.ARTICLES.filter(a =>
    window.RELATED_IDS.includes(a.id)
  );

  const articlesList = document.getElementById("articles_list");
  if (!articlesList) return;

  renderArticlesGrid(articlesList, { articles: relatedArticles });
}
