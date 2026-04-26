import React from "https://esm.sh/react@18.3.1";

const h = React.createElement;

export function KpiCard({ label, value }) {
  return h(
    "article",
    { className: "rounded-3xl border border-brikoBorder bg-white p-4 shadow-soft" },
    h("p", { className: "text-xs font-black uppercase tracking-wide text-[#8C8173]" }, label),
    h("strong", { className: "mt-2 block text-3xl font-black text-brikoDeep" }, value)
  );
}
