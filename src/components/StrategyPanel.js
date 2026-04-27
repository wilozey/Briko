import React from "https://esm.sh/react@18.3.1";
import { Bot, Check, Clock, Filter, MapPinned, MousePointerClick, Target } from "https://esm.sh/lucide-react@0.468.0";
import { ColorSwatch } from "./ColorSwatch.js";

const h = React.createElement;
const icons = [MousePointerClick, Filter, MapPinned, Clock, Target, Bot];

export function StrategyPanel({ items, decisions, colors }) {
  return h(
    "section",
    { className: "mt-3 grid gap-4 rounded-2xl border border-brikoBorder bg-white p-5 shadow-soft xl:grid-cols-[1.2fr_0.8fr_0.9fr]" },
    h("div", null,
      h("h2", { className: "text-sm font-black uppercase tracking-wide text-brikoOrange" }, "What I would change / add"),
      h("div", { className: "mt-4 grid gap-3 sm:grid-cols-2" },
        items.map((item, index) => {
          const Icon = icons[index] || Check;
          return h("article", { key: item.title, className: "grid grid-cols-[38px_1fr] gap-3" },
            h("div", { className: "grid h-9 w-9 place-items-center rounded-lg bg-green-50 text-brikoGreen" }, h(Icon, { size: 19 })),
            h("div", null,
              h("h3", { className: "text-sm font-black text-brikoText" }, item.title),
              h("p", { className: "mt-1 text-xs font-semibold leading-snug text-brikoMuted" }, item.detail)
            )
          );
        })
      )
    ),
    h("div", { className: "border-t border-brikoBorder pt-4 xl:border-l xl:border-t-0 xl:pl-5 xl:pt-0" },
      h("h2", { className: "text-sm font-black uppercase tracking-wide text-brikoOrange" }, "Design decisions"),
      h("div", { className: "mt-4 space-y-3" },
        decisions.map((decision) =>
          h("div", { key: decision, className: "flex gap-3 text-sm" },
            h(Check, { size: 17, className: "mt-0.5 text-brikoGreen" }),
            h("p", { className: "font-semibold leading-snug text-brikoMuted" }, decision)
          )
        )
      )
    ),
    h("div", { className: "border-t border-brikoBorder pt-4 xl:border-l xl:border-t-0 xl:pl-5 xl:pt-0" },
      h("h2", { className: "text-sm font-black uppercase tracking-wide text-brikoRed" }, "Color system"),
      h("div", { className: "mt-4 grid grid-cols-2 gap-3" },
        colors.map((color) => h(ColorSwatch, { key: color.hex, ...color }))
      )
    )
  );
}
