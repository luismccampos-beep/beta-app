import {
  cn
} from "./chunk-CDRKFMWH.js";

// src/components/admin/AdminBreadcrumbs/index.tsx
import React from "react";
import { ChevronRight, Home } from "lucide-react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var AdminBreadcrumbs = ({
  items,
  separator = /* @__PURE__ */ jsx(ChevronRight, { className: "w-4 h-4 text-muted-foreground" }),
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
  return /* @__PURE__ */ jsxs("nav", { className: cn("flex items-center space-x-1 text-sm", className), children: [
    showHome && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => handleNavigation(homeHref),
          className: "flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors",
          children: [
            /* @__PURE__ */ jsx(Home, { className: "w-4 h-4" }),
            /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: "Home" })
          ]
        }
      ),
      displayItems.length > 0 && separator
    ] }),
    displayItems.map((item, index) => {
      const isLast = index === displayItems.length - 1;
      const isEllipsis = item.label === "...";
      return /* @__PURE__ */ jsxs(React.Fragment, { children: [
        isEllipsis ? /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "..." }) : /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => item.href && !isLast && handleNavigation(item.href),
            disabled: !item.href || isLast,
            className: cn(
              "flex items-center space-x-1 transition-colors",
              item.isActive || isLast ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground",
              (!item.href || isLast) && "cursor-default"
            ),
            children: [
              item.icon && /* @__PURE__ */ jsx("span", { children: item.icon }),
              /* @__PURE__ */ jsx("span", { children: item.label })
            ]
          }
        ),
        !isLast && !isEllipsis && separator
      ] }, index);
    })
  ] });
};
var AdminBreadcrumbs_default = AdminBreadcrumbs;

export {
  AdminBreadcrumbs,
  AdminBreadcrumbs_default
};
//# sourceMappingURL=chunk-QHYA66TZ.js.map