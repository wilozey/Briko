import React from "https://esm.sh/react@18.3.1";
import {
  BarChart3,
  BellRing,
  ClipboardList,
  Gauge,
  LayoutDashboard,
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
      { label: "Command", icon: Gauge }
    ]
  },
  {
    label: "Capture",
    items: [
      { label: "Public booking", icon: LayoutDashboard },
      { label: "Customer intake", icon: BellRing }
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
      { label: "Strategy", icon: Sparkles }
    ]
  }
];

export function Sidebar() {
  return h(
    "aside",
    {
      className:
        "hidden border-r border-white/10 bg-brikoDeep px-4 py-5 text-white lg:flex lg:min-h-screen lg:flex-col"
    },
    h(
      "div",
      { className: "flex items-center gap-3 px-2" },
      h("div", {
        className:
          "grid h-11 w-11 place-items-center rounded-2xl bg-white text-xl font-black text-brikoDeep shadow-soft",
        children: "B"
      }),
      h("div", null, h("div", { className: "text-lg font-black" }, "Briko"), h("div", { className: "text-xs text-white/55" }, "Dispatch OS"))
    ),
    h(
      "nav",
      { className: "mt-8 space-y-7" },
      groups.map((group) =>
        h(
          "section",
          { key: group.label },
          h("p", { className: "mb-2 px-2 text-[11px] font-black uppercase tracking-wide text-white/35" }, group.label),
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
                    "flex h-10 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-bold transition",
                    item.active ? "bg-white text-brikoDeep shadow-soft" : "text-white/72 hover:bg-white/8 hover:text-white"
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
      { className: "mt-auto rounded-2xl border border-white/10 bg-white/7 p-3" },
      h("div", { className: "flex items-center gap-3" },
        h("div", { className: "grid h-10 w-10 place-items-center rounded-xl bg-brikoGreen font-black" }, "KN"),
        h("div", null,
          h("div", { className: "text-sm font-black" }, "Koffi N'Guessan"),
          h("div", { className: "text-xs text-white/50" }, "Dispatcher")
        )
      )
    )
  );
}
