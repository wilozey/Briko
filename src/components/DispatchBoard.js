import React from "https://esm.sh/react@18.3.1";
import { DispatchColumn } from "./DispatchColumn.js";

const h = React.createElement;

export function DispatchBoard({ columns, jobs, selectedJob, onSelectJob }) {
  return h(
    "section",
    { className: "min-w-0 rounded-3xl border border-brikoBorder bg-white/55 p-3 shadow-soft" },
    h(
      "div",
      { className: "scrollbar-soft grid gap-3 overflow-x-auto pb-1 xl:grid-cols-5" },
      columns.map((column) =>
        h(DispatchColumn, {
          key: column.name,
          column,
          jobs: jobs.filter((job) => job.column === column.name),
          selectedJob,
          onSelectJob
        })
      )
    )
  );
}
