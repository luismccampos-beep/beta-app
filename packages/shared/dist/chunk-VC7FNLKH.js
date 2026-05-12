import {
  cn
} from "./chunk-CDRKFMWH.js";

// src/components/admin/Sidebar/SidebarSearch.tsx
import React from "react";
import { Search, X } from "lucide-react";
var SidebarSearch = ({
  query,
  onQueryChange,
  results,
  isCollapsed = false,
  placeholder = "Search...",
  onSelectResult
}) => {
  const handleClear = () => {
    onQueryChange("");
  };
  const handleSelect = (item) => {
    if (onSelectResult) {
      onSelectResult(item);
    }
  };
  if (isCollapsed) {
    return null;
  }
  return /* @__PURE__ */ React.createElement("div", { className: "relative" }, /* @__PURE__ */ React.createElement("div", { className: "relative" }, /* @__PURE__ */ React.createElement(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" }), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      value: query,
      onChange: (e) => onQueryChange(e.target.value),
      placeholder,
      className: cn(
        "w-full pl-10 pr-10 py-2 bg-muted/50 border border-border rounded-lg",
        "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
        "text-sm placeholder:text-muted-foreground"
      )
    }
  ), query && /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: handleClear,
      className: "absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
    },
    /* @__PURE__ */ React.createElement(X, { className: "w-4 h-4" })
  )), query && results.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "absolute top-full left-0 right-0 mt-2 bg-popover border rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto" }, /* @__PURE__ */ React.createElement("div", { className: "p-2" }, results.map((item) => /* @__PURE__ */ React.createElement(
    "div",
    {
      key: item.id,
      onClick: () => handleSelect(item),
      className: "flex items-center gap-3 p-2 rounded-md hover:bg-muted cursor-pointer transition-colors"
    },
    item.icon && /* @__PURE__ */ React.createElement(item.icon, { className: "w-4 h-4 text-muted-foreground" }),
    /* @__PURE__ */ React.createElement("div", { className: "flex-1 min-w-0" }, /* @__PURE__ */ React.createElement("div", { className: "text-sm font-medium truncate" }, item.label), item.description && /* @__PURE__ */ React.createElement("div", { className: "text-xs text-muted-foreground truncate" }, item.description))
  )))));
};

export {
  SidebarSearch
};
//# sourceMappingURL=chunk-VC7FNLKH.js.map