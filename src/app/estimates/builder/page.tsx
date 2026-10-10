"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type BuildUpLine = {
  id: number;
  category: "Labour" | "Material" | "Plant" | "Subcontract" | "Other";
  description: string;
  quantity: number;
  unit: string;
  rate: number;
};

type EstimateItem = {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  costRate: number;
  sellRate: number;
  sellOverridden?: boolean;
  source: "Historical" | "Built Up" | "Allowance" | "Not priced";
  allowanceNote?: string;
  buildUp?: BuildUpLine[];
};

type EstimateSection = {
  id: number;
  name: string;
  items: EstimateItem[];
};

type PreviousRate = {
  id: number;
  itemName: string;
  project: string;
  projectType: string;
  date: string;
  costRate: number;
  sellRate: number;
  margin: number;
};

const previousRates: PreviousRate[] = [
  {
    id: 1,
    itemName: "External walls",
    project: "Wilson Extension",
    projectType: "Single Storey Extension",
    date: "Aug 2026",
    costRate: 68,
    sellRate: 88,
    margin: 22.7,
  },
  {
    id: 2,
    itemName: "External walls",
    project: "Jones Renovation",
    projectType: "Full House Renovation",
    date: "Jul 2026",
    costRate: 67,
    sellRate: 86,
    margin: 22.1,
  },
  {
    id: 3,
    itemName: "External walls",
    project: "McLean Extension",
    projectType: "Double Storey Extension",
    date: "May 2026",
    costRate: 64,
    sellRate: 82,
    margin: 22.0,
  },
  {
    id: 4,
    itemName: "External walls",
    project: "Campbell New Build",
    projectType: "New Build House",
    date: "Mar 2026",
    costRate: 61,
    sellRate: 79,
    margin: 22.8,
  },
  {
    id: 5,
    itemName: "Excavation",
    project: "Wilson Extension",
    projectType: "Single Storey Extension",
    date: "Aug 2026",
    costRate: 42,
    sellRate: 55,
    margin: 23.6,
  },
  {
    id: 6,
    itemName: "Excavation",
    project: "Jones Renovation",
    projectType: "Full House Renovation",
    date: "Jul 2026",
    costRate: 40,
    sellRate: 52,
    margin: 23.1,
  },
  {
    id: 7,
    itemName: "Plastering",
    project: "Wilson Extension",
    projectType: "Single Storey Extension",
    date: "Aug 2026",
    costRate: 18,
    sellRate: 23,
    margin: 21.7,
  },
  {
    id: 8,
    itemName: "Plastering",
    project: "McLean Extension",
    projectType: "Double Storey Extension",
    date: "May 2026",
    costRate: 17,
    sellRate: 22,
    margin: 22.7,
  },
];

const initialSections: EstimateSection[] = [
  {
    id: 1,
    name: "Preliminaries",
    items: [
      {
        id: 101,
        name: "Site setup",
        quantity: 1,
        unit: "item",
        costRate: 1200,
        sellRate: 1500,
        source: "Historical",
      },
      {
        id: 102,
        name: "Welfare",
        quantity: 1,
        unit: "item",
        costRate: 450,
        sellRate: 560,
        source: "Historical",
      },
      {
        id: 103,
        name: "Waste & skips",
        quantity: 1,
        unit: "item",
        costRate: 800,
        sellRate: 950,
        source: "Allowance",
        allowanceNote: "Provisional allowance for skips and waste disposal.",
      },
    ],
  },
  {
    id: 2,
    name: "Groundworks",
    items: [
      {
        id: 201,
        name: "Site clearance",
        quantity: 1,
        unit: "item",
        costRate: 650,
        sellRate: 800,
        source: "Historical",
      },
      {
        id: 202,
        name: "Excavation",
        quantity: 32,
        unit: "m³",
        costRate: 42,
        sellRate: 55,
        source: "Built Up",
        buildUp: [
          {
            id: 2021,
            category: "Labour",
            description: "Groundworker",
            quantity: 0.35,
            unit: "hr",
            rate: 32,
          },
          {
            id: 2022,
            category: "Plant",
            description: "Mini excavator",
            quantity: 0.12,
            unit: "hr",
            rate: 45,
          },
          {
            id: 2023,
            category: "Other",
            description: "Small tools / sundries",
            quantity: 1,
            unit: "item",
            rate: 1.8,
          },
        ],
      },
      {
        id: 203,
        name: "Foundations",
        quantity: 35,
        unit: "m",
        costRate: 118,
        sellRate: 150,
        source: "Historical",
      },
      {
        id: 204,
        name: "Drainage",
        quantity: 1,
        unit: "item",
        costRate: 1200,
        sellRate: 1500,
        source: "Not priced",
      },
      {
        id: 205,
        name: "Concrete",
        quantity: 12,
        unit: "m³",
        costRate: 145,
        sellRate: 185,
        source: "Historical",
      },
    ],
  },
  {
    id: 3,
    name: "Structure",
    items: [
      {
        id: 301,
        name: "External walls",
        quantity: 82,
        unit: "m²",
        costRate: 64,
        sellRate: 82,
        source: "Historical",
      },
      {
        id: 302,
        name: "Steelwork",
        quantity: 1,
        unit: "item",
        costRate: 6000,
        sellRate: 5200,
        sellOverridden: true,
        source: "Allowance",
        allowanceNote: "Allowance pending structural steel design.",
      },
      {
        id: 303,
        name: "Internal walls",
        quantity: 42,
        unit: "m²",
        costRate: 48,
        sellRate: 62,
        source: "Built Up",
        buildUp: [
          {
            id: 3031,
            category: "Labour",
            description: "Bricklayer",
            quantity: 0.3,
            unit: "hr",
            rate: 32,
          },
          {
            id: 3032,
            category: "Labour",
            description: "Labourer",
            quantity: 0.2,
            unit: "hr",
            rate: 25,
          },
          {
            id: 3033,
            category: "Material",
            description: "Blocks",
            quantity: 10,
            unit: "no",
            rate: 1.1,
          },
          {
            id: 3034,
            category: "Material",
            description: "Mortar",
            quantity: 0.01,
            unit: "t",
            rate: 140,
          },
        ],
      },
    ],
  },
  {
    id: 4,
    name: "Roof",
    items: [
      {
        id: 401,
        name: "Roof structure",
        quantity: 55,
        unit: "m²",
        costRate: 72,
        sellRate: 92,
        source: "Historical",
      },
      {
        id: 402,
        name: "Roof covering",
        quantity: 55,
        unit: "m²",
        costRate: 64,
        sellRate: 82,
        source: "Historical",
      },
      {
        id: 403,
        name: "Gutters & fascia",
        quantity: 24,
        unit: "m",
        costRate: 28,
        sellRate: 36,
        source: "Historical",
      },
    ],
  },
  {
    id: 5,
    name: "Windows & Doors",
    items: [
      {
        id: 501,
        name: "Windows",
        quantity: 5,
        unit: "item",
        costRate: 850,
        sellRate: 1080,
        source: "Historical",
      },
      {
        id: 502,
        name: "External doors",
        quantity: 2,
        unit: "item",
        costRate: 1100,
        sellRate: 1400,
        source: "Historical",
      },
    ],
  },
  {
    id: 6,
    name: "Internal Works",
    items: [
      {
        id: 601,
        name: "Plastering",
        quantity: 180,
        unit: "m²",
        costRate: 18,
        sellRate: 23,
        source: "Historical",
      },
      {
        id: 602,
        name: "Internal doors",
        quantity: 6,
        unit: "item",
        costRate: 275,
        sellRate: 350,
        source: "Historical",
      },
      {
        id: 603,
        name: "Flooring",
        quantity: 45,
        unit: "m²",
        costRate: 32,
        sellRate: 42,
        source: "Allowance",
        allowanceNote: "Final floor finish to be selected by client.",
      },
      {
        id: 604,
        name: "Decoration",
        quantity: 180,
        unit: "m²",
        costRate: 14,
        sellRate: 18,
        source: "Built Up",
        buildUp: [
          {
            id: 6041,
            category: "Labour",
            description: "Decorator",
            quantity: 0.18,
            unit: "hr",
            rate: 30,
          },
          {
            id: 6042,
            category: "Material",
            description: "Paint & sundries",
            quantity: 1,
            unit: "item",
            rate: 8.6,
          },
        ],
      },
    ],
  },
  {
    id: 7,
    name: "Services",
    items: [
      {
        id: 701,
        name: "Electrical",
        quantity: 1,
        unit: "item",
        costRate: 5800,
        sellRate: 7200,
        source: "Historical",
      },
      {
        id: 702,
        name: "Plumbing",
        quantity: 1,
        unit: "item",
        costRate: 4200,
        sellRate: 5200,
        source: "Historical",
      },
      {
        id: 703,
        name: "Heating",
        quantity: 1,
        unit: "item",
        costRate: 2500,
        sellRate: 3100,
        source: "Allowance",
        allowanceNote: "Heating system subject to final specification.",
      },
    ],
  },
  {
    id: 8,
    name: "Completion",
    items: [
      {
        id: 801,
        name: "Snagging",
        quantity: 1,
        unit: "item",
        costRate: 600,
        sellRate: 750,
        source: "Historical",
      },
      {
        id: 802,
        name: "Final clean",
        quantity: 1,
        unit: "item",
        costRate: 350,
        sellRate: 440,
        source: "Historical",
      },
    ],
  },
];

