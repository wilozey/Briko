import React from "https://esm.sh/react@18.3.1";

const h = React.createElement;

export function ColorSwatch({ name, hex }) {
  return h(
    "article",
    null,
    h("div", { className: "h-9 rounded-md border border-black/5", style: { backgroundColor: hex } }),
    h("p", { className: "mt-2 text-[11px] font-black text-brikoText" }, name),
    h("p", { className: "text-[11px] font-semibold text-brikoMuted" }, hex)
  );
}
