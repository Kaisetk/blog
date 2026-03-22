document.addEventListener("DOMContentLoaded", () => {
  generateTOC();
  hideLoading();
});

// =========================
// 目次生成
// =========================
function generateSafeId(text) {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]/g, '');
}

function generateTOC() {
  const content = document.getElementById("article-content");
  const tocList = document.getElementById("toc-list");
  if (!content || !tocList) return;

  const headings = content.querySelectorAll("h2, h3");
  const fragment = document.createDocumentFragment();

  headings.forEach((heading) => {
    const rawText = heading.textContent.trim();
    const safeId = heading.id || generateSafeId(rawText) || "heading-" + Math.random().toString(36).slice(2, 8);
    heading.id = safeId;

    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = "#" + heading.id;
    a.textContent = rawText;
    li.appendChild(a);

    if (heading.tagName.toLowerCase() === "h3") li.style.marginLeft = "1em";    fragment.appendChild(li);
    
  });

  tocList.appendChild(fragment);

  // 目次全体折りたたみ（長い場合のみ）
  const maxItems = 8; // 最初に見せる目次アイテム数
  if (tocList.children.length > maxItems) {
    tocList.classList.add("collapsed");

    const toc = document.getElementById("toc");
    const btn = document.createElement("button");
    btn.className = "toc-expand-btn";
    btn.textContent = "…もっとみる";
    btn.addEventListener("click", () => {
      tocList.classList.toggle("collapsed");
      btn.textContent = tocList.classList.contains("collapsed") ? "…もっとみる" : "閉じる";
    });
    toc.appendChild(btn);
  }
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
