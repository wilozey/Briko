import React from "https://esm.sh/react@18.3.1";
import { MessageCircle, MoreHorizontal, Phone, UserRoundCheck } from "https://esm.sh/lucide-react@0.468.0";

const h = React.createElement;

const tone = {
  Emergency: "bg-brikoRed text-white",
  Today: "bg-brikoOrange text-white",
  Scheduled: "bg-brikoGreen text-white",
  "In progress": "bg-brikoGreen text-white"
};

const detailRows = [
  ["Customer", "customer"],
  ["Phone", "phone"],
  ["Location", "location"],
  ["Service", "service"],
  ["Status", "status"],
  ["Created", "created"],
  ["Attachments", "attachments"]
];

export function JobDetailPanel({ job }) {
  return h(
    "aside",
    { className: "rounded-3xl border border-brikoBorder bg-white p-4 shadow-soft xl:sticky xl:top-5 xl:self-start" },
    h(
      "div",
      { className: "flex flex-wrap items-center gap-2" },
      h("span", { className: ["rounded-full px-3 py-1 text-xs font-black", tone[job.urgency] || "bg-zinc-400 text-white"].join(" ") }, job.urgency),
      job.waiting ? h("span", { className: "text-xs font-black text-[#8C8173]" }, job.waiting) : null
    ),
    h("h2", { className: "mt-4 text-2xl font-black leading-tight text-brikoDeep" }, job.title),
    h("p", { className: "mt-2 text-sm font-black text-brikoGreen" }, `Job ${job.id}`),
    h(
      "dl",
      { className: "mt-5 space-y-3" },
      detailRows.map(([label, key]) =>
        h("div", { key: key, className: "grid grid-cols-[92px_minmax(0,1fr)] gap-3 text-sm" },
          h("dt", { className: "font-bold text-[#8C8173]" }, label),
          h("dd", { className: "font-black text-brikoDeep" }, job[key])
        )
      )
    ),
    h("div", { className: "mt-5 rounded-2xl border border-brikoBorder bg-brikoCream p-3" },
      h("p", { className: "text-xs font-black uppercase text-[#8C8173]" }, "Description"),
      h("p", { className: "mt-2 text-sm font-semibold leading-relaxed text-brikoDeep" }, job.description)
    ),
    h(
      "div",
      { className: "mt-5 grid gap-2" },
      h("button", { className: "inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-brikoRed text-sm font-black text-white shadow-soft" },
        h(UserRoundCheck, { size: 18 }),
        "Assign artisan"
      ),
      h("div", { className: "grid grid-cols-3 gap-2" },
        h("button", { className: "inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-brikoBorder bg-white text-xs font-black" }, h(Phone, { size: 16 }), "Call"),
        h("button", { className: "inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-brikoBorder bg-white text-xs font-black" }, h(MessageCircle, { size: 16 }), "WhatsApp"),
        h("button", { className: "inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-brikoBorder bg-white text-xs font-black" }, h(MoreHorizontal, { size: 16 }), "More")
      )
    )
  );
}
