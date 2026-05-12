import {
  cn
} from "./chunk-CDRKFMWH.js";

// src/components/admin/Sidebar/NavItem.tsx
import React from "react";
import { motion } from "framer-motion";
import { ChevronRight, ExternalLink } from "lucide-react";
var NavItem = ({
  item,
  isActive = false,
  isCollapsed = false,
  onClick,
  className
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(item);
    } else if (item.href) {
      if (item.external) {
        window.open(item.href, "_blank");
      } else {
        window.location.href = item.href;
      }
    }
  };
  return /* @__PURE__ */ React.createElement(
    motion.div,
    {
      whileHover: { x: 2 },
      whileTap: { scale: 0.98 },
      className: cn(
        "group relative flex items-center gap-3 px-3 py-2 rounded-lg transition-all cursor-pointer",
        "hover:bg-muted/50",
        isActive && "bg-primary/10 text-primary font-medium",
        isCollapsed && "justify-center px-2",
        item.isDisabled && "opacity-50 cursor-not-allowed",
        className
      ),
      onClick: handleClick
    },
    item.icon && /* @__PURE__ */ React.createElement("div", { className: cn(
      "flex-shrink-0 transition-colors",
      isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
    ) }, /* @__PURE__ */ React.createElement(item.icon, { className: "w-5 h-5" })),
    !isCollapsed && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "flex-1 min-w-0" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement("span", { className: cn(
      "text-sm font-medium truncate",
      isActive ? "text-primary" : "text-foreground"
    ) }, item.label), item.badge && /* @__PURE__ */ React.createElement("span", { className: "ml-2 px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full" }, item.badge)), item.description && /* @__PURE__ */ React.createElement("p", { className: "text-xs text-muted-foreground truncate mt-0.5" }, item.description)), item.external && /* @__PURE__ */ React.createElement(ExternalLink, { className: "w-3 h-3 text-muted-foreground" }), item.children && item.children.length > 0 && /* @__PURE__ */ React.createElement(ChevronRight, { className: "w-4 h-4 text-muted-foreground group-hover:text-foreground transition-transform" })),
    isCollapsed && /* @__PURE__ */ React.createElement("div", { className: "absolute left-full ml-2 px-2 py-1 bg-popover border rounded-md text-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50" }, item.label, item.description && /* @__PURE__ */ React.createElement("div", { className: "text-xs text-muted-foreground mt-0.5" }, item.description))
  );
};

export {
  NavItem
};
//# sourceMappingURL=chunk-7MUGDIVR.js.map