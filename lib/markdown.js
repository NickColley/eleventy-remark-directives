import { unified } from "unified";
import parse from "remark-parse";
import directive from "remark-directive";
import rehype from "remark-rehype";
import stringify from "rehype-stringify";

import { abbreviationDirective, includeDirective } from "./directives.js";

export default async function (markdown, pageData, eleventyConfig) {
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
    // Turn Markdown into HTML syntax tree
    .use(rehype, {
      fragment: true,
    })
    // Turn HTML syntax tree into HTML text
    .use(stringify)
    .process(markdown);

  return String(output);
}
