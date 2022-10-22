import { join } from "node:path";
import { visit } from "unist-util-visit";

export async function visitAsync(tree, matcher, asyncVisitor) {
  const matches = [];
  visit(tree, matcher, (...args) => {
    matches.push(args);
    return tree;
  });

  const promises = matches.map((match) => asyncVisitor(...match));
  await Promise.all(promises);

  return tree;
}

export function replaceNode(node, hast) {
  const topLevelNode = hast && hast.children && hast.children[0];
  if (!topLevelNode) {
    return console.error(
      "No top level node in hast to replace node with",
      hast
    );
  }
  node.type = "parent";
  node.data = node.data || {};
  if (topLevelNode.tagName) {
    node.data.hName = topLevelNode.tagName;
  }
  if (topLevelNode.properties) {
    node.data.hProperties = topLevelNode.properties;
  }
  if (topLevelNode.children) {
    node.data.hChildren = topLevelNode.children;
  }
}

export function getIncludesDirectory({ dir }) {
  const input = dir?.input || ".";
  const includes = dir?.includes || "./_includes";
  return join(process.cwd(), input, includes);
}

export function constructRenderPartial(eleventyConfig) {
  // Since we're getting the render function from an eleventyConfig
  // we construct the file instead of importing it.
  const renderFile = eleventyConfig?.javascriptFunctions?.renderFile;
  if (!renderFile) {
    throw new Error("EleventyRenderPlugin is not added");
  }
  const includesDirectory = getIncludesDirectory(eleventyConfig);
  return (fileName, data) => {
    const filePath = join(includesDirectory, fileName);
    // Clone the data to prevent manipulating
    // any page data and breaking other rendering.
    const clonedData = Object.assign({}, data || {});
    return renderFile(filePath, clonedData);
  };
}
