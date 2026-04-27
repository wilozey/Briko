import React from "https://esm.sh/react@18.3.1";
import { AlertTriangle, MoreHorizontal, Plus } from "https://esm.sh/lucide-react@0.468.0";
import { JobCard } from "./JobCard.js";

const h = React.createElement;

export function DispatchColumn({ column, jobs, selectedJob, onSelectJob, bordered }) {
  return h(
    "section",
    { className: ["min-w-[270px] bg-white p-3", bordered ? "xl:border-r xl:border-brikoBorder" : ""].join(" ") },
    h(
      "header",
      { className: "mb-3" },
      h(
        "div",
        { className: "flex items-center justify-between gap-2" },
        h("div", { className: "flex items-center gap-2" },
          h("h2", { className: "text-sm font-black text-brikoText" }, column.name),
          h("span", { className: "text-sm font-black text-brikoMuted" }, `(${jobs.length})`)
        ),
        h("div", { className: "flex items-center gap-2 text-brikoText" },
          h(Plus, { size: 16 }),
          h(MoreHorizontal, { size: 16 })
        )
      ),
      h(
        "div",
        { className: "mt-2 space-y-1" },
        column.alerts.map((alert) =>
          h("div", { key: alert, className: "flex items-center gap-1.5 text-[12px] font-bold text-brikoRed" },
            h(AlertTriangle, { size: 13 }),
            alert
          )
        )
      )
    ),
    h(
      "div",
      { className: "space-y-3" },
      jobs.map((job) =>
        h(JobCard, {
          key: job.id,
          job,
          selected: selectedJob.id === job.id,
          onSelect: () => onSelectJob(job)
        })
      ),
      h("button", { className: "h-8 w-full rounded-lg text-xs font-bold text-brikoMuted hover:bg-brikoCream" }, "+ Add job")
    )
  );
}
