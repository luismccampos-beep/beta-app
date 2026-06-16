import {
  cn
} from "./chunk-CDRKFMWH.js";

// src/components/admin/Sidebar/NavItem.tsx
import { motion } from "framer-motion";
import { ChevronRight, ExternalLink } from "lucide-react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
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
  return /* @__PURE__ */ jsxs(
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
      onClick: handleClick,
      children: [
        item.icon && /* @__PURE__ */ jsx("div", { className: cn(
          "flex-shrink-0 transition-colors",
          isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
        ), children: /* @__PURE__ */ jsx(item.icon, { className: "w-5 h-5" }) }),
        !isCollapsed && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("span", { className: cn(
                "text-sm font-medium truncate",
                isActive ? "text-primary" : "text-foreground"
              ), children: item.label }),
              item.badge && /* @__PURE__ */ jsx("span", { className: "ml-2 px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full", children: item.badge })
            ] }),
            item.description && /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground truncate mt-0.5", children: item.description })
          ] }),
          item.external && /* @__PURE__ */ jsx(ExternalLink, { className: "w-3 h-3 text-muted-foreground" }),
          item.children && item.children.length > 0 && /* @__PURE__ */ jsx(ChevronRight, { className: "w-4 h-4 text-muted-foreground group-hover:text-foreground transition-transform" })
        ] }),
        isCollapsed && /* @__PURE__ */ jsxs("div", { className: "absolute left-full ml-2 px-2 py-1 bg-popover border rounded-md text-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50", children: [
          item.label,
          item.description && /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground mt-0.5", children: item.description })
        ] })
      ]
    }
  );
};

export {
  NavItem
};
//# sourceMappingURL=chunk-H6LIMLK5.js.map