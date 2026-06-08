/* WILD Programme — Eleventy build config.
 * Source lives in src/; build output goes to docs/ (GitHub Pages serves /docs).
 * The live site keeps serving from the repo root until you flip Pages -> /docs. */
module.exports = function (eleventyConfig) {
  // Static assets — copied verbatim into docs/
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/og-image.png");
  eleventyConfig.addPassthroughCopy("src/og-image.svg");

  return {
    dir: { input: "src", includes: "_includes", output: "docs" },
    pathPrefix: "/wild-programme/",
    // Do NOT run page bodies through a template engine — their inline CSS/JS
    // braces would collide with Nunjucks. Layouts (.njk) still wrap them.
    htmlTemplateEngine: false,
    markdownTemplateEngine: false,
    templateFormats: ["html", "njk"],
  };
};
