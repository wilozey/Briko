import React from "https://esm.sh/react@18.3.1";
import { JobCard } from "./JobCard.js";

const h = React.createElement;

export function DispatchColumn({ column, jobs, selectedJob, onSelectJob }) {
  return h(
    "section",
    { className: "min-w-[260px] rounded-2xl bg-[#F5F1E8] p-3" },
    h(
      "header",
      { className: "mb-3 flex items-start justify-between gap-3" },
      h("div", null,
        h("div", { className: "flex items-center gap-2" },
          h("h2", { className: "text-sm font-black text-brikoDeep" }, column.name),
          h("span", { className: "rounded-full bg-white px-2 py-0.5 text-xs font-black text-brikoGreen" }, jobs.length)
        ),
        h("p", { className: "mt-1 text-xs font-bold text-[#8C8173]" }, column.alert)
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
      )
    )
  );
}
