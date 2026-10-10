"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const templateDescriptions: Record<string, string> = {
  "Single Storey Extension":
    "A straightforward ground-floor extension with the main construction stages already prepared.",
  "Double Storey Extension":
    "A two-storey extension with the core construction stages prepared.",
  "Loft Conversion":
    "A structured starting point for converting existing roof space.",
  "Full House Renovation":
    "A complete refurbishment estimate covering the major renovation stages.",
  "Kitchen Renovation":
    "A focused estimate for kitchen refurbishment and associated works.",
  "Bathroom Renovation":
    "A focused estimate for bathroom refurbishment and associated works.",
  "New Build House":
    "A complete starting structure for a standard new-build house.",
  "New Build Bungalow":
    "A complete starting structure for a single-storey new build.",
  "General Works": "A flexible estimate for general construction work.",
  "Blank Estimate": "Start from scratch and add only the work you need.",
};

function NewEstimateForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedTemplate =
    searchParams.get("template") || "Single Storey Extension";

  const [projectName, setProjectName] = useState("");
  const [clientName, setClientName] = useState("");
  const [address, setAddress] = useState("");
  const [floorArea, setFloorArea] = useState("");
  const [storeys, setStoreys] = useState("1");
  const [specification, setSpecification] = useState("Standard");
  const [includeKitchen, setIncludeKitchen] = useState(false);
  const [includeBathroom, setIncludeBathroom] = useState(false);
  const [includeHeating, setIncludeHeating] = useState(false);

  const description =
    templateDescriptions[selectedTemplate] ||
    "Start your estimate from a prepared Monolith template.";

  function createEstimate() {
    const params = new URLSearchParams();

    params.set("template", selectedTemplate);
    params.set("project", projectName || "New Estimate");
    params.set("client", clientName || "New Client");

    if (floorArea) {
      params.set("area", floorArea);
    }

    router.push(`/estimates/builder?${params.toString()}`);
  }

  return (
    <main className="min-h-screen bg-[#f7f4ee] text-[#25231f]">
      <div className="mx-auto flex min-h-screen max-w-[1500px]">
        {/* SIDEBAR */}
        <aside className="hidden w-64 shrink-0 border-r border-[#ded8cc] bg-[#fbfaf7] px-6 py-7 lg:flex lg:flex-col">
          <button onClick={() => router.push("/")} className="mb-12 text-left">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#9b7650] text-white">
                <span className="font-serif text-lg">M</span>
              </div>

              <div>
                <div className="font-serif text-xl tracking-tight">
                  Monolith
                </div>

                <div className="text-[10px] uppercase tracking-[0.2em] text-[#8b857b]">
                  Estimating Cloud
                </div>
              </div>
            </div>
          </button>

          <nav className="space-y-1 text-sm">
            <button
              onClick={() => router.push("/")}
              className="w-full rounded-xl px-4 py-3 text-left text-[#777168] transition hover:bg-[#f1ede5]"
            >
              Dashboard
            </button>

            <button
              onClick={() => router.push("/estimates")}
              className="w-full rounded-xl bg-[#eee7dc] px-4 py-3 text-left font-medium text-[#7c5d3d]"
            >
              Estimates
            </button>

            <button
              onClick={() => router.push("/templates")}
              className="w-full rounded-xl px-4 py-3 text-left text-[#777168] transition hover:bg-[#f1ede5]"
            >
              Templates
            </button>

            <button
              onClick={() => router.push("/projects")}
              className="w-full rounded-xl px-4 py-3 text-left text-[#777168] transition hover:bg-[#f1ede5]"
            >
              Projects
            </button>

            <button
              onClick={() => router.push("/rates")}
              className="w-full rounded-xl px-4 py-3 text-left text-[#777168] transition hover:bg-[#f1ede5]"
            >
              Rates & Costs
            </button>

            <button
              onClick={() => router.push("/commercial")}
              className="w-full rounded-xl px-4 py-3 text-left text-[#777168] transition hover:bg-[#f1ede5]"
            >
              Commercial
            </button>

            <button
              onClick={() => router.push("/reports")}
              className="w-full rounded-xl px-4 py-3 text-left text-[#777168] transition hover:bg-[#f1ede5]"
            >
              Reports
            </button>
          </nav>

          <div className="mt-auto border-t border-[#ded8cc] pt-5">
            <div className="text-xs text-[#999287]">
              Monolith Estimating Cloud
            </div>

            <div className="mt-1 text-xs text-[#b0aaa0]">Version 0.1</div>
          </div>
        </aside>

        {/* MAIN */}
        <section className="min-w-0 flex-1 px-5 py-6 sm:px-8 lg:px-12 lg:py-9">
          {/* HEADER */}
          <header className="mb-8">
            <button
              onClick={() => router.push("/templates")}
              className="mb-5 text-sm text-[#8a6846] transition hover:text-[#6f5238]"
            >
              ← Templates
            </button>

            <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
              <div>
                <p className="mb-1 text-sm text-[#918a80]">Step 1 of 2</p>

                <h1 className="font-serif text-4xl tracking-tight">
                  New estimate
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#777168]">
                  Tell Monolith a little about the project. We&apos;ll create
                  the estimate structure for you.
                </p>
              </div>

              <div className="rounded-xl border border-[#ded8cc] bg-[#fbfaf7] px-4 py-3">
                <div className="text-[10px] uppercase tracking-[0.15em] text-[#918a80]">
                  Selected template
                </div>

                <div className="mt-1 font-serif text-lg">
                  {selectedTemplate}
                </div>
              </div>
            </div>
          </header>

          {/* PROGRESS */}
          <div className="mb-8 flex items-center gap-3">
            <div className="h-1.5 flex-1 rounded-full bg-[#9b7650]" />

            <div className="h-1.5 flex-1 rounded-full bg-[#e5dfd5]" />
          </div>

          <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
            {/* FORM */}
            <section className="rounded-2xl border border-[#ded8cc] bg-[#fbfaf7]">
              <div className="border-b border-[#e7e2d9] px-6 py-5">
                <h2 className="font-serif text-xl">Project details</h2>

                <p className="mt-1 text-xs text-[#918a80]">
                  You can change these later.
                </p>
              </div>

              <div className="space-y-6 p-6">
                {/* PROJECT NAME */}
                <div>
                  <label className="mb-2 block text-xs font-medium text-[#625b52]">
                    Project name
                  </label>

                  <input
                    value={projectName}
                    onChange={(event) => setProjectName(event.target.value)}
                    placeholder="e.g. Smith Extension"
                    className="w-full rounded-xl border border-[#d8d1c5] bg-white px-4 py-3 text-sm outline-none transition placeholder:text-[#b2aba1] focus:border-[#9b7650] focus:ring-2 focus:ring-[#9b7650]/10"
                  />
                </div>

                {/* CLIENT */}
                <div>
                  <label className="mb-2 block text-xs font-medium text-[#625b52]">
                    Client
                  </label>

                  <input
                    value={clientName}
                    onChange={(event) => setClientName(event.target.value)}
                    placeholder="e.g. John Smith"
                    className="w-full rounded-xl border border-[#d8d1c5] bg-white px-4 py-3 text-sm outline-none transition placeholder:text-[#b2aba1] focus:border-[#9b7650] focus:ring-2 focus:ring-[#9b7650]/10"
                  />
                </div>

                {/* ADDRESS */}
                <div>
                  <label className="mb-2 block text-xs font-medium text-[#625b52]">
                    Project address
                  </label>

                  <textarea
                    value={address}
                    onChange={(event) => setAddress(event.target.value)}
                    placeholder="Enter the project address"
                    rows={3}
                    className="w-full resize-none rounded-xl border border-[#d8d1c5] bg-white px-4 py-3 text-sm outline-none transition placeholder:text-[#b2aba1] focus:border-[#9b7650] focus:ring-2 focus:ring-[#9b7650]/10"
                  />
                </div>

                {/* PROJECT DIMENSIONS */}
                <div>
                  <div className="mb-3">
                    <label className="block text-xs font-medium text-[#625b52]">
                      Project basics
                    </label>

                    <p className="mt-1 text-xs text-[#918a80]">
                      These help Monolith prepare quantities and allowances.
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <label className="mb-2 block text-xs text-[#777168]">
                        Floor area
                      </label>

                      <div className="relative">
                        <input
                          value={floorArea}
                          onChange={(event) => setFloorArea(event.target.value)}
                          type="number"
                          min="0"
                          placeholder="45"
                          className="w-full rounded-xl border border-[#d8d1c5] bg-white px-4 py-3 pr-12 text-sm outline-none transition placeholder:text-[#b2aba1] focus:border-[#9b7650] focus:ring-2 focus:ring-[#9b7650]/10"
                        />

                        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#918a80]">
                          m²
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-xs text-[#777168]">
                        Storeys
                      </label>

                      <select
                        value={storeys}
                        onChange={(event) => setStoreys(event.target.value)}
                        className="w-full rounded-xl border border-[#d8d1c5] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#9b7650] focus:ring-2 focus:ring-[#9b7650]/10"
                      >
                        <option value="1">1 storey</option>
                        <option value="2">2 storeys</option>
                        <option value="3">3 storeys</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-xs text-[#777168]">
                        Specification
                      </label>

                      <select
                        value={specification}
                        onChange={(event) =>
                          setSpecification(event.target.value)
                        }
                        className="w-full rounded-xl border border-[#d8d1c5] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#9b7650] focus:ring-2 focus:ring-[#9b7650]/10"
                      >
                        <option value="Basic">Basic</option>
                        <option value="Standard">Standard</option>
                        <option value="Premium">Premium</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* OPTIONAL WORKS */}
                <div>
                  <div className="mb-3">
                    <label className="block text-xs font-medium text-[#625b52]">
                      Optional works
                    </label>

                    <p className="mt-1 text-xs text-[#918a80]">
                      Monolith will add these to the estimate.
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <ToggleCard
                      label="Kitchen"
                      description="Include kitchen works"
                      checked={includeKitchen}
                      onChange={setIncludeKitchen}
                    />

                    <ToggleCard
                      label="Bathroom"
                      description="Include bathroom works"
                      checked={includeBathroom}
                      onChange={setIncludeBathroom}
                    />

                    <ToggleCard
                      label="Heating"
                      description="Include heating works"
                      checked={includeHeating}
                      onChange={setIncludeHeating}
                    />
                  </div>
                </div>

                {/* ACTION */}
                <div className="flex flex-col-reverse gap-3 border-t border-[#e7e2d9] pt-6 sm:flex-row sm:justify-between">
                  <button
                    onClick={() => router.push("/templates")}
                    className="rounded-xl px-5 py-3 text-sm text-[#777168] transition hover:bg-[#f1ede5]"
                  >
                    Change template
                  </button>

                  <button
                    onClick={createEstimate}
                    className="rounded-xl bg-[#9b7650] px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-[#886746]"
                  >
                    Create Estimate →
                  </button>
                </div>
              </div>
            </section>

            {/* TEMPLATE PREVIEW */}
            <aside className="h-fit rounded-2xl border border-[#ded8cc] bg-[#292721] p-6 text-[#f7f4ee]">
              <div className="text-xs uppercase tracking-[0.16em] text-[#bda88e]">
                Your starting point
              </div>

              <h2 className="mt-4 font-serif text-2xl leading-tight">
                {selectedTemplate}
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#c9c2b7]">
                {description}
              </p>

              <div className="mt-7 border-t border-[#4a463e] pt-5">
                <div className="text-xs uppercase tracking-[0.14em] text-[#bda88e]">
                  Monolith will prepare
                </div>

                <div className="mt-4 space-y-3">
                  {[
                    "Estimate sections",
                    "Work items",
                    "Cost categories",
                    "Commercial summary",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 text-sm text-[#e0dbd3]"
                    >
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#4a4136] text-xs text-[#c8aa87]">
                        ✓
                      </span>

                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-7 rounded-xl border border-[#4a463e] bg-[#332f28] p-4">
                <div className="text-xs text-[#b6aea2]">The aim</div>

                <div className="mt-1 font-serif text-lg">
                  Less setup. More estimating.
                </div>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}

function ToggleCard({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`rounded-xl border p-4 text-left transition ${
        checked
          ? "border-[#9b7650] bg-[#f3ece2]"
          : "border-[#d8d1c5] bg-white hover:border-[#b9aa98]"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-[#4f4941]">{label}</span>

        <span
          className={`flex h-5 w-5 items-center justify-center rounded-full border text-xs ${
            checked
              ? "border-[#9b7650] bg-[#9b7650] text-white"
              : "border-[#cfc7ba] text-transparent"
          }`}
        >
          ✓
        </span>
      </div>

      <p className="mt-1 text-xs leading-5 text-[#918a80]">{description}</p>
    </button>
  );
}

export default function NewEstimatePage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#f7f4ee] text-[#777168]">
          Loading...
        </main>
      }
    >
      <NewEstimateForm />
    </Suspense>
  );
}
