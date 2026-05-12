import {
  NavItem
} from "./chunk-7MUGDIVR.js";
import {
  SidebarSearch
} from "./chunk-VC7FNLKH.js";
import {
  cn
} from "./chunk-CDRKFMWH.js";

// src/components/admin/Sidebar/index.tsx
import React, { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, LogOut } from "lucide-react";
var Sidebar = ({
  navigation,
  isCollapsed = false,
  onToggleCollapse,
  className,
  user,
  searchPlaceholder = "Search...",
  showSearch = true,
  showUser = true,
  variant = "default"
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const results = [];
    navigation.forEach((section) => {
      section.items.forEach((item) => {
        const searchLower = searchQuery.toLowerCase();
        const labelMatch = item.label.toLowerCase().includes(searchLower);
        const descMatch = item.description?.toLowerCase().includes(searchLower);
        if (labelMatch || descMatch) {
          results.push(item);
        }
        if (item.children) {
          item.children.forEach((child) => {
            const childLabelMatch = child.label.toLowerCase().includes(searchLower);
            const childDescMatch = child.description?.toLowerCase().includes(searchLower);
            if (childLabelMatch || childDescMatch) {
              results.push(child);
            }
          });
        }
      });
    });
    return results.slice(0, 8);
  }, [navigation, searchQuery]);
  const handleNavigate = useCallback((item) => {
    if (item.external) {
      window.open(item.href, "_blank", "noopener,noreferrer");
    } else {
      window.location.href = item.href;
    }
    setSearchQuery("");
  }, []);
  const handleSearchSelect = useCallback((item) => {
    handleNavigate(item);
  }, [handleNavigate]);
  const handleUserAction = useCallback((action) => {
    if (action === "logout") {
      window.location.href = "/logout";
    } else if (action === "profile") {
      window.location.href = "/profile";
    }
    setIsUserMenuOpen(false);
  }, []);
  const renderNavigationSection = useCallback((section) => /* @__PURE__ */ React.createElement("div", { key: section.id, className: "mb-6" }, !isCollapsed && section.title && /* @__PURE__ */ React.createElement("h3", { className: "px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2" }, section.title), /* @__PURE__ */ React.createElement("div", { className: cn("space-y-1", isCollapsed && "space-y-2") }, section.items.map((item) => /* @__PURE__ */ React.createElement(
    NavItem,
    {
      key: item.id,
      item,
      isCollapsed,
      onClick: handleNavigate
    }
  )))), [isCollapsed, handleNavigate]);
  return /* @__PURE__ */ React.createElement(
    motion.aside,
    {
      initial: false,
      animate: {
        width: isCollapsed ? variant === "minimal" ? 60 : 80 : 280
      },
      className: cn(
        "relative flex flex-col bg-card border-r border-border h-full",
        "transition-all duration-300 ease-in-out",
        className
      )
    },
    /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between p-4 border-b border-border" }, !isCollapsed && /* @__PURE__ */ React.createElement(
      motion.h2,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        className: "text-lg font-semibold text-foreground"
      },
      variant === "minimal" ? "" : "Admin"
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: onToggleCollapse,
        className: "p-1.5 rounded-lg hover:bg-muted transition-colors",
        "aria-label": isCollapsed ? "Expand sidebar" : "Collapse sidebar"
      },
      isCollapsed ? /* @__PURE__ */ React.createElement(Menu, { className: "w-4 h-4" }) : /* @__PURE__ */ React.createElement(X, { className: "w-4 h-4" })
    )),
    showSearch && /* @__PURE__ */ React.createElement("div", { className: "p-4 border-b border-border" }, /* @__PURE__ */ React.createElement(
      SidebarSearch,
      {
        query: searchQuery,
        onQueryChange: setSearchQuery,
        results: searchResults,
        isCollapsed,
        placeholder: searchPlaceholder,
        onSelectResult: handleSearchSelect
      }
    )),
    /* @__PURE__ */ React.createElement("nav", { className: "flex-1 overflow-y-auto p-4", "aria-label": "Main navigation" }, /* @__PURE__ */ React.createElement(AnimatePresence, { mode: "wait" }, navigation.map(renderNavigationSection))),
    showUser && user && /* @__PURE__ */ React.createElement("div", { className: "p-4 border-t border-border" }, /* @__PURE__ */ React.createElement("div", { className: "relative" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => setIsUserMenuOpen(!isUserMenuOpen),
        className: cn(
          "w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors",
          isCollapsed && "justify-center"
        ),
        "aria-label": "User menu",
        "aria-expanded": isUserMenuOpen
      },
      /* @__PURE__ */ React.createElement("div", { className: "w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0" }, user.avatar ? /* @__PURE__ */ React.createElement(
        "img",
        {
          src: user.avatar,
          alt: user.name,
          className: "w-full h-full rounded-full object-cover"
        }
      ) : /* @__PURE__ */ React.createElement(User, { className: "w-4 h-4 text-primary" })),
      !isCollapsed && /* @__PURE__ */ React.createElement("div", { className: "flex-1 text-left min-w-0" }, /* @__PURE__ */ React.createElement("div", { className: "text-sm font-medium text-foreground truncate" }, user.name), /* @__PURE__ */ React.createElement("div", { className: "text-xs text-muted-foreground truncate" }, user.email))
    ), /* @__PURE__ */ React.createElement(AnimatePresence, null, isUserMenuOpen && !isCollapsed && /* @__PURE__ */ React.createElement(
      motion.div,
      {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 10 },
        className: "absolute bottom-full left-0 right-0 mb-2 bg-popover border rounded-lg shadow-lg z-50",
        role: "menu"
      },
      /* @__PURE__ */ React.createElement("div", { className: "p-1" }, /* @__PURE__ */ React.createElement(
        "button",
        {
          onClick: () => handleUserAction("profile"),
          className: "w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted rounded-md transition-colors",
          role: "menuitem"
        },
        /* @__PURE__ */ React.createElement(User, { className: "w-4 h-4" }),
        "Profile"
      ), /* @__PURE__ */ React.createElement(
        "button",
        {
          onClick: () => handleUserAction("logout"),
          className: "w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted rounded-md transition-colors text-red-600",
          role: "menuitem"
        },
        /* @__PURE__ */ React.createElement(LogOut, { className: "w-4 h-4" }),
        "Logout"
      ))
    ))))
  );
};
var Sidebar_default = Sidebar;

export {
  Sidebar,
  Sidebar_default
};
//# sourceMappingURL=chunk-BLBDBE6C.js.map