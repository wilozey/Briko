import React from "https://esm.sh/react@18.3.1";
import { Clock, ClipboardList, TrendingUp, UserRoundX, UsersRound } from "https://esm.sh/lucide-react@0.468.0";

const h = React.createElement;

const icons = [ClipboardList, UserRoundX, Clock, TrendingUp, UsersRound];
const tones = {
  orange: "bg-orange-50 text-brikoOrange",
  red: "bg-red-50 text-brikoRed",
  green: "bg-green-50 text-brikoGreen",
  blue: "bg-blue-50 text-blue-700"
};

export function KpiBar({ kpis }) {
  return h(
    "section",
    { className: "mt-3 grid gap-3 rounded-2xl border border-brikoBorder bg-white p-3 shadow-soft sm:grid-cols-2 xl:grid-cols-5" },
    kpis.map((kpi, index) => {
      const Icon = icons[index] || ClipboardList;
      return h("article", { key: kpi.label, className: "flex items-center gap-3 xl:border-r xl:border-brikoBorder xl:last:border-r-0" },
        h("div", { className: ["grid h-12 w-12 place-items-center rounded-xl", tones[kpi.tone] || tones.green].join(" ") }, h(Icon, { size: 22 })),
        h("div", null,
          h("p", { className: "text-xs font-black text-brikoText" }, kpi.label),
          h("strong", { className: "block text-2xl font-black leading-none text-brikoText" }, kpi.value),
          h("span", { className: ["text-[11px] font-semibold", kpi.tone === "red" ? "text-brikoRed" : "text-brikoMuted"].join(" ") }, kpi.detail)
        )
      );
    })
  );
}
