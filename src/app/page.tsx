"use client";

import { useRouter } from "next/navigation";

const estimates = [
  {
    name: "Smith Extension",
    client: "John Smith",
    type: "Single Storey Extension",
    progress: 82,
    value: "£94,125",
    status: "In progress",
  },
  {
    name: "Brown Renovation",
    client: "Sarah Brown",
    type: "Full House Renovation",
    progress: 35,
    value: "£128,400",
    status: "In progress",
  },
  {
    name: "Wilson New Build",
    client: "David Wilson",
    type: "New Build House",
    progress: 100,
    value: "£286,750",
    status: "Quote sent",
  },
];

const stats = [
  {
    label: "Estimates in progress",
    value: "2",
  },
  {
    label: "Quoted this month",
    value: "£509k",
  },
  {
    label: "Average margin",
    value: "24.8%",
  },
  {
    label: "Time saved",
    value: "7h 20m",
  },
];

export default function Dashboard() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#f7f4ee] text-[#25231f]">
      <div className="mx-auto flex min-h-screen max-w-[1500px]">
        {/* SIDEBAR */}
        <aside className="hidden w-64 shrink-0 border-r border-[#ded8cc] bg-[#fbfaf7] px-6 py-7 lg:flex lg:flex-col">
          {/* Logo */}
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

          {/* Navigation */}
          <nav className="space-y-1 text-sm">
            <button
              onClick={() => router.push("/")}
              className="w-full rounded-xl bg-[#eee7dc] px-4 py-3 text-left font-medium text-[#7c5d3d]"
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

          {/* Footer */}
          <div className="mt-auto border-t border-[#ded8cc] pt-5">
            <div className="text-xs text-[#999287]">
              Monolith Estimating Cloud
            </div>

            <div className="mt-1 text-xs text-[#b0aaa0]">Version 0.1</div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <section className="min-w-0 flex-1 px-5 py-6 sm:px-8 lg:px-12 lg:py-9">
          {/* HEADER */}
          <header className="mb-9 flex items-start justify-between gap-4">
            <div>
              <p className="mb-1 text-sm text-[#918a80]">
                Monday, 31 August 2026
              </p>

              <h1 className="font-serif text-3xl tracking-tight sm:text-4xl">
                Good evening.
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-[#777168]">
                Keep your estimates moving and spend less time at the desk.
              </p>
            </div>

            <button
              onClick={() => router.push("/templates")}
              className="rounded-xl bg-[#9b7650] px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-[#886746]"
            >
              + New Estimate
            </button>
          </header>

          {/* STATS */}
          <div className="mb-9 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-[#ded8cc] bg-[#fbfaf7] p-5"
              >
                <div className="text-xs text-[#918a80]">{stat.label}</div>

                <div className="mt-3 font-serif text-2xl">{stat.value}</div>
              </div>
            ))}
          </div>

          {/* CONTENT GRID */}
          <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
            {/* RECENT ESTIMATES */}
            <section className="rounded-2xl border border-[#ded8cc] bg-[#fbfaf7]">
              <div className="flex items-center justify-between border-b border-[#e7e2d9] px-6 py-5">
                <div>
                  <h2 className="font-serif text-xl">Recent estimates</h2>

                  <p className="mt-1 text-xs text-[#918a80]">
                    Pick up where you left off.
                  </p>
                </div>

                <button
                  onClick={() => router.push("/estimates")}
                  className="text-xs font-medium text-[#8a6846] hover:text-[#6f5238]"
                >
                  View all
                </button>
              </div>

              <div className="divide-y divide-[#e7e2d9]">
                {estimates.map((estimate) => (
                  <button
                    key={estimate.name}
                    onClick={() => router.push("/estimates")}
                    className="w-full px-6 py-5 text-left transition hover:bg-[#f8f5ef]"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <div className="font-medium">{estimate.name}</div>

                        <div className="mt-1 text-xs text-[#918a80]">
                          {estimate.client} · {estimate.type}
                        </div>
                      </div>

                      <div className="text-left sm:text-right">
                        <div className="font-serif text-lg">
                          {estimate.value}
                        </div>

                        <div className="mt-1 text-xs text-[#918a80]">
                          {estimate.status}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="mb-2 flex justify-between text-[11px] text-[#918a80]">
                        <span>Estimate progress</span>

                        <span>{estimate.progress}%</span>
                      </div>

                      <div className="h-1.5 overflow-hidden rounded-full bg-[#e8e2d8]">
                        <div
                          className="h-full rounded-full bg-[#9b7650]"
                          style={{
                            width: `${estimate.progress}%`,
                          }}
                        />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* TIME SAVED PANEL */}
            <aside className="rounded-2xl border border-[#ded8cc] bg-[#292721] p-6 text-[#f7f4ee]">
              <div className="text-xs uppercase tracking-[0.16em] text-[#bda88e]">
                Built for small businesses
              </div>

              <h2 className="mt-4 font-serif text-2xl leading-tight">
                More time back.
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#c9c2b7]">
                Monolith learns from the estimates you already produce, making
                the next one faster without forcing you to maintain a huge
                pricing database.
              </p>

              <div className="mt-8 border-t border-[#4a463e] pt-5">
                <div className="font-serif text-3xl">7h 20m</div>

                <div className="mt-1 text-xs text-[#aaa297]">
                  estimated time saved this month
                </div>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}
