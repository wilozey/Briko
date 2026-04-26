import React from "https://esm.sh/react@18.3.1";

const h = React.createElement;

const urgencyStyles = {
  Emergency: "bg-brikoRed text-white",
  Today: "bg-brikoOrange text-white",
  Normal: "bg-zinc-400 text-white",
  Scheduled: "bg-brikoGreen text-white",
  "In progress": "bg-brikoGreen text-white"
};

export function JobCard({ job, selected, onSelect }) {
  return h(
    "article",
    {
      onClick: onSelect,
      className: [
        "card-enter overflow-hidden rounded-2xl border bg-white shadow-sm",
        selected ? "border-brikoGreen ring-2 ring-brikoGreen/15" : "border-brikoBorder hover:border-brikoGreen/45"
      ].join(" ")
    },
    h("div", { className: ["h-1.5", urgencyStyles[job.urgency]?.split(" ")[0] || "bg-zinc-400"].join(" ") }),
    h(
      "div",
      { className: "p-3" },
      h(
        "div",
        { className: "flex flex-wrap items-center gap-2" },
        h("span", {
          className: [
            "rounded-full px-2 py-1 text-[11px] font-black",
            urgencyStyles[job.urgency] || urgencyStyles.Normal
          ].join(" ")
        }, job.urgency),
        job.waiting ? h("span", { className: "text-[11px] font-black text-[#8C8173]" }, job.waiting) : null
      ),
      h("h3", { className: "mt-3 text-sm font-black leading-snug text-brikoDeep" }, job.title),
      h("p", { className: "mt-2 text-xs font-bold text-[#756B60]" }, `${job.commune} • ${job.service}`),
      h("p", { className: "mt-3 text-xs font-black text-brikoDeep" }, job.assignment),
      job.secondaryAssignment ? h("p", { className: "mt-1 text-xs font-bold text-[#756B60]" }, job.secondaryAssignment) : null,
      h("button", {
        className:
          "mt-3 h-9 w-full rounded-xl bg-brikoDeep text-xs font-black text-white transition hover:bg-brikoGreen"
      }, job.action)
    )
  );
}
