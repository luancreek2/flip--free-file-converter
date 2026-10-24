import { expect, test } from "bun:test";

import { getPossibleTargets } from "../../src/converters/main";
import { conversionHref, inputFormatCount, toolCategories } from "../../src/helpers/toolCatalog";

test("every advertised conversion is backed by its exact converter mapping", () => {
  const tools = toolCategories.flatMap((category) => category.tools);
  expect(tools.length).toBeGreaterThan(15);
  for (const tool of tools) {
    expect(getPossibleTargets(tool.from)[tool.converter]).toContain(tool.target);
    expect(conversionHref("/flip", tool)).toBe(
      `/flip/?from=${encodeURIComponent(tool.from)}&to=${encodeURIComponent(tool.target)}#converter`,
    );
  }
  expect(inputFormatCount).toBeGreaterThan(0);
});

test("the catalogue does not invent operations or archive capabilities", () => {
  expect(toolCategories.find((category) => category.id === "archive")?.tools).toEqual([]);
  const names = toolCategories.flatMap((category) => category.tools.map((tool) => tool.id));
  expect(names).not.toContain("merge-pdf");
  expect(names).not.toContain("compress-pdf");
  expect(names).not.toContain("zip-extract");
});
