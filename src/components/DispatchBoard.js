import React from "https://esm.sh/react@18.3.1";
import { DispatchColumn } from "./DispatchColumn.js";

const h = React.createElement;

export function DispatchBoard({ columns, jobs, selectedJob, onSelectJob }) {
  return h(
    "section",
    { className: "min-w-0 rounded-2xl border border-brikoBorder bg-white p-3 shadow-soft" },
    h(
      "div",
      { className: "scrollbar-soft grid gap-0 overflow-x-auto rounded-xl xl:grid-cols-5" },
      columns.map((column, index) =>
        h(DispatchColumn, {
          key: column.name,
          column,
          jobs: jobs.filter((job) => job.column === column.name),
          selectedJob,
          onSelectJob,
          bordered: index !== columns.length - 1
        })
      )
    )
  );
}
