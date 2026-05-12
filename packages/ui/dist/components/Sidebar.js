"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import { cn } from "../utils/cn";
export const Sidebar = React.forwardRef(({ children, className, isOpen, ...props }, ref) => {
    return (_jsx("aside", { ref: ref, className: cn("sidebar", isOpen ? "open" : "", className), ...props, children: children }));
});
Sidebar.displayName = "Sidebar";
export const SidebarHeader = React.forwardRef(({ children, className, ...props }, ref) => {
    return (_jsx("div", { ref: ref, className: cn("sidebar-header", className), ...props, children: children }));
});
SidebarHeader.displayName = "SidebarHeader";
export const SidebarContent = React.forwardRef(({ children, className, ...props }, ref) => {
    return (_jsx("div", { ref: ref, className: cn("sidebar-content", className), ...props, children: children }));
});
SidebarContent.displayName = "SidebarContent";
export const SidebarFooter = React.forwardRef(({ children, className, ...props }, ref) => {
    return (_jsx("div", { ref: ref, className: cn("sidebar-footer", className), ...props, children: children }));
});
SidebarFooter.displayName = "SidebarFooter";
export const SidebarGroup = React.forwardRef(({ children, className, ...props }, ref) => {
    return (_jsx("div", { ref: ref, className: cn("sidebar-group", className), ...props, children: children }));
});
SidebarGroup.displayName = "SidebarGroup";
export const SidebarGroupLabel = React.forwardRef(({ children, className, ...props }, ref) => {
    return (_jsx("div", { ref: ref, className: cn("sidebar-group-label", className), ...props, children: children }));
});
SidebarGroupLabel.displayName = "SidebarGroupLabel";
export const SidebarGroupContent = React.forwardRef(({ children, className, ...props }, ref) => {
    return (_jsx("div", { ref: ref, className: cn("sidebar-group-content", className), ...props, children: children }));
});
SidebarGroupContent.displayName = "SidebarGroupContent";
export const SidebarMenu = React.forwardRef(({ children, className, ...props }, ref) => {
    return (_jsx("ul", { ref: ref, className: cn("sidebar-menu", className), ...props, children: children }));
});
SidebarMenu.displayName = "SidebarMenu";
export const SidebarMenuItem = React.forwardRef(({ children, className, ...props }, ref) => {
    return (_jsx("li", { ref: ref, className: cn("sidebar-menu-item", className), ...props, children: children }));
});
SidebarMenuItem.displayName = "SidebarMenuItem";
export const SidebarMenuButton = React.forwardRef(({ children, className, ...props }, ref) => {
    return (_jsx("button", { ref: ref, className: cn("sidebar-menu-button", className), ...props, children: children }));
});
SidebarMenuButton.displayName = "SidebarMenuButton";
export const SidebarTrigger = React.forwardRef(({ children, className, ...props }, ref) => {
    return (_jsx("button", { ref: ref, className: cn("sidebar-trigger", className), ...props, children: children }));
});
SidebarTrigger.displayName = "SidebarTrigger";
export const SidebarInset = React.forwardRef(({ children, className, ...props }, ref) => {
    return (_jsx("div", { ref: ref, className: cn("sidebar-inset", className), ...props, children: children }));
});
SidebarInset.displayName = "SidebarInset";
export const SidebarContext = React.createContext(undefined);
export const SidebarProvider = ({ children, }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const toggleSidebar = React.useCallback(() => setIsOpen((prev) => !prev), []);
    return (_jsx(SidebarContext.Provider, { value: { isOpen, setIsOpen, toggleSidebar }, children: children }));
};
export const useSidebar = () => {
    const context = React.useContext(SidebarContext);
    if (!context) {
        throw new Error("useSidebar must be used within a SidebarProvider");
    }
    return context;
};
//# sourceMappingURL=Sidebar.js.map