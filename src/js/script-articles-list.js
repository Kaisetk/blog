document.addEventListener("DOMContentLoaded", () => {

  const category = window.CATEGORY;
  const currentCategory = category || "all";
  updateCategoryLinks(currentCategory);

  hideLoading();
});

// =========================
// カテゴリリンクのアクティブ表示
// =========================
function updateCategoryLinks(currentCategory) {
  document.querySelectorAll(".categories-pagination a").forEach(link => {
    // リンクのパスからカテゴリIDを取得
    const pathParts = new URL(link.href, window.location.origin).pathname.split("/").filter(Boolean);
    // pathParts = ["articles-list", "category", "trip"] の想定
    let linkCategory = "all";
    const catIndex = pathParts.indexOf("category");
    if (catIndex >= 0 && pathParts.length > catIndex + 1) {
      linkCategory = pathParts[catIndex + 1];
    }

    link.classList.toggle("active", linkCategory === currentCategory);
  });
}