function money(value: number) {
  return value.toLocaleString("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  });
}

function preciseMoney(value: number) {
  return value.toLocaleString("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function calculatedSellRate(costRate: number, targetMargin: number) {
  if (targetMargin >= 100) {
    return costRate;
  }

  return costRate / (1 - targetMargin / 100);
}

function withBuildUpPricing(
  item: EstimateItem,
  buildUp: BuildUpLine[],
  targetMargin: number,
): EstimateItem {
  const costRate = buildUp.reduce(
    (total, line) => total + line.quantity * line.rate,
    0,
  );

  return {
    ...item,
    buildUp,
    source: "Built Up",
    costRate,
    sellRate: item.sellOverridden
      ? item.sellRate
      : calculatedSellRate(costRate, targetMargin),
  };
}

function EstimateBuilder() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const projectName = searchParams.get("project") || "Smith Extension";

  const clientName = searchParams.get("client") || "John Smith";

  const template = searchParams.get("template") || "Single Storey Extension";

  const area = searchParams.get("area") || "45";

  const [sections, setSections] = useState<EstimateSection[]>(() =>
    initialSections.map((section) => ({
      ...section,
      items: section.items.map((item) =>
        item.source === "Built Up"
          ? withBuildUpPricing(item, item.buildUp || [], 22)
          : item,
      ),
    })),
  );

  const [expandedSections, setExpandedSections] = useState<number[]>([1, 2, 3]);

  const [buildUpItem, setBuildUpItem] = useState<{
    sectionId: number;
    itemId: number;
  } | null>(null);

  const [previousRateItem, setPreviousRateItem] = useState<{
    sectionId: number;
    itemId: number;
  } | null>(null);

  const [allowanceItem, setAllowanceItem] = useState<{
    sectionId: number;
    itemId: number;
  } | null>(null);

  const [rateSearch, setRateSearch] = useState("");

  const [allowanceValue, setAllowanceValue] = useState("");

  const [allowanceNote, setAllowanceNote] = useState("");

  const [targetMargin, setTargetMargin] = useState(22);

  const [showCommercial, setShowCommercial] = useState(false);

  const [addItemModal, setAddItemModal] = useState<{
    sectionId: number;
  } | null>(null);

  const [newItemName, setNewItemName] = useState("");
  const [newItemQuantity, setNewItemQuantity] = useState("1");
  const [newItemUnit, setNewItemUnit] = useState("item");

  const [newItemMethod, setNewItemMethod] = useState<
    "Historical" | "Built Up" | "Allowance"
  >("Historical");

  const overheadPercent = 10;
  const contingencyPercent = 5;

  const activeBuildUpItem = useMemo(() => {
    if (!buildUpItem) return null;

    const section = sections.find((item) => item.id === buildUpItem.sectionId);

    const item = section?.items.find((item) => item.id === buildUpItem.itemId);

    if (!section || !item) return null;

    return {
      section,
      item,
    };
  }, [buildUpItem, sections]);

  const activePreviousRateItem = useMemo(() => {
    if (!previousRateItem) return null;

    const section = sections.find(
      (item) => item.id === previousRateItem.sectionId,
    );

    const item = section?.items.find(
      (item) => item.id === previousRateItem.itemId,
    );

    if (!section || !item) return null;

    return {
      section,
      item,
    };
  }, [previousRateItem, sections]);

  const activeAllowanceItem = useMemo(() => {
    if (!allowanceItem) return null;

    const section = sections.find(
      (item) => item.id === allowanceItem.sectionId,
    );

    const item = section?.items.find(
      (item) => item.id === allowanceItem.itemId,
    );

    if (!section || !item) return null;

    return {
      section,
      item,
    };
  }, [allowanceItem, sections]);

  const matchingPreviousRates = useMemo(() => {
    if (!activePreviousRateItem) return [];

    const search = rateSearch.trim().toLowerCase();

    return previousRates.filter((rate) => {
      const itemMatches =
        rate.itemName.toLowerCase() ===
        activePreviousRateItem.item.name.toLowerCase();

      if (!itemMatches) return false;

      if (!search) return true;

      return (
        rate.project.toLowerCase().includes(search) ||
        rate.projectType.toLowerCase().includes(search) ||
        rate.date.toLowerCase().includes(search)
      );
    });
  }, [activePreviousRateItem, rateSearch]);

  const totals = useMemo(() => {
    let directCost = 0;
    let sellingPrice = 0;

    sections.forEach((section) => {
      section.items.forEach((item) => {
        directCost += item.quantity * item.costRate;

        sellingPrice += item.quantity * item.sellRate;
      });
    });

    const overheads = directCost * (overheadPercent / 100);

    const contingency = directCost * (contingencyPercent / 100);

    const totalCost = directCost + overheads + contingency;

    const grossProfit = sellingPrice - totalCost;

    const margin = sellingPrice > 0 ? (grossProfit / sellingPrice) * 100 : 0;

    const markup = totalCost > 0 ? (grossProfit / totalCost) * 100 : 0;

    return {
      directCost,
      overheads,
      contingency,
      totalCost,
      sellingPrice,
      grossProfit,
      margin,
      markup,
    };
  }, [sections]);

  const pricedItems = sections.flatMap((section) => section.items);

  const pricedCount = pricedItems.filter(
    (item) => item.source !== "Not priced",
  ).length;

  const progress = Math.round((pricedCount / pricedItems.length) * 100);

  const labourHours = sections.reduce(
    (total, section) =>
      total +
      section.items.reduce(
        (itemTotal, item) =>
          itemTotal +
          (item.source === "Built Up" ? item.buildUp || [] : [])
            .filter((line) => line.category === "Labour")
            .reduce(
              (lineTotal, line) => lineTotal + line.quantity * item.quantity,
              0,
            ),
        0,
      ),
    0,
  );

  const labourCost = sections.reduce(
    (total, section) =>
      total +
      section.items.reduce(
        (itemTotal, item) =>
          itemTotal +
          (item.source === "Built Up" ? item.buildUp || [] : [])
            .filter((line) => line.category === "Labour")
            .reduce(
              (lineTotal, line) =>
                lineTotal + line.quantity * line.rate * item.quantity,
              0,
            ),
        0,
      ),
    0,
  );
  function addEstimateItem() {
    if (!addItemModal || !newItemName.trim()) {
      return;
    }

    const sectionId = addItemModal.sectionId;
    const itemId = Date.now();

    const quantity = Number(newItemQuantity) || 1;

    const newItem: EstimateItem = {
      id: itemId,
      name: newItemName.trim(),
      quantity,
      unit: newItemUnit.trim() || "item",
      costRate: 0,
      sellRate: 0,
      source: newItemMethod,
      ...(newItemMethod === "Built Up"
        ? {
            buildUp: [],
          }
        : {}),
      ...(newItemMethod === "Allowance"
        ? {
            allowanceNote: "",
          }
        : {}),
    };

    setSections((current) =>
      current.map((section) =>
        section.id !== sectionId
          ? section
          : {
              ...section,
              items: [...section.items, newItem],
            },
      ),
    );

    setExpandedSections((current) =>
      current.includes(sectionId) ? current : [...current, sectionId],
    );

    setAddItemModal(null);

    setNewItemName("");
    setNewItemQuantity("1");
    setNewItemUnit("item");
    setNewItemMethod("Historical");

    if (newItemMethod === "Built Up") {
      setBuildUpItem({
        sectionId,
        itemId,
      });
    }

    if (newItemMethod === "Allowance") {
      setAllowanceItem({
        sectionId,
        itemId,
      });

      setAllowanceValue("");
      setAllowanceNote("");
    }

    if (newItemMethod === "Historical") {
      setPreviousRateItem({
        sectionId,
        itemId,
      });

      setRateSearch("");
    }
  }
  function toggleSection(id: number) {
    setExpandedSections((current) =>
      current.includes(id)
        ? current.filter((sectionId) => sectionId !== id)
        : [...current, id],
    );
  }

  function updateQuantity(sectionId: number, itemId: number, value: number) {
    setSections((current) =>
      current.map((section) =>
        section.id !== sectionId
          ? section
          : {
              ...section,
              items: section.items.map((item) =>
                item.id !== itemId
                  ? item
                  : {
                      ...item,
                      quantity: value,
                    },
              ),
            },
      ),
    );
  }

  function updateCostRate(sectionId: number, itemId: number, value: number) {
    setSections((current) =>
      current.map((section) =>
        section.id !== sectionId
          ? section
          : {
              ...section,
              items: section.items.map((item) => {
                if (item.id !== itemId || item.source === "Built Up") {
                  return item;
                }

                const newSell = item.sellOverridden
                  ? item.sellRate
                  : calculatedSellRate(value, targetMargin);

                return {
                  ...item,
                  costRate: value,
                  sellRate: newSell,
                };
              }),
            },
      ),
    );
  }

  function updateSellRate(sectionId: number, itemId: number, value: number) {
    setSections((current) =>
      current.map((section) =>
        section.id !== sectionId
          ? section
          : {
              ...section,
              items: section.items.map((item) =>
                item.id !== itemId
                  ? item
                  : {
                      ...item,
                      sellRate: value,
                      sellOverridden: true,
                    },
              ),
            },
      ),
    );
  }

  function resetSellToTarget(sectionId: number, itemId: number) {
    setSections((current) =>
      current.map((section) =>
        section.id !== sectionId
          ? section
          : {
              ...section,
              items: section.items.map((item) =>
                item.id !== itemId
                  ? item
                  : {
                      ...item,
                      sellRate: calculatedSellRate(item.costRate, targetMargin),
                      sellOverridden: false,
                    },
              ),
            },
      ),
    );
  }

  function openBuildUp(sectionId: number, itemId: number) {
    setSections((current) =>
      current.map((section) =>
        section.id !== sectionId
          ? section
          : {
              ...section,
              items: section.items.map((item) =>
                item.id !== itemId
                  ? item
                  : withBuildUpPricing(item, item.buildUp || [], targetMargin),
              ),
            },
      ),
    );
    setBuildUpItem({ sectionId, itemId });
  }

  function updateBuildUpLine(
    sectionId: number,
    itemId: number,
    lineId: number,
    field: "quantity" | "rate" | "description" | "unit" | "category",
    value: number | string,
  ) {
    setSections((current) =>
      current.map((section) =>
        section.id !== sectionId
          ? section
          : {
              ...section,
              items: section.items.map((item) =>
                item.id !== itemId
                  ? item
                  : withBuildUpPricing(
                      item,
                      (item.buildUp || []).map((line) =>
                        line.id !== lineId
                          ? line
                          : {
                              ...line,
                              [field]: value,
                            },
                      ),
                      targetMargin,
                    ),
              ),
            },
      ),
    );
  }

  function addBuildUpLine() {
    if (!activeBuildUpItem) return;

    const newLine: BuildUpLine = {
      id: Date.now(),
      category: "Material",
      description: "New item",
      quantity: 1,
      unit: "item",
      rate: 0,
    };

    setSections((current) =>
      current.map((section) =>
        section.id !== activeBuildUpItem.section.id
          ? section
          : {
              ...section,
              items: section.items.map((item) =>
                item.id !== activeBuildUpItem.item.id
                  ? item
                  : withBuildUpPricing(
                      item,
                      [...(item.buildUp || []), newLine],
                      targetMargin,
                    ),
              ),
            },
      ),
    );
  }

  function deleteBuildUpLine(
    sectionId: number,
    itemId: number,
    lineId: number,
  ) {
    setSections((current) =>
      current.map((section) =>
        section.id !== sectionId
          ? section
          : {
              ...section,
              items: section.items.map((item) =>
                item.id !== itemId
                  ? item
                  : withBuildUpPricing(
                      item,
                      (item.buildUp || []).filter(
                        (line) => line.id !== lineId,
                      ),
                      targetMargin,
                    ),
              ),
            },
      ),
    );
  }

  function openAllowance(sectionId: number, itemId: number) {
    const section = sections.find((item) => item.id === sectionId);

    const item = section?.items.find((item) => item.id === itemId);

    setAllowanceValue(item ? String(item.costRate) : "");

    setAllowanceNote(item?.allowanceNote || "");

    setAllowanceItem({
      sectionId,
      itemId,
    });
  }

  function applyAllowance() {
    if (!activeAllowanceItem) return;

    const value = Number(allowanceValue);

    if (!Number.isFinite(value) || value < 0) {
      return;
    }

    setSections((current) =>
      current.map((section) =>
        section.id !== activeAllowanceItem.section.id
          ? section
          : {
              ...section,
              items: section.items.map((item) =>
                item.id !== activeAllowanceItem.item.id
                  ? item
                  : {
                      ...item,
                      costRate: value,
                      sellRate: item.sellOverridden
                        ? item.sellRate
                        : calculatedSellRate(value, targetMargin),
                      source: "Allowance",
                      allowanceNote: allowanceNote.trim(),
                    },
              ),
            },
      ),
    );

    setAllowanceItem(null);
    setAllowanceValue("");
    setAllowanceNote("");
  }

  function applyPreviousRate(rate: PreviousRate) {
    if (!activePreviousRateItem) return;

    setSections((current) =>
      current.map((section) =>
        section.id !== activePreviousRateItem.section.id
          ? section
          : {
              ...section,
              items: section.items.map((item) =>
                item.id !== activePreviousRateItem.item.id
                  ? item
                  : {
                      ...item,
                      costRate: rate.costRate,
                      sellRate: rate.sellRate,
                      sellOverridden: true,
                      source: "Historical",
                    },
              ),
            },
      ),
    );

    setPreviousRateItem(null);
    setRateSearch("");
  }

  function changeTargetMargin(value: number) {
    const safeValue = Math.min(Math.max(value, 0), 80);

    setTargetMargin(safeValue);

    setSections((current) =>
      current.map((section) => ({
        ...section,
        items: section.items.map((item) =>
          item.sellOverridden
            ? item
            : {
                ...item,
                sellRate: calculatedSellRate(item.costRate, safeValue),
              },
        ),
      })),
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f4ee] text-[#25231f]">
      <header className="sticky top-0 z-30 border-b border-[#ded8cc] bg-[#f7f4ee]/95 backdrop-blur">
        <div className="px-5 py-5 sm:px-8 lg:px-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <button
                onClick={() => router.push("/templates")}
                className="mb-3 text-sm text-[#8a6846] hover:text-[#6f5238]"
              >
                ← Templates
              </button>

              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-serif text-3xl tracking-tight">
                  {projectName}
                </h1>

                <span className="rounded-full bg-[#eee7dc] px-3 py-1 text-[10px] uppercase tracking-[0.12em] text-[#8a6846]">
                  Draft
                </span>
              </div>

              <p className="mt-1 text-sm text-[#918a80]">
                {clientName} · {template} · {area} m²
              </p>
            </div>

            <button
              onClick={() => setShowCommercial(!showCommercial)}
              className="rounded-xl border border-[#cfc7ba] bg-[#fbfaf7] px-4 py-3 text-sm font-medium text-[#6f5b47] transition hover:bg-white"
            >
              {showCommercial ? "Hide commercial" : "View commercial"}
            </button>
          </div>

          <div className="mt-5">
            <div className="mb-2 flex justify-between text-xs text-[#918a80]">
              <span>Estimate progress</span>

              <span>{progress}% priced</span>
            </div>

            <div className="h-1.5 overflow-hidden rounded-full bg-[#e5dfd5]">
              <div
                className="h-full rounded-full bg-[#9b7650] transition-all"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="grid lg:grid-cols-[1fr_340px]">
        <section className="px-5 py-7 sm:px-8 lg:px-10">
          <div className="mb-6">
            <h2 className="font-serif text-2xl">Estimate</h2>

            <p className="mt-1 text-sm text-[#918a80]">
              Build your estimate from previous rates, allowances or detailed
              cost build-ups.
            </p>
          </div>

          <div className="space-y-3">
            {sections.map((section) => {
              const expanded = expandedSections.includes(section.id);

              const sectionSellTotal = section.items.reduce(
                (total, item) => total + item.quantity * item.sellRate,
                0,
              );

              return (
                <section
                  key={section.id}
                  className="overflow-hidden rounded-2xl border border-[#ded8cc] bg-[#fbfaf7]"
                >
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="flex w-full items-center justify-between px-5 py-4 text-left transition hover:bg-[#f8f5ef]"
                  >
                    <div className="flex items-center gap-4">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#eee7dc] text-xs font-medium text-[#8a6846]">
                        {String(section.id).padStart(2, "0")}
                      </span>

                      <div>
                        <div className="font-medium">{section.name}</div>

                        <div className="mt-0.5 text-xs text-[#918a80]">
                          {section.items.length} items
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-5">
                      <div className="hidden text-right sm:block">
                        <div className="font-serif text-lg">
                          {money(sectionSellTotal)}
                        </div>

                        <div className="text-[10px] text-[#918a80]">
                          sell value
                        </div>
                      </div>

                      <span className="text-[#8a6846]">
                        {expanded ? "−" : "+"}
                      </span>
                    </div>
                  </button>

                  {expanded && (
                    <div className="border-t border-[#e7e2d9]">
                      <div className="hidden border-b border-[#e7e2d9] bg-[#f7f4ee] px-5 py-3 lg:grid lg:grid-cols-[1fr_100px_80px_120px_120px_120px] lg:gap-4">
                        <div className="text-[10px] uppercase tracking-[0.08em] text-[#a0988d]">
                          Work item
                        </div>

                        <div className="text-[10px] uppercase tracking-[0.08em] text-[#a0988d]">
                          Quantity
                        </div>

                        <div className="text-[10px] uppercase tracking-[0.08em] text-[#a0988d]">
                          Unit
                        </div>

                        <div>
                          <div className="text-[10px] uppercase tracking-[0.08em] text-[#7c5d3d]">
                            Cost / unit
                          </div>

                          <div className="mt-0.5 text-[9px] text-[#a0988d]">
                            Your business cost
                          </div>
                        </div>

                        <div>
                          <div className="text-[10px] uppercase tracking-[0.08em] text-[#7c5d3d]">
                            Sell / unit
                          </div>

                          <div className="mt-0.5 text-[9px] text-[#a0988d]">
                            Customer price
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-[10px] uppercase tracking-[0.08em] text-[#a0988d]">
                            Cost total
                          </div>
                        </div>
                      </div>

                      {section.items.map((item) => {
                        const costTotal = item.quantity * item.costRate;

                        const sellTotal = item.quantity * item.sellRate;

                        const lineGP = sellTotal - costTotal;

                        const lineMargin =
                          sellTotal > 0 ? (lineGP / sellTotal) * 100 : 0;

                        const isLoss = lineGP < 0;

                        return (
                          <div
                            key={item.id}
                            className={`border-b border-[#e7e2d9] last:border-b-0 ${
                              isLoss ? "bg-[#fff8f5]" : ""
                            }`}
                          >
                            <div className="px-5 py-4">
                              <div className="grid gap-4 lg:grid-cols-[1fr_100px_80px_120px_120px_120px] lg:items-center">
                                <div>
                                  <div className="font-medium">{item.name}</div>

                                  <div className="mt-1 flex flex-wrap items-center gap-2">
                                    <span
                                      className={`rounded-full px-2 py-0.5 text-[10px] ${
                                        item.source === "Historical"
                                          ? "bg-[#eee7dc] text-[#7c5d3d]"
                                          : item.source === "Built Up"
                                            ? "bg-[#e7eee7] text-[#526452]"
                                            : item.source === "Allowance"
                                              ? "bg-[#eee9df] text-[#776b55]"
                                              : "bg-[#f1e5df] text-[#8a5d48]"
                                      }`}
                                    >
                                      {item.source}
                                    </span>

                                    {isLoss && (
                                      <span className="rounded-full bg-[#f3dcd4] px-2 py-0.5 text-[10px] font-medium text-[#8a4f3e]">
                                        Loss making
                                      </span>
                                    )}

                                    {item.source === "Allowance" &&
                                      item.allowanceNote && (
                                        <span className="text-[11px] text-[#918a80]">
                                          {item.allowanceNote}
                                        </span>
                                      )}
                                  </div>
                                </div>

                                <div>
                                  <label className="mb-1 block text-[10px] uppercase tracking-[0.08em] text-[#a0988d] lg:hidden">
                                    Quantity
                                  </label>

                                  <input
                                    type="number"
                                    value={item.quantity}
                                    onChange={(event) =>
                                      updateQuantity(
                                        section.id,
                                        item.id,
                                        Number(event.target.value),
                                      )
                                    }
                                    className="w-full rounded-lg border border-[#d8d1c5] bg-white px-3 py-2 text-sm outline-none focus:border-[#9b7650]"
                                  />
                                </div>

                                <div>
                                  <label className="mb-1 block text-[10px] uppercase tracking-[0.08em] text-[#a0988d] lg:hidden">
                                    Unit
                                  </label>

                                  <div className="rounded-lg bg-[#eeeae2] px-3 py-2 text-center text-sm text-[#777168]">
                                    {item.unit}
                                  </div>
                                </div>

                                <div>
                                  <label className="mb-1 block text-[10px] uppercase tracking-[0.08em] text-[#7c5d3d] lg:hidden">
                                    Cost / unit
                                  </label>

                                  <div className="relative">
                                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#918a80]">
                                      £
                                    </span>

                                    <input
                                      type="number"
                                      value={item.costRate}
                                      readOnly={item.source === "Built Up"}
                                      onChange={(event) =>
                                        updateCostRate(
                                          section.id,
                                          item.id,
                                          Number(event.target.value),
                                        )
                                      }
                                      className="w-full rounded-lg border border-[#d8d1c5] bg-white py-2 pl-7 pr-3 text-sm outline-none focus:border-[#9b7650]"
                                    />
                                  </div>

                                  <div className="mt-1 text-[9px] text-[#a0988d]">
                                    Your business cost
                                  </div>
                                </div>

                                <div>
                                  <label className="mb-1 block text-[10px] uppercase tracking-[0.08em] text-[#7c5d3d] lg:hidden">
                                    Sell / unit
                                  </label>

                                  <div className="relative">
                                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#918a80]">
                                      £
                                    </span>

                                    <input
                                      type="number"
                                      value={Number(item.sellRate.toFixed(2))}
                                      onChange={(event) =>
                                        updateSellRate(
                                          section.id,
                                          item.id,
                                          Number(event.target.value),
                                        )
                                      }
                                      className={`w-full rounded-lg border bg-white py-2 pl-7 pr-3 text-sm outline-none focus:border-[#9b7650] ${
                                        isLoss
                                          ? "border-[#c98570]"
                                          : "border-[#d8d1c5]"
                                      }`}
                                    />
                                  </div>

                                  <div className="mt-1 flex items-center justify-between gap-1">
                                    <span className="text-[9px] text-[#a0988d]">
                                      {item.sellOverridden
                                        ? "Manual"
                                        : "Calculated"}
                                    </span>

                                    {item.sellOverridden && (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          resetSellToTarget(section.id, item.id)
                                        }
                                        className="text-[9px] text-[#8a6846] hover:underline"
                                      >
                                        Reset
                                      </button>
                                    )}
                                  </div>
                                </div>

                                <div className="text-left lg:text-right">
                                  <label className="mb-1 block text-[10px] uppercase tracking-[0.08em] text-[#a0988d] lg:hidden">
                                    Cost total
                                  </label>

                                  <div className="font-serif text-lg">
                                    {money(costTotal)}
                                  </div>

                                  <div
                                    className={`mt-1 text-[10px] ${
                                      isLoss
                                        ? "text-[#9b503d]"
                                        : "text-[#918a80]"
                                    }`}
                                  >
                                    GP {money(lineGP)} · {lineMargin.toFixed(1)}
                                    %
                                  </div>
                                </div>
                              </div>

                              <div className="mt-3 rounded-lg bg-[#f7f4ee] px-3 py-2 text-[10px] text-[#918a80] lg:hidden">
                                <strong className="text-[#7c5d3d]">
                                  Cost / unit
                                </strong>{" "}
                                = what this work costs your business.
                                {"  "}
                                <strong className="text-[#7c5d3d]">
                                  Sell / unit
                                </strong>{" "}
                                = what you charge the customer.
                              </div>

                              <div className="mt-4 flex flex-wrap gap-2">
                                <button
                                  onClick={() =>
                                    openBuildUp(section.id, item.id)
                                  }
                                  className="rounded-lg bg-[#eee7dc] px-3 py-2 text-xs font-medium text-[#7c5d3d] transition hover:bg-[#e7dece]"
                                >
                                  Build Up
                                </button>

                                <button
                                  onClick={() => {
                                    setPreviousRateItem({
                                      sectionId: section.id,
                                      itemId: item.id,
                                    });

                                    setRateSearch("");
                                  }}
                                  className="rounded-lg border border-[#d8d1c5] bg-white px-3 py-2 text-xs text-[#777168] transition hover:bg-[#f8f5ef]"
                                >
                                  Previous Rates
                                </button>

                                <button
                                  onClick={() =>
                                    openAllowance(section.id, item.id)
                                  }
                                  className={`rounded-lg border px-3 py-2 text-xs transition ${
                                    item.source === "Allowance"
                                      ? "border-[#b89977] bg-[#eee9df] text-[#7c5d3d]"
                                      : "border-[#d8d1c5] bg-white text-[#777168] hover:bg-[#f8f5ef]"
                                  }`}
                                >
                                  {item.source === "Allowance"
                                    ? "Edit Allowance"
                                    : "Allowance"}
                                </button>

                                <button className="rounded-lg border border-[#d8d1c5] bg-white px-3 py-2 text-xs text-[#777168] transition hover:bg-[#f8f5ef]">
                                  Note
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      <button
                        onClick={() => {
                          setAddItemModal({
                            sectionId: section.id,
                          });

                          setNewItemName("");
                          setNewItemQuantity("1");
                          setNewItemUnit("item");
                          setNewItemMethod("Historical");
                        }}
                        className="w-full px-5 py-3 text-left text-xs font-medium text-[#8a6846] transition hover:bg-[#f8f5ef]"
                      >
                        + Add item
                      </button>
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        </section>

        <aside className="border-l border-[#ded8cc] bg-[#fbfaf7]">
          <div className="sticky top-[137px] p-6">
            <div className="mb-6">
              <div className="text-xs uppercase tracking-[0.16em] text-[#918a80]">
                Commercial
              </div>

              <h2 className="mt-2 font-serif text-2xl">Current position</h2>
            </div>

            {/* TARGET MARGIN */}

            <div className="mb-6 rounded-2xl border border-[#ded8cc] bg-[#f7f4ee] p-4">
              <div className="flex items-start justify-between gap-6">
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium">Target margin</div>

                  <p className="mt-1 max-w-[190px] text-[11px] leading-4 text-[#918a80]">
                    Used to automatically calculate your selling rates.
                  </p>
                </div>

                <div className="relative w-28 shrink-0">
                  <input
                    type="number"
                    min="0"
                    max="80"
                    step="0.5"
                    value={targetMargin}
                    onChange={(event) =>
                      changeTargetMargin(Number(event.target.value))
                    }
                    className="w-full rounded-lg border border-[#d8d1c5] bg-white px-3 py-2 pr-8 text-right text-base font-medium outline-none focus:border-[#9b7650]"
                  />

                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#918a80]">
                    %
                  </span>
                </div>
              </div>

              <div className="mt-4 border-t border-[#ded8cc] pt-3 text-[10px] leading-4 text-[#918a80]">
                Example: £100 cost at {targetMargin}% margin = £
                {calculatedSellRate(100, targetMargin).toFixed(2)} selling
                price.
              </div>
            </div>

            <div className="space-y-5">
              <CommercialRow
                label="Direct cost"
                value={money(totals.directCost)}
              />

              <CommercialRow
                label="Overheads"
                value={money(totals.overheads)}
                muted
              />

              <CommercialRow
                label="Contingency"
                value={money(totals.contingency)}
                muted
              />

              <div className="border-t border-[#ded8cc] pt-5">
                <CommercialRow
                  label="Total cost"
                  value={money(totals.totalCost)}
                  large
                />
              </div>

              <div className="rounded-2xl bg-[#292721] p-5 text-[#f7f4ee]">
                <div className="text-xs uppercase tracking-[0.14em] text-[#bda88e]">
                  Selling price
                </div>

                <div className="mt-2 font-serif text-3xl">
                  {money(totals.sellingPrice)}
                </div>

                <div className="mt-5 grid grid-cols-2 gap-4 border-t border-[#4a463e] pt-4">
                  <div>
                    <div className="text-xs text-[#aaa297]">GP</div>

                    <div className="mt-1 font-serif text-lg">
                      {money(totals.grossProfit)}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-[#aaa297]">Margin</div>

                    <div className="mt-1 font-serif text-lg">
                      {totals.margin.toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-[#ded8cc] p-4">
                  <div className="text-xs text-[#918a80]">Markup</div>

                  <div className="mt-2 font-serif text-xl">
                    {totals.markup.toFixed(1)}%
                  </div>
                </div>

                <div className="rounded-xl border border-[#ded8cc] p-4">
                  <div className="text-xs text-[#918a80]">Labour hours</div>

                  <div className="mt-2 font-serif text-xl">
                    {labourHours.toFixed(1)}
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-[#ded8cc] p-4">
                <div className="text-xs text-[#918a80]">
                  Labour cost from build-ups
                </div>

                <div className="mt-2 font-serif text-xl">
                  {money(labourCost)}
                </div>
              </div>

              <button
                onClick={() => router.push("/reports")}
                className="w-full rounded-xl bg-[#9b7650] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#886746]"
              >
                Review Estimate →
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* BUILD UP DRAWER */}

      {activeBuildUpItem && (
        <div className="fixed inset-0 z-50">
          <button
            aria-label="Close build up"
            onClick={() => setBuildUpItem(null)}
            className="absolute inset-0 bg-[#25231f]/30 backdrop-blur-[2px]"
          />

          <aside className="absolute right-0 top-0 h-full w-full max-w-2xl overflow-y-auto border-l border-[#ded8cc] bg-[#fbfaf7] shadow-2xl">
            <div className="sticky top-0 z-10 border-b border-[#ded8cc] bg-[#fbfaf7]/95 px-6 py-5 backdrop-blur">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.15em] text-[#918a80]">
                    Cost build-up
                  </div>

                  <h2 className="mt-2 font-serif text-2xl">
                    {activeBuildUpItem.item.name}
                  </h2>

                  <p className="mt-1 text-sm text-[#918a80]">
                    {activeBuildUpItem.item.quantity}{" "}
                    {activeBuildUpItem.item.unit}
                  </p>
                </div>

                <button
                  onClick={() => setBuildUpItem(null)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#d8d1c5] text-[#777168] hover:bg-[#f1ede5]"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="rounded-2xl bg-[#292721] p-5 text-[#f7f4ee]">
                <div className="text-xs uppercase tracking-[0.14em] text-[#bda88e]">
                  Current cost rate
                </div>

                <div className="mt-2 font-serif text-3xl">
                  {preciseMoney(activeBuildUpItem.item.costRate)}

                  <span className="ml-2 text-sm text-[#aaa297]">
                    / {activeBuildUpItem.item.unit}
                  </span>
                </div>
              </div>

              <div className="mt-7">
                <div className="mb-4 flex items-end justify-between">
                  <div>
                    <h3 className="font-serif text-xl">Cost components</h3>

                    <p className="mt-1 text-xs text-[#918a80]">
                      Enter the resources required for one{" "}
                      {activeBuildUpItem.item.unit}.
                    </p>
                  </div>

                  <button
                    onClick={addBuildUpLine}
                    className="rounded-lg bg-[#eee7dc] px-3 py-2 text-xs font-medium text-[#7c5d3d] transition hover:bg-[#e7dece]"
                  >
                    + Add
                  </button>
                </div>

                <div className="space-y-3">
                  {(activeBuildUpItem.item.buildUp || []).map((line) => {
                    const lineTotal = line.quantity * line.rate;

                    return (
                      <div
                        key={line.id}
                        className="rounded-xl border border-[#ded8cc] bg-white p-4"
                      >
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <select
                            value={line.category}
                            onChange={(event) =>
                              updateBuildUpLine(
                                activeBuildUpItem.section.id,
                                activeBuildUpItem.item.id,
                                line.id,
                                "category",
                                event.target.value,
                              )
                            }
                            className="rounded-full border-0 bg-[#eee7dc] px-2 py-1 text-[10px] uppercase tracking-[0.08em] text-[#7c5d3d] outline-none"
                          >
                            <option value="Labour">Labour</option>

                            <option value="Material">Material</option>

                            <option value="Plant">Plant</option>

                            <option value="Subcontract">Subcontract</option>

                            <option value="Other">Other</option>
                          </select>

                          <div className="flex items-center gap-3">
                            <span className="font-serif text-base">
                              {preciseMoney(lineTotal)}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                deleteBuildUpLine(
                                  activeBuildUpItem.section.id,
                                  activeBuildUpItem.item.id,
                                  line.id,
                                )
                              }
                              className="flex h-7 w-7 items-center justify-center rounded-lg text-lg text-[#aaa297] transition hover:bg-[#f1e5df] hover:text-[#8a5d48]"
                              title="Delete line"
                            >
                              ×
                            </button>
                          </div>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-[1fr_90px_70px_110px]">
                          <div>
                            <label className="mb-1 block text-[10px] uppercase tracking-[0.08em] text-[#a0988d]">
                              Description
                            </label>

                            <input
                              type="text"
                              value={line.description}
                              onChange={(event) =>
                                updateBuildUpLine(
                                  activeBuildUpItem.section.id,
                                  activeBuildUpItem.item.id,
                                  line.id,
                                  "description",
                                  event.target.value,
                                )
                              }
                              className="w-full rounded-lg border border-[#d8d1c5] bg-white px-3 py-2 text-sm outline-none focus:border-[#9b7650]"
                            />
                          </div>

                          <div>
                            <label className="mb-1 block text-[10px] uppercase tracking-[0.08em] text-[#a0988d]">
                              Qty
                            </label>

                            <input
                              type="number"
                              value={line.quantity}
                              onChange={(event) =>
                                updateBuildUpLine(
                                  activeBuildUpItem.section.id,
                                  activeBuildUpItem.item.id,
                                  line.id,
                                  "quantity",
                                  Number(event.target.value),
                                )
                              }
                              className="w-full rounded-lg border border-[#d8d1c5] px-3 py-2 text-sm outline-none focus:border-[#9b7650]"
                            />
                          </div>

                          <div>
                            <label className="mb-1 block text-[10px] uppercase tracking-[0.08em] text-[#a0988d]">
                              Unit
                            </label>

                            <input
                              type="text"
                              value={line.unit}
                              onChange={(event) =>
                                updateBuildUpLine(
                                  activeBuildUpItem.section.id,
                                  activeBuildUpItem.item.id,
                                  line.id,
                                  "unit",
                                  event.target.value,
                                )
                              }
                              className="w-full rounded-lg border border-[#d8d1c5] bg-white py-2 text-center text-sm outline-none focus:border-[#9b7650]"
                            />
                          </div>

                          <div>
                            <label className="mb-1 block text-[10px] uppercase tracking-[0.08em] text-[#a0988d]">
                              Rate
                            </label>

                            <div className="relative">
                              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#918a80]">
                                £
                              </span>

                              <input
                                type="number"
                                value={line.rate}
                                onChange={(event) =>
                                  updateBuildUpLine(
                                    activeBuildUpItem.section.id,
                                    activeBuildUpItem.item.id,
                                    line.id,
                                    "rate",
                                    Number(event.target.value),
                                  )
                                }
                                className="w-full rounded-lg border border-[#d8d1c5] bg-white py-2 pl-7 pr-3 text-sm outline-none focus:border-[#9b7650]"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <BuildUpSummary item={activeBuildUpItem.item} />

              <div className="mt-7 border-t border-[#ded8cc] pt-5">
                <button
                  onClick={() => setBuildUpItem(null)}
                  className="w-full rounded-xl bg-[#9b7650] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#886746]"
                >
                  Save Build Up
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* PREVIOUS RATES */}

      {activePreviousRateItem && (
        <div className="fixed inset-0 z-50">
          <button
            aria-label="Close previous rates"
            onClick={() => {
              setPreviousRateItem(null);
              setRateSearch("");
            }}
            className="absolute inset-0 bg-[#25231f]/30 backdrop-blur-[2px]"
          />

          <aside className="absolute right-0 top-0 h-full w-full max-w-2xl overflow-y-auto border-l border-[#ded8cc] bg-[#fbfaf7] shadow-2xl">
            <div className="sticky top-0 z-10 border-b border-[#ded8cc] bg-[#fbfaf7]/95 px-6 py-5 backdrop-blur">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.15em] text-[#918a80]">
                    Rate history
                  </div>

                  <h2 className="mt-2 font-serif text-2xl">Previous Rates</h2>

                  <p className="mt-1 text-sm text-[#918a80]">
                    {activePreviousRateItem.item.name} · per{" "}
                    {activePreviousRateItem.item.unit}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setPreviousRateItem(null);
                    setRateSearch("");
                  }}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#d8d1c5] text-[#777168] hover:bg-[#f1ede5]"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="rounded-2xl bg-[#292721] p-5 text-[#f7f4ee]">
                <div className="text-xs uppercase tracking-[0.14em] text-[#bda88e]">
                  Current estimate
                </div>

                <div className="mt-2 font-serif text-3xl">
                  {preciseMoney(activePreviousRateItem.item.costRate)}

                  <span className="ml-2 text-sm text-[#aaa297]">
                    cost / {activePreviousRateItem.item.unit}
                  </span>
                </div>

                <div className="mt-1 text-sm text-[#aaa297]">
                  Sell rate {preciseMoney(activePreviousRateItem.item.sellRate)}
                </div>
              </div>

              <div className="mt-7">
                <label className="mb-2 block text-xs font-medium text-[#625b52]">
                  Search previous estimates
                </label>

                <input
                  type="text"
                  value={rateSearch}
                  onChange={(event) => setRateSearch(event.target.value)}
                  placeholder="Search project, type or date..."
                  className="w-full rounded-xl border border-[#d8d1c5] bg-white px-4 py-3 text-sm outline-none placeholder:text-[#b2aba1] focus:border-[#9b7650]"
                />
              </div>

              <div className="mt-7 space-y-3">
                {matchingPreviousRates.map((rate) => (
                  <div
                    key={rate.id}
                    className="rounded-2xl border border-[#ded8cc] bg-white p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="font-medium">{rate.project}</div>

                        <div className="mt-1 text-xs text-[#918a80]">
                          {rate.projectType} · {rate.date}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-serif text-xl">
                          {preciseMoney(rate.costRate)}
                        </div>

                        <div className="text-xs text-[#918a80]">
                          / {activePreviousRateItem.item.unit}
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-3 gap-3">
                      <RateDetail
                        label="Cost"
                        value={preciseMoney(rate.costRate)}
                      />

                      <RateDetail
                        label="Sell"
                        value={preciseMoney(rate.sellRate)}
                      />

                      <RateDetail
                        label="Margin"
                        value={`${rate.margin.toFixed(1)}%`}
                      />
                    </div>

                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => applyPreviousRate(rate)}
                        className="rounded-xl bg-[#9b7650] px-4 py-2.5 text-xs font-medium text-white"
                      >
                        Use this rate →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* ALLOWANCE */}

      {activeAllowanceItem && (
        <div className="fixed inset-0 z-50">
          <button
            aria-label="Close allowance"
            onClick={() => {
              setAllowanceItem(null);
              setAllowanceValue("");
              setAllowanceNote("");
            }}
            className="absolute inset-0 bg-[#25231f]/30 backdrop-blur-[2px]"
          />

          <aside className="absolute right-0 top-0 h-full w-full max-w-lg overflow-y-auto border-l border-[#ded8cc] bg-[#fbfaf7] shadow-2xl">
            <div className="border-b border-[#ded8cc] px-6 py-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs uppercase tracking-[0.15em] text-[#918a80]">
                    Provisional cost
                  </div>

                  <h2 className="mt-2 font-serif text-2xl">Allowance</h2>

                  <p className="mt-1 text-sm text-[#918a80]">
                    {activeAllowanceItem.item.name}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setAllowanceItem(null);
                    setAllowanceValue("");
                    setAllowanceNote("");
                  }}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#d8d1c5]"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="rounded-2xl bg-[#eee9df] p-5">
                <div className="text-xs uppercase tracking-[0.14em] text-[#8a6846]">
                  What is an allowance?
                </div>

                <p className="mt-3 text-sm leading-6 text-[#625b52]">
                  Use an allowance when you don&apos;t have enough information
                  to create a detailed build-up or obtain a firm price.
                </p>
              </div>

              <div className="mt-7">
                <label className="mb-2 block text-xs font-medium text-[#625b52]">
                  Cost allowance
                </label>

                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#918a80]">
                    £
                  </span>

                  <input
                    type="number"
                    min="0"
                    value={allowanceValue}
                    onChange={(event) => setAllowanceValue(event.target.value)}
                    className="w-full rounded-xl border border-[#d8d1c5] bg-white py-4 pl-9 pr-4 font-serif text-2xl outline-none focus:border-[#9b7650]"
                  />
                </div>

                <p className="mt-2 text-xs text-[#918a80]">
                  This is the estimated cost to your business, not the customer
                  price.
                </p>
              </div>

              <div className="mt-6">
                <label className="mb-2 block text-xs font-medium text-[#625b52]">
                  Note{" "}
                  <span className="font-normal text-[#a0988d]">optional</span>
                </label>

                <textarea
                  value={allowanceNote}
                  onChange={(event) => setAllowanceNote(event.target.value)}
                  placeholder="e.g. Client selection TBC"
                  rows={4}
                  className="w-full resize-none rounded-xl border border-[#d8d1c5] bg-white px-4 py-3 text-sm outline-none focus:border-[#9b7650]"
                />
              </div>

              <div className="mt-7 flex gap-3">
                <button
                  onClick={() => {
                    setAllowanceItem(null);
                    setAllowanceValue("");
                    setAllowanceNote("");
                  }}
                  className="flex-1 rounded-xl border border-[#d8d1c5] bg-white px-5 py-3 text-sm"
                >
                  Cancel
                </button>

                <button
                  onClick={applyAllowance}
                  className="flex-1 rounded-xl bg-[#9b7650] px-5 py-3 text-sm font-medium text-white"
                >
                  Apply Allowance
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}

export default function EstimateBuilderPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#f7f4ee] text-[#777168]">
          Loading...
        </main>
      }
    >
      <EstimateBuilder />
    </Suspense>
  );
}

function BuildUpSummary({ item }: { item: EstimateItem }) {
  const lines = item.buildUp || [];

  const totals = lines.reduce(
    (result, line) => {
      const value = line.quantity * line.rate;

      result.total += value;

      if (line.category === "Labour") {
        result.labour += value;

        result.hours += line.quantity;
      }

      if (line.category === "Material") {
        result.materials += value;
      }

      if (line.category === "Plant") {
        result.plant += value;
      }

      if (line.category === "Subcontract") {
        result.subcontract += value;
      }

      return result;
    },
    {
      total: 0,
      labour: 0,
      materials: 0,
      plant: 0,
      subcontract: 0,
      hours: 0,
    },
  );

  const gp = item.sellRate - totals.total;

  const margin = item.sellRate > 0 ? (gp / item.sellRate) * 100 : 0;

  const markup = totals.total > 0 ? (gp / totals.total) * 100 : 0;

  return (
    <div className="mt-7 rounded-2xl border border-[#ded8cc] bg-[#f7f4ee] p-5">
      <h3 className="font-serif text-xl">Build-up summary</h3>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <SummaryBox label="Labour" value={preciseMoney(totals.labour)} />

        <SummaryBox label="Materials" value={preciseMoney(totals.materials)} />

        <SummaryBox label="Plant" value={preciseMoney(totals.plant)} />

        <SummaryBox label="Labour hours" value={totals.hours.toFixed(2)} />
      </div>

      <div className="mt-5 space-y-3 border-t border-[#ded8cc] pt-5">
        <CommercialRow
          label="Build-up cost"
          value={preciseMoney(totals.total)}
        />

        <CommercialRow label="Sell rate" value={preciseMoney(item.sellRate)} />

        <CommercialRow label="Gross profit" value={preciseMoney(gp)} />

        <CommercialRow label="Margin" value={`${margin.toFixed(1)}%`} />

        <CommercialRow label="Markup" value={`${markup.toFixed(1)}%`} />
      </div>
    </div>
  );
}

function RateDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-[#f7f4ee] p-3">
      <div className="text-[10px] uppercase tracking-[0.08em] text-[#918a80]">
        {label}
      </div>

      <div className="mt-1 font-serif text-base">{value}</div>
    </div>
  );
}

function SummaryBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[#ded8cc] bg-[#fbfaf7] p-3">
      <div className="text-[10px] uppercase tracking-[0.08em] text-[#918a80]">
        {label}
      </div>

      <div className="mt-1 font-serif text-base">{value}</div>
    </div>
  );
}

function CommercialRow({
  label,
  value,
  muted = false,
  large = false,
}: {
  label: string;
  value: string;
  muted?: boolean;
  large?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span
        className={`text-sm ${muted ? "text-[#918a80]" : "text-[#625b52]"}`}
      >
        {label}
      </span>

      <span className={`font-serif ${large ? "text-xl" : "text-base"}`}>
        {value}
      </span>
    </div>
  );
}
