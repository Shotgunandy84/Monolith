import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";

// Run the real builder handlers with synchronous hooks, without browser packages.
// JSX is excluded; this verifies state and totals rather than rendered behaviour.
export function createBuilderHarness(params = "", confirm = () => true) {
  const source = fs.readFileSync(
    new URL("../src/app/estimates/builder/page.tsx", import.meta.url), "utf8",
  ).replace(/\r\n/g, "\n");
  const boundary = source.indexOf("  return (\n    <main", source.indexOf("function EstimateBuilder()"));
  assert.ok(boundary > 0, "Builder JSX boundary must exist");
  const harnessSource = source.slice(0, boundary) + `
    return {
      sections, totals, labourCost, labourHours, progress, expandedSections,
      buildUpItem, previousRateItem, allowanceItem, addItemModal, itemError,
      openBuildUp, addBuildUpLine, updateBuildUpLine, deleteBuildUpLine,
      updateQuantity, updateCostRate, updateSellRate, resetSellToTarget,
      changeTargetMargin, applyPreviousRate, openAllowance, applyAllowance,
      setPreviousRateItem, setAllowanceValue,
      addEstimateItem, setAddItemModal, setNewItemName, setNewItemQuantity,
      setNewItemUnit, setNewItemCost, setNewItemSell, setNewItemMethod,
      addEstimateSection, setNewSectionName, renameSection,
      updateItemDescription, updateItemUnit, deleteEstimateItem, deleteEstimateSection,
    };
  }
  export default EstimateBuilder;
  `;
  const transpile = (text) => ts.transpileModule(text, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 },
  }).outputText;
  const templates = {};
  vm.runInNewContext(transpile(fs.readFileSync(
    new URL("../src/lib/estimateTemplates.ts", import.meta.url), "utf8",
  )), { exports: templates });
  const states = [];
  let cursor = 0;
  const exportsObject = {};
  vm.runInNewContext(transpile(harnessSource), {
    exports: exportsObject,
    window: { confirm },
    require(name) {
      if (name === "@/lib/estimateTemplates") return templates;
      if (name === "react") return {
        useMemo: (calculate) => calculate(),
        useState(initial) {
          const index = cursor++;
          if (!(index in states)) states[index] = typeof initial === "function" ? initial() : initial;
          return [states[index], (value) => {
            states[index] = typeof value === "function" ? value(states[index]) : value;
          }];
        },
      };
      if (name === "next/navigation") return {
        useRouter: () => ({}),
        useSearchParams: () => new URLSearchParams(params),
      };
      throw new Error(`Unexpected import: ${name}`);
    },
  });
  return () => {
    cursor = 0;
    return exportsObject.default();
  };
}
