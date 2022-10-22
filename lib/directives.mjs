import { fromHtml } from "hast-util-from-html";
import { visit } from "unist-util-visit";
import { visitAsync, replaceNode, constructRenderPartial } from "./utils.mjs";

// ::include[_partial.html] => <h1>Hello, World</h1>
export function includePartial({ pageData, eleventyConfig }) {
  const renderPartial = constructRenderPartial(eleventyConfig);
  return (tree) => {
    return visitAsync(tree, "leafDirective", async (node) => {
      // ::include[] only.
      if (node.name !== "include") {
        return;
      }

      // ::include[_partial.html] => "_partial.html"
      const fileName = node?.children[0]?.value || "";

      // ::include[]{title="Hello, World"} => { title: "Hello, World" }
      const attributes = node.attributes || {};

      try {
        const html = await renderPartial(fileName, {
          ...pageData,
          ...attributes,
        });
        replaceNode(node, fromHtml(html, { fragment: true }));
      } catch (error) {
        console.warn(`[directive:${node.name}]`, error.message);
      }
    });
  };
}

// :abbr[HTML]{title="HyperText Markup Language"} => <abbr title="HyperText Markup Language">HTML</abbr>
export function abbreviationDirective() {
  return (tree) => {
    return visit(tree, "textDirective", (node) => {
      // :abbr[] only.
      if (node.name !== "abbr") {
        return;
      }

      // :abbr[HTML] => "HTML"
      const value = node?.children[0]?.value || "";

      // :abbr[]{title="HyperText Markup Language"} => { title: "HyperText Markup Language" }
      const attributes = node.attributes || {};

      try {
        const { title } = attributes;
        const html = `<abbr title="${title}">${value}</abbr>`;
        replaceNode(node, fromHtml(html, { fragment: true }));
      } catch (error) {
        console.warn(`[directive:${node.name}]`, error.message);
      }
    });
  };
}
