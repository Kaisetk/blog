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

