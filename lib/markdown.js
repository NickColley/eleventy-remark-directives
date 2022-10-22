module.exports = async function (markdown, pageData, eleventyConfig) {
  const { join } = await import("node:path");
  const { unified } = await import("unified");

  const { default: parse } = await import("remark-parse");
  const { default: directive } = await import("remark-directive");
  const { default: rehype } = await import("remark-rehype");
  const { default: stringify } = await import("rehype-stringify");
  const { abbreviationDirective, includeDirective } = await import(
    join(__dirname, "directives.mjs")
  );

  const output = await unified()
    // Turn Markdown text into Markdown syntax tree
    .use(parse)
    // Apply directives
    .use(directive)
    .use(includeDirective, {
      pageData,
      eleventyConfig,
    })
    .use(abbreviationDirective)
    // Apply Markdown specific transforms
    // .use(emojis)
    // Turn Markdown into HTML syntax tree
    .use(rehype, {
      fragment: true,
    })
    // Apply HTML specific transforms
    // .use(format)
    // Turn HTML syntax tree into HTML text
    .use(stringify)
    .process(markdown);

  return String(output);
};
