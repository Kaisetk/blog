// eleventy.config.js
const { DateTime } = require("luxon");
const markdownIt = require("markdown-it");
const markdownItContainer = require("markdown-it-container");

module.exports = function (eleventyConfig) {

  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy("./src/e980358e09e548d8aae805da9c28a770.txt");
  eleventyConfig.addPassthroughCopy("./src/AgodaPartnerVerification.htm");

  eleventyConfig.addTransform("externalLinksAuto", function (content) {
    if (!this.page.outputPath || !this.page.outputPath.endsWith(".html")) {
      return content;
    }

    const myDomain = "otoku-choices.com";

    return content.replace(/<a\s+([^>]*href="([^"]+)"[^>]*)>/gi, (match, attrs, href) => {
      // http以外は無視
      if (!href.startsWith("http")) return match;

      // 内部リンク無視
      if (href.includes(myDomain)) return match;

      // relが既にある → 完全スルー
      if (attrs.includes("rel=")) return match;

      let newAttrs = attrs;

      // targetが無ければ追加
      if (!attrs.includes("target=")) {
        newAttrs += ' target="_blank"';
      }

      // rel追加
      newAttrs += ' rel="nofollow noopener noreferrer"';

      return `<a ${newAttrs}>`;
    });
  });

  // Markdown拡張
  const md = markdownIt({
    html: true,
    breaks: true,
    linkify: true
  });

  // 補足ボックス
  md.use(markdownItContainer, "note");
  md.use(markdownItContainer, "point");
  md.use(markdownItContainer, "caution");

  eleventyConfig.setLibrary("md", md);


  eleventyConfig.addFilter("jsonify", function (value) {
    return JSON.stringify(value);
  });

  // ==========================
  // 静的ファイルコピー
  // ==========================
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/images");

  // ==========================
  // フィルター
  // ==========================
  eleventyConfig.addFilter("year", () => {
    return new Date().getFullYear();
  });

  eleventyConfig.addFilter("formatDate", (value, format = "yyyy/MM/dd") => {
    return DateTime.fromJSDate(value).toFormat(format);
  });

  // ==========================
  // コレクション: カテゴリごとのタグ
  // ==========================
  eleventyConfig.addFilter("keys", function (value) {
    return Object.keys(value);
  });

  eleventyConfig.addCollection("categoryTags", function (collectionApi) {//記事数が中規模（例：100〜300件）になってきたら2-3記事以上のタグ表示に絞る、TOP10のみなど対応行う
    let map = {};

    collectionApi.getAll().forEach(item => {
      let cat = item.data.category;
      let tags = Array.isArray(item.data.tags) ? item.data.tags : [item.data.tags].filter(Boolean);

      if (cat) {
        if (!map[cat]) map[cat] = new Set();
        tags.forEach(tag => map[cat].add(tag));
      }
    });

    // Set → Array に変換
    let result = {};
    for (let cat in map) {
      result[cat] = [...map[cat]].sort();
    }
    return result;
  });

  eleventyConfig.addCollection("articles", function (collectionApi) {
    return collectionApi.getAll()
      .filter(item => item.data.released)
      .sort((a, b) => new Date(b.data.released) - new Date(a.data.released)) // 日付降順
      .map(item => ({
        id: item.fileSlug,
        title: item.data.title,
        eyecatch: item.data.eyecatch,
        category: item.data.category,
        tags: item.data.tags,
        intro: item.data.intro,
        url: item.url,
        date: item.data.date,
        lab: item.data.lab || false
      })); // 必要な情報だけ返す
  });

  eleventyConfig.addCollection("latestArticles", (collectionApi) => {
    return collectionApi.getAll()
      .filter(item => item.data.released) // released がある記事だけ
      .sort((a, b) => new Date(b.data.released) - new Date(a.data.released)) // 新しい順
      .slice(0, 6) // 先頭6件
      .map(item => ({
        id: item.fileSlug,
        title: item.data.title,
        eyecatch: item.data.eyecatch,
        category: item.data.category,
        tags: item.data.tags,
        intro: item.data.intro,
        date: item.data.date,
        lab: item.data.lab || false
      }));
  });

  const CATEGORY_IDS = ["daily-life", "trip"];

  CATEGORY_IDS.forEach(cat => {
    eleventyConfig.addCollection(`category-${cat}`, collectionApi => {
      return collectionApi.getAll()
        .filter(item => item.data.released && item.data.category === cat)
        .sort((a, b) => new Date(b.data.released) - new Date(a.data.released))
        .map(item => ({
          id: item.fileSlug,
          title: item.data.title,
          eyecatch: item.data.eyecatch,
          category: item.data.category,
          tags: item.data.tags,
          intro: item.data.intro,
          url: item.url,
          date: item.data.date,
          lab: false
        }));
    });
  });

  eleventyConfig.addCollection("lab", collectionApi => {
    return collectionApi.getAll()
      .filter(item => item.data.released && item.data.lab)
      .sort((a, b) => new Date(b.data.released) - new Date(a.data.released))
      .map(item => ({
        id: item.fileSlug,
        title: item.data.title,
        eyecatch: item.data.eyecatch,
        category: item.data.category,
        tags: item.data.tags,
        intro: item.data.intro,
        url: item.url,
        date: item.data.date,
        lab: item.data.lab || false
      }));
  });

  eleventyConfig.addCollection("articlesByTag", function (collectionApi) {
    const allArticles = collectionApi.getAll().filter(item => item.data.released);
    let result = [];

    const map = {};
    allArticles.forEach(item => {
      const tags = Array.isArray(item.data.tags) ? item.data.tags : [item.data.tags].filter(Boolean);
      tags.forEach(tag => {
        if (!map[tag]) map[tag] = [];
        map[tag].push({
          id: item.fileSlug,
          title: item.data.title,
          eyecatch: item.data.eyecatch,
          category: item.data.category,
          tags: item.data.tags,
          intro: item.data.intro,
          url: item.url,
          date: item.data.date
        });
      });
    });



    Object.entries(map).forEach(([tag, posts]) => {
      result.push({
        tag,
        posts
      });
    });

    return result;
  });

  eleventyConfig.addCollection("featuredArticles", function (collectionApi) {

    const featured = require("./src/_data/featured.js");
    const all = collectionApi.getAll();

    let result = {};

    Object.keys(featured).forEach(cat => {

      result[cat] = featured[cat].map(slug => {

        const item = all.find(post => post.fileSlug === slug);

        if (!item) return null;

        return {
          id: item.fileSlug,
          title: item.data.title,
          eyecatch: item.data.eyecatch,
          category: item.data.category,
          tags: item.data.tags,
          intro: item.data.intro,
          url: item.url,
          date: item.data.date,
          lab: item.data.lab || false
        };

      }).filter(Boolean);

    });

    return result;
  });

  eleventyConfig.addCollection("relatedArticles", function (collectionApi) {

    return function (tags = [], currentSlug = "", limit = 3) {

      const all = collectionApi.getAll();

      return all
        .filter(item => {
          // 自分自身は除外
          if (item.fileSlug === currentSlug) return false;

          // タグが1つでも一致したらOK
          const itemTags = item.data.tags || [];
          return tags.some(tag => itemTags.includes(tag));
        })
        // 新しい順（お好みで）
        .sort((a, b) => b.date - a.date)
        // 件数制限
        .slice(0, limit)
        // 必要なデータだけ整形
        .map(item => ({
          id: item.fileSlug,
          title: item.data.title,
          eyecatch: item.data.eyecatch,
          category: item.data.category,
          tags: item.data.tags,
          intro: item.data.intro,
          url: item.url,
          date: item.data.date,
          lab: item.data.lab || false
        }));

    };
  });


  eleventyConfig.addFilter("filterByCategory", (collection, category) => {
    return collection.filter(item => item.data.category === category);
  });

  eleventyConfig.addFilter("getTagName", (tagId, taxonomy) => {
    const tag = taxonomy.tag.find(t => t.id === tagId);
    return tag ? tag.name : tagId;
  });

  eleventyConfig.addFilter("getCategoryName", (categoryId, taxonomy) => {
    const category = taxonomy.category.find(t => t.id === categoryId);
    return category ? category.name : categoryId;
  });

  eleventyConfig.addShortcode("insertimg", function (slug, filename, alt) {
    const articles = this.ctx?.collections?.articles || [];
    const article = articles.find(a => a.id === slug);
    if (!article) return "";
    return `<img src="/images/articles/${slug}/${filename}.webp" alt="${alt || article.title}" class="inserted-image" loading="lazy">`;
  });


  eleventyConfig.addShortcode("shopcard", function (imageHtml, rakuten, yahoo, title) {
    return `
  <div class="shop-card">

    ${imageHtml ? `<div class="shop-card-image">${imageHtml}</div>` : ""}

    <div class="shop-card-content">
      ${title ? `<p class="shop-card-title">${title}</p>` : ""}

      <div class="shop-card-buttons">
        ${rakuten ? `<a href="${rakuten}" class="shop-btn rakuten">楽天で見る</a>` : ""}
        ${yahoo ? `<a href="${yahoo}" class="shop-btn yahoo">Yahooで見る</a>` : ""}
      </div>
    </div>

  </div>
`;
  });

  eleventyConfig.addShortcode("shopsearch", function (keyword, rakutenUrl, yahooUrl) {
    return `
    <div class="shop-search-card">
      <p class="shop-search-title">「${keyword}」を探す</p>
      <div class="shop-search-buttons">
        ${rakutenUrl ? `<a href="${rakutenUrl}" class="shop-btn rakuten">楽天で探す</a>` : ""}
        ${yahooUrl ? `<a href="${yahooUrl}" class="shop-btn yahoo">Yahooで探す</a>` : ""}
      </div>
    </div>
  `;
  });

  eleventyConfig.addShortcode("article", function (slug) {
    const articles = this.ctx?.collections?.articles || [];
    const article = articles.find(a => a.id === slug);
    if (!article) return "";

    const eyecatch = article.eyecatch;
    const intro = article.intro
      ? article.intro.substring(0, 80).replace(/。?$/, "…")
      : "";

    return `
<a href="${article.url}" class="article-card-reference">
  <div class="article-card-image-reference">
    <img src="/images/articles/eyecatches/600px/${eyecatch}" alt="${article.title}のアイキャッチ画像" class="card-image-reference" loading="lazy">
  </div>
  <div class="article-card-content-reference">
    <div class="article-card-title-reference">${article.title}</div>
    <div class="article-card-intro-reference">
      ${intro}
    </div>
  </div>
</a>`;
  });

  // ==========================
  // サイト情報（グローバルデータ）
  // ==========================
  eleventyConfig.addGlobalData("site", {
    url: "https://otoku-choices.com",
    name: "Otoku Choices",            // サイト名
    author: "Kai",
    description: "賢く選んで暮らしと旅行をおトクにする、戦略的ライフハックブログです。"
  });

  // ==========================
  // ディレクトリ構成
  // ==========================
  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site"
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};

