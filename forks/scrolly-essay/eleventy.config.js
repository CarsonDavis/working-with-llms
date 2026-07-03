import { EleventyHtmlBasePlugin } from "@11ty/eleventy";

export default function (eleventyConfig) {
  // Rewrites root-absolute URLs (/css/…, /deep/…) to honor pathPrefix.
  // No-op for local dev (default prefix "/"); CI passes
  // --pathprefix=/working-with-llms/scrolly/ for the GitHub Pages subpath.
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);

  eleventyConfig.addPassthroughCopy({ "src/css": "css" });
  eleventyConfig.addPassthroughCopy({ "src/js": "js" });
  eleventyConfig.addPassthroughCopy({ "src/fonts": "fonts" });

  // Deep-dive pages, ordered and numbered the way they appear inside the
  // essay (the essay itself is conceptually "01 — Start Here"; the deep
  // dives continue the numbering at 02).
  eleventyConfig.addCollection("deepDives", (collectionApi) =>
    collectionApi.getFilteredByGlob("src/deep/*.md").sort(
      (a, b) => a.data.num - b.data.num
    )
  );

  eleventyConfig.addFilter("deepAt", (deepDives, offset, num) => {
    const idx = deepDives.findIndex((d) => d.data.num === num);
    if (idx === -1) return null;
    return deepDives[idx + offset] || null;
  });

  eleventyConfig.addFilter("pad2", (n) => String(n).padStart(2, "0"));

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
