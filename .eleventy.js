const { EleventyRenderPlugin } = require("@11ty/eleventy");

const markdown = require("./lib/markdown.js");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(EleventyRenderPlugin);

  eleventyConfig.setLibrary("md", {
    render: (content, data) => markdown(content, data, eleventyConfig),
  });
};
