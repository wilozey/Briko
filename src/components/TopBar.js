import React from "https://esm.sh/react@18.3.1";
import { Bell, Download, Menu, Plus, Search } from "https://esm.sh/lucide-react@0.468.0";

const h = React.createElement;

export function TopBar({ query, setQuery }) {
  return h(
    "header",
    { className: "mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between" },
    h("div", { className: "flex items-center gap-4" },
      h("button", { className: "grid h-10 w-10 place-items-center rounded-xl bg-white text-brikoText shadow-soft lg:hidden" }, h(Menu, { size: 21 })),
      h("div", null,
        h("p", { className: "text-xs font-black uppercase tracking-wide text-brikoGreen" }, "Briko Services"),
        h("h1", { className: "text-3xl font-black tracking-tight text-brikoText" }, "Dispatch board")
      )
    ),
    h(
      "div",
      { className: "flex flex-col gap-2 sm:flex-row sm:items-center" },
      h(
        "label",
        {
          className:
            "flex h-11 min-w-0 items-center gap-2 rounded-xl border border-brikoBorder bg-white px-3 shadow-soft sm:w-[430px]"
        },
        h(Search, { size: 18, className: "text-brikoMuted" }),
        h("input", {
          className: "min-w-0 flex-1 bg-transparent text-sm font-semibold text-brikoText outline-none placeholder:text-brikoMuted",
          placeholder: "Search jobs, phone, artisan...",
          value: query,
          onChange: (event) => setQuery(event.target.value)
        }),
        h("kbd", { className: "hidden rounded-lg bg-[#F5F1E8] px-2 py-1 text-xs font-bold text-brikoMuted sm:block" }, "⌘ K")
      ),
      h("button", {
        className:
          "inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brikoOrange px-4 text-sm font-black text-white shadow-soft"
      }, h(Plus, { size: 18 }), "New job"),
      h("button", {
        className:
          "inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-brikoBorder bg-white px-4 text-sm font-black text-brikoText shadow-soft"
      }, h(Download, { size: 18 }), "Export"),
      h(
        "button",
        { className: "relative grid h-11 w-11 place-items-center rounded-xl border border-brikoBorder bg-white shadow-soft" },
        h(Bell, { size: 19 }),
        h("span", { className: "absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-brikoRed text-[11px] font-black text-white ring-2 ring-white" }, "3")
      )
    )
  );
}
