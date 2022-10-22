const { EleventyRenderPlugin } = require("@11ty/eleventy");
module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(EleventyRenderPlugin);

  eleventyConfig.setLibrary("md", {
    render: async (content, data) => {
      // Eleventy does not support async/await in the configuration file yet.
      // This allows us to bring a ESM module into CommonJS.
      const { default: render } = await import("./lib/markdown.js");
      return render(content, data, eleventyConfig);
    },
  });
};
