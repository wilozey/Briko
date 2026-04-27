import React from "https://esm.sh/react@18.3.1";
import { ArrowRight, Circle, UserRound } from "https://esm.sh/lucide-react@0.468.0";

const h = React.createElement;

const styles = {
  Emergency: {
    strip: "bg-brikoRed",
    card: "border-brikoRed",
    label: "bg-brikoRed text-white",
    text: "text-brikoRed"
  },
  Today: {
    strip: "bg-brikoOrange",
    card: "border-brikoBorder",
    label: "bg-orange-50 text-brikoOrange",
    text: "text-brikoOrange"
  },
  Normal: {
    strip: "bg-slate-400",
    card: "border-brikoBorder",
    label: "bg-slate-100 text-slate-600",
    text: "text-slate-600"
  },
  Scheduled: {
    strip: "bg-brikoGreen",
    card: "border-brikoBorder",
    label: "bg-green-50 text-brikoGreen",
    text: "text-brikoGreen"
  },
  "In progress": {
    strip: "bg-brikoOrange",
    card: "border-brikoBorder",
    label: "bg-orange-50 text-brikoOrange",
    text: "text-brikoOrange"
  }
};

export function JobCard({ job, selected, onSelect }) {
  const tone = styles[job.urgency] || styles.Normal;
  const isAssigned = !job.assignment.toLowerCase().includes("unassigned");

  return h(
    "article",
    {
      onClick: onSelect,
      className: [
        "card-enter overflow-hidden rounded-xl border bg-white shadow-sm",
        job.urgency === "Emergency" ? tone.card : selected ? "border-brikoGreen ring-2 ring-brikoGreen/15" : tone.card
      ].join(" ")
    },
    h("div", { className: ["h-1.5", tone.strip].join(" ") }),
    h(
      "div",
      { className: "p-3" },
      h(
        "div",
        { className: "mb-3 flex flex-wrap items-center gap-2" },
        h("span", { className: ["rounded-full px-2 py-1 text-[11px] font-black", tone.label].join(" ") }, job.urgency),
        job.waiting ? h("span", { className: ["text-[11px] font-black", tone.text].join(" ") }, job.waiting) : null
      ),
      h("h3", { className: "text-[15px] font-black leading-snug text-brikoText" }, job.title),
      h("p", { className: "mt-3 text-xs font-bold text-brikoMuted" }, `${job.commune} • ${job.service}`),
      h("p", { className: ["mt-3 flex items-center gap-1.5 text-xs font-black", isAssigned ? "text-brikoGreen" : "text-brikoRed"].join(" ") },
        isAssigned ? h(UserRound, { size: 14 }) : h(Circle, { size: 13 }),
        job.assignment
      ),
      job.secondaryAssignment ? h("p", { className: "mt-2 text-xs font-black text-brikoGreen" }, job.secondaryAssignment) : null,
      h("button", {
        onClick: (event) => {
          event.stopPropagation();
          onSelect();
        },
        className:
          "mt-4 inline-flex h-9 w-full items-center justify-center gap-1 rounded-lg border border-brikoGreen/30 bg-white text-xs font-black text-brikoDeep transition hover:bg-brikoGreen hover:text-white"
      }, job.action, h(ArrowRight, { size: 14 }))
    )
  );
}
