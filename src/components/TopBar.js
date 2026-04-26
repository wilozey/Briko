import React from "https://esm.sh/react@18.3.1";
import { Bell, Download, Plus, Search } from "https://esm.sh/lucide-react@0.468.0";

const h = React.createElement;

export function TopBar({ query, setQuery }) {
  return h(
    "header",
    { className: "mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between" },
    h("div", null,
      h("p", { className: "text-xs font-black uppercase tracking-wide text-brikoGreen" }, "Operate"),
      h("h1", { className: "text-3xl font-black tracking-tight text-brikoDeep" }, "Dispatch board")
    ),
    h(
      "div",
      { className: "flex flex-col gap-2 sm:flex-row sm:items-center" },
      h(
        "label",
        {
          className:
            "flex h-11 min-w-0 items-center gap-2 rounded-2xl border border-brikoBorder bg-white px-3 shadow-soft sm:w-[340px]"
        },
        h(Search, { size: 18, className: "text-brikoGreen" }),
        h("input", {
          className: "min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-[#877f71]",
          placeholder: "Search jobs, phone, artisan...",
          value: query,
          onChange: (event) => setQuery(event.target.value)
        })
      ),
      h("button", {
        className:
          "inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-brikoGreen px-4 text-sm font-black text-white shadow-soft"
      }, h(Plus, { size: 18 }), "New job"),
      h("button", {
        className:
          "inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-brikoBorder bg-white px-4 text-sm font-black text-brikoDeep shadow-soft"
      }, h(Download, { size: 18 }), "Export"),
      h(
        "button",
        { className: "relative grid h-11 w-11 place-items-center rounded-2xl border border-brikoBorder bg-white shadow-soft" },
        h(Bell, { size: 19 }),
        h("span", { className: "absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-brikoRed ring-2 ring-white" })
      )
    )
  );
}
