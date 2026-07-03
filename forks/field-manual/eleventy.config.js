import MarkdownIt from "markdown-it";
import markdownItFootnote from "markdown-it-footnote";

// ---------------------------------------------------------------------------
// Slug helper (used for heading ids). No external dependency — this is a
// small hand-written slugifier, not a package.
// ---------------------------------------------------------------------------
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

// ---------------------------------------------------------------------------
// Markdown-it instance: footnotes + stable heading anchors.
// ---------------------------------------------------------------------------
const md = new MarkdownIt({ html: true, typographer: false })
  .use(markdownItFootnote);

// Give every heading a stable, slugified id so in-page anchors keep working.
md.core.ruler.push("heading_ids", (state) => {
  const seen = new Map();
  state.tokens.forEach((token, idx) => {
    if (token.type === "heading_open") {
      const inline = state.tokens[idx + 1];
      const text = inline && inline.children
        ? inline.children.map((t) => t.content).join("")
        : "";
      let slug = slugify(text) || "section";
      if (seen.has(slug)) {
        const n = seen.get(slug) + 1;
        seen.set(slug, n);
        slug = `${slug}-${n}`;
      } else {
        seen.set(slug, 1);
      }
      token.attrSet("id", slug);
    }
  });
});

// ---------------------------------------------------------------------------
// Footnote -> Tufte-style sidenote transform.
//
// markdown-it-footnote renders footnote references as:
//   <sup class="footnote-ref"><a href="#fn1" id="fnref1">[1]</a></sup>
// and collects definitions at the end of the document as:
//   <hr class="footnotes-sep">
//   <section class="footnotes"><ol class="footnotes-list">
//     <li id="fn1" class="footnote-item"><p>CONTENT <a ... class="footnote-backref">↩︎</a></p></li>
//   </ol></section>
//
// We rewrite that into inline Tufte-technique sidenote markup:
//   <label for="sn-1" class="sidenote-number">1</label>
//   <input type="checkbox" id="sn-1" class="sidenote-toggle">
//   <span class="sidenote">CONTENT</span>
// and drop the trailing footnotes section entirely. A note whose content
// starts with the gear glyph is flagged as a tool-note.
// ---------------------------------------------------------------------------
const FOOTNOTE_SECTION_RE =
  /<hr class="footnotes-sep">\s*<section class="footnotes">\s*<ol class="footnotes-list">([\s\S]*?)<\/ol>\s*<\/section>/;
const FOOTNOTE_ITEM_RE =
  /<li id="fn(\d+)" class="footnote-item"><p>([\s\S]*?)\s*<a href="#fnref\d+" class="footnote-backref">[^<]*<\/a><\/p>\s*<\/li>/g;
const FOOTNOTE_REF_RE =
  /<sup class="footnote-ref"><a href="#fn(\d+)" id="fnref\d+">\[\d+\]<\/a><\/sup>/g;

function transformSidenotes(html) {
  const sectionMatch = html.match(FOOTNOTE_SECTION_RE);
  if (!sectionMatch) return html;

  const notes = new Map();
  let itemMatch;
  FOOTNOTE_ITEM_RE.lastIndex = 0;
  while ((itemMatch = FOOTNOTE_ITEM_RE.exec(sectionMatch[1])) !== null) {
    notes.set(itemMatch[1], itemMatch[2].trim());
  }

  // Remove the trailing footnotes section.
  html = html.replace(FOOTNOTE_SECTION_RE, "");

  // Replace each inline ref with the sidenote markup.
  html = html.replace(FOOTNOTE_REF_RE, (match, n) => {
    const content = notes.get(n) || "";
    const isToolNote = /^⚙/.test(content.trim());
    const cls = isToolNote ? "sidenote tool-note" : "sidenote";
    return (
      `<label for="sn-${n}" class="sidenote-number">${n}</label>` +
      `<input type="checkbox" id="sn-${n}" class="sidenote-toggle">` +
      `<span class="${cls}">${content}</span>`
    );
  });

  return html;
}

export default function (eleventyConfig) {
  eleventyConfig.setLibrary("md", md);

  eleventyConfig.addTransform("sidenotes", function (content) {
    if (this.page && this.page.outputPath && this.page.outputPath.endsWith(".html")) {
      return transformSidenotes(content);
    }
    return content;
  });

  eleventyConfig.addPassthroughCopy({ "src/css": "css" });
  eleventyConfig.addPassthroughCopy({ "src/fonts": "fonts" });

  eleventyConfig.addCollection("chapters", (collectionApi) =>
    collectionApi.getFilteredByGlob("src/chapters/*.md").sort(
      (a, b) => a.data.num - b.data.num
    )
  );

  const buildDate = new Date();
  eleventyConfig.addGlobalData("buildDate", () => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ];
    return `${months[buildDate.getMonth()]} ${buildDate.getFullYear()}`;
  });

  eleventyConfig.addGlobalData("chapterCount", 7);

  eleventyConfig.addFilter("ordinalChapter", (num) => `Chapter ${num} of 7`);

  eleventyConfig.addFilter("chapterAt", (chapters, offset, num) => {
    const idx = chapters.findIndex((c) => c.data.num === num);
    if (idx === -1) return null;
    return chapters[idx + offset] || null;
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      layouts: "_layouts",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
