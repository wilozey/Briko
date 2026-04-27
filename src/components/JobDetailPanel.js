import React from "https://esm.sh/react@18.3.1";
import {
  Image,
  MapPin,
  MessageCircle,
  MoreHorizontal,
  Phone,
  Star,
  UserRound,
  UserRoundCheck,
  Wrench,
  Clock3,
  Target
} from "https://esm.sh/lucide-react@0.468.0";

const h = React.createElement;

const tone = {
  Emergency: "bg-brikoRed text-white",
  Today: "bg-brikoOrange text-white",
  Scheduled: "bg-brikoGreen text-white",
  "In progress": "bg-brikoOrange text-white",
  Normal: "bg-slate-500 text-white"
};

const rows = [
  { label: "Customer", key: "customer", icon: UserRound },
  { label: "Phone", key: "phone", icon: Target },
  { label: "Location", key: "location", icon: MapPin },
  { label: "Service", key: "service", icon: Wrench },
  { label: "Status", key: "status", icon: Clock3 },
  { label: "Created", key: "created", icon: Clock3 },
  { label: "Description", key: "description", icon: Image },
  { label: "Attachments", key: "attachments", icon: Image }
];

export function JobDetailPanel({ job }) {
  return h(
    "aside",
    { className: "rounded-2xl border border-brikoBorder bg-white p-4 shadow-soft xl:sticky xl:top-5 xl:self-start" },
    h("div", { className: "flex items-start justify-between gap-3" },
      h("div", { className: "flex flex-wrap items-center gap-2" },
        h("span", { className: ["rounded-full px-3 py-1 text-xs font-black", tone[job.urgency] || tone.Normal].join(" ") }, job.urgency),
        job.waiting ? h("span", { className: "text-xs font-black text-brikoRed" }, job.waiting) : null
      ),
      h("button", { className: "grid h-8 w-8 place-items-center rounded-lg hover:bg-brikoCream" }, h("span", { className: "text-2xl leading-none" }, "×"))
    ),
    h("div", { className: "mt-4 border-t border-brikoBorder pt-4" },
      h("div", { className: "flex items-start justify-between gap-3" },
        h("div", null,
          h("h2", { className: "text-2xl font-black leading-tight text-brikoText" }, job.title),
          h("p", { className: "mt-2 inline-flex rounded-md bg-green-50 px-2 py-1 text-xs font-black text-brikoGreen" }, `Job ${job.id}`)
        ),
        h("button", { className: "grid h-9 w-9 place-items-center rounded-lg border border-brikoBorder text-brikoMuted" }, h(Star, { size: 18 }))
      )
    ),
    h(
      "dl",
      { className: "mt-5 space-y-4" },
      rows.map((row) => {
        const Icon = row.icon;
        const value = job[row.key];
        return h("div", { key: row.key, className: "grid grid-cols-[24px_1fr] gap-3 text-sm" },
          h(Icon, { size: 18, className: "mt-0.5 text-brikoText" }),
          h("div", null,
            h("dt", { className: "text-xs font-bold text-brikoMuted" }, row.label),
            h("dd", { className: ["mt-1 font-semibold leading-relaxed", row.key === "status" ? "text-brikoRed" : "text-brikoText"].join(" ") }, value)
          )
        );
      })
    ),
    h("button", {
      className:
        "mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brikoRed text-sm font-black text-white shadow-soft"
    }, h(UserRoundCheck, { size: 18 }), "Assign artisan"),
    h("div", { className: "mt-3 grid grid-cols-3 gap-2" },
      h("button", { className: "inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-brikoBorder bg-white text-xs font-black text-brikoText" }, h(Phone, { size: 16 }), "Call"),
      h("button", { className: "inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-brikoBorder bg-white text-xs font-black text-brikoText" }, h(MessageCircle, { size: 16 }), "WhatsApp"),
      h("button", { className: "inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-brikoBorder bg-white text-xs font-black text-brikoText" }, h(MoreHorizontal, { size: 16 }), "More")
    )
  );
}
