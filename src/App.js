import React, { useMemo, useState } from "https://esm.sh/react@18.3.1";
import { jobs, columns, kpis } from "./mockData.js";
import { Sidebar } from "./components/Sidebar.js";
import { TopBar } from "./components/TopBar.js";
import { DispatchBoard } from "./components/DispatchBoard.js";
import { JobDetailPanel } from "./components/JobDetailPanel.js";
import { KpiCard } from "./components/KpiCard.js";

const h = React.createElement;

export function App() {
  const [selectedJob, setSelectedJob] = useState(jobs[0]);
  const [query, setQuery] = useState("");

  const filteredJobs = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return jobs;
    return jobs.filter((job) =>
      [job.id, job.title, job.phone, job.customer, job.service, job.commune, job.assignment]
        .join(" ")
        .toLowerCase()
        .includes(value)
    );
  }, [query]);

  return h(
    "div",
    { className: "min-h-screen bg-brikoCream text-brikoDeep" },
    h(
      "div",
      { className: "grid min-h-screen lg:grid-cols-[280px_minmax(0,1fr)]" },
      h(Sidebar),
      h(
        "main",
        { className: "min-w-0 p-4 sm:p-5 xl:p-6" },
        h(TopBar, { query, setQuery }),
        h(
          "div",
          { className: "grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px] 2xl:grid-cols-[minmax(0,1fr)_400px]" },
          h(DispatchBoard, {
            columns,
            jobs: filteredJobs,
            selectedJob,
            onSelectJob: setSelectedJob
          }),
          h(JobDetailPanel, { job: selectedJob })
        ),
        h(
          "section",
          { className: "mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5" },
          kpis.map((kpi) => h(KpiCard, { key: kpi.label, ...kpi }))
        )
      )
    )
  );
}
