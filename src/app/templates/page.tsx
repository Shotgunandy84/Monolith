"use client";

import { useRouter } from "next/navigation";

const templateGroups = [
  {
    title: "Extensions",
    description: "Add space without starting from scratch.",
    templates: [
      {
        name: "Single Storey Extension",
        description: "A straightforward ground-floor extension.",
        tag: "Popular",
      },
      {
        name: "Double Storey Extension",
        description: "Extension across two floors.",
        tag: "Standard",
      },
      {
        name: "Loft Conversion",
        description: "Convert existing roof space into living space.",
        tag: "Standard",
      },
    ],
  },
  {
    title: "Renovations",
    description: "Start with a proven renovation structure.",
    templates: [
      {
        name: "Full House Renovation",
        description: "Complete refurbishment and renovation.",
        tag: "Popular",
      },
      {
        name: "Kitchen Renovation",
        description: "Kitchen refurbishment and associated works.",
        tag: "Standard",
      },
      {
        name: "Bathroom Renovation",
        description: "Bathroom refurbishment and finishing works.",
        tag: "Standard",
      },
    ],
  },
  {
    title: "New Build",
    description: "Build an estimate around the main construction stages.",
    templates: [
      {
        name: "New Build House",
        description: "Standard house construction estimate.",
        tag: "Popular",
      },
      {
        name: "New Build Bungalow",
        description: "Single-storey new-build estimate.",
        tag: "Standard",
      },
    ],
  },
];

export default function TemplatesPage() {
  const router = useRouter();

  function chooseTemplate(templateName: string) {
    router.push(`/estimates/new?template=${encodeURIComponent(templateName)}`);
  }

  return (
    <main className="min-h-screen bg-[#f7f4ee] text-[#25231f]">
      <div className="mx-auto flex min-h-screen max-w-[1500px]">
        {/* SIDEBAR */}
        <aside className="hidden w-64 shrink-0 border-r border-[#ded8cc] bg-[#fbfaf7] px-6 py-7 lg:flex lg:flex-col">
          {/* LOGO */}
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

          {/* NAVIGATION */}
          <nav className="space-y-1 text-sm">
            <button
              onClick={() => router.push("/")}
              className="w-full rounded-xl px-4 py-3 text-left text-[#777168] transition hover:bg-[#f1ede5]"
            >
              Dashboard
            </button>

            <button
              onClick={() => router.push("/estimates")}
              className="w-full rounded-xl px-4 py-3 text-left text-[#777168] transition hover:bg-[#f1ede5]"
            >
              Estimates
            </button>

            <button
              onClick={() => router.push("/templates")}
              className="w-full rounded-xl bg-[#eee7dc] px-4 py-3 text-left font-medium text-[#7c5d3d]"
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

          {/* FOOTER */}
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
          <header className="mb-10 flex items-end justify-between gap-4">
            <div>
              <button
                onClick={() => router.push("/")}
                className="mb-4 text-sm text-[#8a6846] hover:text-[#6f5238]"
              >
                ← Dashboard
              </button>

              <p className="mb-1 text-sm text-[#918a80]">
                Start with a proven structure
              </p>

              <h1 className="font-serif text-4xl tracking-tight">Templates</h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-[#777168]">
                Choose a starting point and let Monolith do the repetitive work
                for you.
              </p>
            </div>

            <button
              onClick={() => chooseTemplate("Blank Estimate")}
              className="hidden rounded-xl border border-[#cfc7ba] bg-[#fbfaf7] px-5 py-3 text-sm font-medium text-[#5f554a] transition hover:bg-white sm:block"
            >
              Blank Estimate
            </button>
          </header>

          {/* TEMPLATE GROUPS */}
          <div className="space-y-10">
            {templateGroups.map((group) => (
              <section key={group.title}>
                <div className="mb-4">
                  <h2 className="font-serif text-2xl">{group.title}</h2>

                  <p className="mt-1 text-sm text-[#918a80]">
                    {group.description}
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {group.templates.map((template) => (
                    <button
                      key={template.name}
                      onClick={() => chooseTemplate(template.name)}
                      className="group rounded-2xl border border-[#ded8cc] bg-[#fbfaf7] p-6 text-left transition hover:-translate-y-0.5 hover:border-[#b89977] hover:bg-white"
                    >
                      {/* CARD TOP */}
                      <div className="mb-8 flex items-start justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eee7dc] text-[#8a6846]">
                          <span className="font-serif text-xl">M</span>
                        </div>

                        <span className="rounded-full bg-[#f0ebe3] px-3 py-1 text-[10px] uppercase tracking-[0.12em] text-[#8a6846]">
                          {template.tag}
                        </span>
                      </div>

                      {/* TITLE */}
                      <h3 className="font-serif text-xl">{template.name}</h3>

                      {/* DESCRIPTION */}
                      <p className="mt-2 min-h-[48px] text-sm leading-6 text-[#777168]">
                        {template.description}
                      </p>

                      {/* ACTION */}
                      <div className="mt-6 flex items-center justify-between border-t border-[#e7e2d9] pt-4">
                        <span className="text-xs font-medium text-[#8a6846]">
                          Start estimate
                        </span>

                        <span className="text-lg text-[#8a6846] transition group-hover:translate-x-1">
                          →
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* BLANK ESTIMATE */}
          <section className="mt-12 rounded-2xl border border-[#ded8cc] bg-[#292721] p-6 text-[#f7f4ee] sm:p-8">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
              <div>
                <div className="text-xs uppercase tracking-[0.16em] text-[#bda88e]">
                  Start from scratch
                </div>

                <h2 className="mt-2 font-serif text-2xl">
                  Nothing quite fits?
                </h2>

                <p className="mt-2 max-w-xl text-sm leading-6 text-[#c9c2b7]">
                  Start with a blank estimate and build only the sections you
                  need.
                </p>
              </div>

              <button
                onClick={() => chooseTemplate("Blank Estimate")}
                className="rounded-xl bg-[#b1875d] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#9b7650]"
              >
                Start Blank Estimate →
              </button>
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}
