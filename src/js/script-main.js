document.addEventListener("DOMContentLoaded", () => {
  initMenuToggle();
  initHeaderScroll();
});

// =========================
// ハンバーガーメニュー制御
// =========================
function initMenuToggle() {
  const toggleButton = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  if (!toggleButton || !navLinks) return;

  // メニュー開閉
  toggleButton.addEventListener("click", (event) => {
    event.stopPropagation();
    navLinks.classList.toggle("active");
  });

  // メニュークリックで閉じる
  navLinks.addEventListener("click", () => {
    navLinks.classList.remove("active");
  });

  // 外側クリックで閉じる
  document.addEventListener("click", (event) => {
    if (navLinks.classList.contains("active") &&
      !navLinks.contains(event.target) &&
      !toggleButton.contains(event.target)) {
      navLinks.classList.remove("active");
    }
  });
}

// =========================
// スクロールでヘッダー表示制御
// =========================
function initHeaderScroll() {
  const header = document.querySelector("header");
  if (!header) return;

  let lastScrollY = window.scrollY;
  window.addEventListener("scroll", () => {

    if (window.scrollY > lastScrollY) {
      header.classList.add('hide');
    } else {
      header.classList.remove('hide');
    }

    lastScrollY = window.scrollY;
  });
}

// =========================
// 記事グリッド生成
// =========================
function renderArticlesGrid(container, options = {}) {
  const articles = options.articles || window.ARTICLES || [];
  const category = options.category || null;
  const tag = options.tag || null;

  let filtered = articles;
  if (category) filtered = filtered.filter(a => a.category === category);
  if (tag) filtered = filtered.filter(a => a.tags && a.tags.includes(tag));

  container.innerHTML = "";
  if (filtered.length === 0) {
    container.innerHTML = "<li>記事が見つかりませんでした。</li>";
    return;
  }
  filtered.forEach(article => {
    const li = document.createElement("li");
    li.className = "article_card";

    li.innerHTML = `
    <a href="/articles/${article.id}/" class="card${article.eyecatch ? "" : " no-thumb"}">
      ${article.eyecatch ? `
        <div class="card-thumb">
          <img src="/images/articles/eyecatches/600px/${article.eyecatch}" alt="${article.title}" loading="lazy" decoding="async">
        </div>
      ` : ""}

      <div class="card-body">
        <h2 class="title">${article.title}</h2>

        ${article.intro ? `<p class="intro">${article.intro}</p>` : ""}

        <div class="card-footer">
          <span class="category">${getCategoryName(article.category)}</span>
          ${article.tags ? `<span class="tags">#${article.tags.map(tag => getTagName(tag)).join(' #')}</span>` : ""}
          ${article.date ? `<span class="date">${formatDateJS(article.date)}</span>` : ""}
        </div>
      </div>
    </a>
  `;

    container.appendChild(li);
  });



}

function formatDateJS(dateString) {
  if (!dateString) return "";
  const d = new Date(dateString);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}/${mm}/${dd}`;
}


// =========================
// タグ・カテゴリユーティリティ
// =========================
function getTagName(tagId) {
  return window.SLUGS?.tag?.find(t => t.id === tagId)?.name || tagId;
}

function getCategoryName(categoryId) {
  return window.SLUGS?.category?.find(c => c.id === categoryId)?.name || categoryId;
}

// =========================
// 読み込み中非表示
// =========================
function hideLoading() {
  const loadingEl = document.getElementById('loading');
  if (loadingEl) loadingEl.style.display = 'none';
}

