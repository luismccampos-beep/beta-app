import {
  cn
} from "./chunk-CDRKFMWH.js";

// src/components/admin/AdminBreadcrumbs/index.tsx
import React from "react";
import { ChevronRight, Home } from "lucide-react";
var AdminBreadcrumbs = ({
  items,
  separator = /* @__PURE__ */ React.createElement(ChevronRight, { className: "w-4 h-4 text-muted-foreground" }),
  showHome = true,
  homeHref = "/admin",
  className,
  maxItems = 5
}) => {
  const handleNavigation = (href) => {
    window.location.href = href;
  };
  const displayItems = items.length > maxItems ? [
    ...items.slice(0, Math.floor(maxItems / 2) - 1),
    { label: "...", isActive: false },
    ...items.slice(-Math.floor(maxItems / 2))
  ] : items;
  return /* @__PURE__ */ React.createElement("nav", { className: cn("flex items-center space-x-1 text-sm", className) }, showHome && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => handleNavigation(homeHref),
      className: "flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors"
    },
    /* @__PURE__ */ React.createElement(Home, { className: "w-4 h-4" }),
    /* @__PURE__ */ React.createElement("span", { className: "hidden sm:inline" }, "Home")
  ), displayItems.length > 0 && separator), displayItems.map((item, index) => {
    const isLast = index === displayItems.length - 1;
    const isEllipsis = item.label === "...";
    return /* @__PURE__ */ React.createElement(React.Fragment, { key: index }, isEllipsis ? /* @__PURE__ */ React.createElement("span", { className: "text-muted-foreground" }, "...") : /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => item.href && !isLast && handleNavigation(item.href),
        disabled: !item.href || isLast,
        className: cn(
          "flex items-center space-x-1 transition-colors",
          item.isActive || isLast ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground",
          (!item.href || isLast) && "cursor-default"
        )
      },
      item.icon && /* @__PURE__ */ React.createElement("span", null, item.icon),
      /* @__PURE__ */ React.createElement("span", null, item.label)
    ), !isLast && !isEllipsis && separator);
  }));
};
var AdminBreadcrumbs_default = AdminBreadcrumbs;

export {
  AdminBreadcrumbs,
  AdminBreadcrumbs_default
};
//# sourceMappingURL=chunk-2GRZZY7C.js.map