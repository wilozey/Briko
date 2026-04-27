import React from "https://esm.sh/react@18.3.1";
import {
  BarChart3,
  BellRing,
  CalendarCheck,
  ChevronsLeft,
  ClipboardList,
  Gauge,
  ShieldCheck,
  Sparkles,
  UsersRound
} from "https://esm.sh/lucide-react@0.468.0";

const h = React.createElement;

const groups = [
  {
    label: "Operate",
    items: [
      { label: "Dispatch", icon: ClipboardList, active: true },
      { label: "Command", icon: BellRing }
    ]
  },
  {
    label: "Capture",
    items: [
      { label: "Public booking", icon: CalendarCheck },
      { label: "Customer intake", icon: UsersRound }
    ]
  },
  {
    label: "Network",
    items: [
      { label: "Artisans", icon: UsersRound },
      { label: "Trust", icon: ShieldCheck }
    ]
  },
  {
    label: "Insights",
    items: [
      { label: "Analytics", icon: BarChart3 },
      { label: "Strategy", icon: Gauge }
    ]
  }
];

function BrikoMark() {
  return h(
    "div",
    { className: "grid h-12 w-12 place-items-center rounded-[18px] border-2 border-brikoOrange text-brikoOrange" },
    h("div", { className: "text-2xl font-black leading-none" }, "B")
  );
}

export function Sidebar() {
  return h(
    "aside",
    {
      className:
        "hidden border-r border-white/10 bg-brikoDeep px-4 py-5 text-white lg:flex lg:min-h-screen lg:flex-col"
    },
    h(
      "div",
      { className: "flex items-center gap-3 px-1" },
      h(BrikoMark),
      h("div", null, h("div", { className: "text-[21px] font-black leading-tight" }, "Briko Services"))
    ),
    h(
      "nav",
      { className: "mt-8 space-y-7" },
      groups.map((group) =>
        h(
          "section",
          { key: group.label },
          h("p", { className: "mb-2 px-2 text-[11px] font-black uppercase tracking-wide text-white/45" }, group.label),
          h(
            "div",
            { className: "space-y-1" },
            group.items.map((item) => {
              const Icon = item.icon;
              return h(
                "button",
                {
                  key: item.label,
                  className: [
                    "flex h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-black transition",
                    item.active ? "bg-brikoOrange text-white shadow-soft" : "text-white/80 hover:bg-white/8 hover:text-white"
                  ].join(" ")
                },
                h(Icon, { size: 18, strokeWidth: 2.2 }),
                item.label
              );
            })
          )
        )
      )
    ),
    h(
      "div",
      { className: "mt-auto space-y-4" },
      h(
        "div",
        { className: "rounded-2xl border border-white/10 bg-white/7 p-3" },
        h("div", { className: "flex items-center gap-3" },
          h("div", { className: "grid h-10 w-10 place-items-center rounded-full bg-brikoOrange text-sm font-black" }, "KN"),
          h("div", null,
            h("div", { className: "text-sm font-black" }, "Koffi N'Guessan"),
            h("div", { className: "text-xs text-white/55" }, "Dispatcher")
          )
        )
      ),
      h("button", { className: "flex items-center gap-2 px-2 text-sm font-bold text-white/65 hover:text-white" },
        h(ChevronsLeft, { size: 17 }),
        "Collapse"
      )
    )
  );
}
