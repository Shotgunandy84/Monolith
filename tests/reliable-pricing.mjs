import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";

// Exercise the actual builder state handlers without a browser or extra packages.
// Only replace the JSX return; calculations and handlers remain unchanged.
const source = fs.readFileSync(
  new URL("../src/app/estimates/builder/page.tsx", import.meta.url),
  "utf8",
).replace(/\r\n/g, "\n");
const boundary = source.indexOf("  return (\n    <main", source.indexOf("function EstimateBuilder()"));
assert.ok(boundary > 0, "Builder JSX boundary must exist");
const harnessSource = source.slice(0, boundary) + `
  return {
    sections, totals, labourCost, labourHours,
    openBuildUp, addBuildUpLine, updateBuildUpLine, deleteBuildUpLine,
    updateQuantity, updateCostRate, updateSellRate, resetSellToTarget,
    changeTargetMargin, applyPreviousRate, openAllowance, applyAllowance,
    setPreviousRateItem, setAllowanceValue,
  };
}
export default EstimateBuilder;
`;
const states = [];
let cursor = 0;
const exportsObject = {};
vm.runInNewContext(ts.transpileModule(harnessSource, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 },
}).outputText, {
  exports: exportsObject,
  require(name) {
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
      useSearchParams: () => new URLSearchParams(),
    };
    throw new Error(`Unexpected import: ${name}`);
  },
});
function render() {
  cursor = 0;
  return exportsObject.default();
}
function item(state) {
  return state.sections.find((section) => section.id === 2).items.find((entry) => entry.id === 202);
}
function close(actual, expected) {
  assert.ok(Math.abs(actual - expected) < 1e-9, `${actual} should equal ${expected}`);
}

let state = render();
for (const section of state.sections) {
  for (const entry of section.items.filter((entry) => entry.source === "Built Up")) {
    const cost = entry.buildUp.reduce((sum, line) => sum + line.quantity * line.rate, 0);
    close(entry.costRate, cost);
    close(entry.sellRate, cost / 0.78);
  }
}
close(item(state).costRate, 18.4);
state.openBuildUp(2, 202);
state = render();
for (const line of [...item(state).buildUp]) state.deleteBuildUpLine(2, 202, line.id);
state = render();
close(item(state).costRate, 0);
state.addBuildUpLine();
state = render();
const lineId = item(state).buildUp[0].id;
state.updateBuildUpLine(2, 202, lineId, "rate", 100);
state.updateBuildUpLine(2, 202, lineId, "category", "Labour");
state.updateBuildUpLine(2, 202, lineId, "unit", "hr");
state.updateQuantity(2, 202, 3);
state = render();
close(item(state).costRate, 100);
close(item(state).quantity * item(state).costRate, 300);
close(item(state).sellRate, 100 / 0.78);
assert.equal(item(state).sellRate.toFixed(2), "128.21");
const otherDirectCost = state.totals.directCost - 300;
const otherLabourCost = state.labourCost - 300;
const otherLabourHours = state.labourHours - 3;
state.updateSellRate(2, 202, 150);
state.updateBuildUpLine(2, 202, lineId, "rate", 120);
state = render();
close(item(state).sellRate, 150);
close(state.totals.directCost, otherDirectCost + 360);
close(state.labourCost, otherLabourCost + 360);
close(state.labourHours, otherLabourHours + 3);
state.updateCostRate(2, 202, 999);
state = render();
close(item(state).costRate, 120);
state.changeTargetMargin(30);
state = render();
close(item(state).sellRate, 150);
state.resetSellToTarget(2, 202);
state = render();
close(item(state).sellRate, 120 / 0.7);
state.deleteBuildUpLine(2, 202, lineId);
state = render();
close(state.totals.directCost, otherDirectCost);
close(item(state).sellRate, 0);
state.addBuildUpLine();
state = render();
const restoredId = item(state).buildUp[0].id;
state.updateBuildUpLine(2, 202, restoredId, "rate", 100);
state.updateBuildUpLine(2, 202, restoredId, "category", "Labour");
state.setPreviousRateItem({ sectionId: 2, itemId: 202 });
state = render();
state.applyPreviousRate({ costRate: 42, sellRate: 55 });
state = render();
close(item(state).costRate, 42);
close(state.labourCost, otherLabourCost);
close(state.labourHours, otherLabourHours);
assert.equal(item(state).buildUp.length, 1, "Keep inactive build-up details");
state.openBuildUp(2, 202);
state = render();
close(item(state).costRate, 100);
close(item(state).sellRate, 55);
close(state.labourCost, otherLabourCost + 300);
state.openAllowance(2, 202);
state = render();
state.setAllowanceValue("80");
state = render();
state.applyAllowance();
state = render();
close(item(state).costRate, 80);
close(item(state).sellRate, 55);
close(state.labourCost, otherLabourCost);
close(state.labourHours, otherLabourHours);
close(state.totals.totalCost, state.totals.directCost * 1.15);
close(state.totals.grossProfit, state.totals.sellingPrice - state.totals.totalCost);
console.log("PASS: sample consistency, add/edit/delete, quantity totals, automatic/manual sell rates, pricing-method switches and unchanged overhead/contingency calculations.");
