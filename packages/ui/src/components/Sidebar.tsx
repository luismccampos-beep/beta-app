"use client"
import * as React from "react";

import { cn } from "../utils/cn";

export interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar = React.forwardRef<HTMLElement, SidebarProps>(
  ({ children, className, isOpen, ...props }, ref) => {
    return (
      <aside
        ref={ref}
        className={cn("sidebar", isOpen ? "open" : "", className)}
        {...props}
      >
        {children}
      </aside>
    );
  },
);
Sidebar.displayName = "Sidebar";

export const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("sidebar-header", className)} {...props}>
      {children}
    </div>
  );
});
SidebarHeader.displayName = "SidebarHeader";

export const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("sidebar-content", className)} {...props}>
      {children}
    </div>
  );
});
SidebarContent.displayName = "SidebarContent";

export const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("sidebar-footer", className)} {...props}>
      {children}
    </div>
  );
});
SidebarFooter.displayName = "SidebarFooter";

export const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("sidebar-group", className)} {...props}>
      {children}
    </div>
  );
});
SidebarGroup.displayName = "SidebarGroup";

export const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("sidebar-group-label", className)} {...props}>
      {children}
    </div>
  );
});
SidebarGroupLabel.displayName = "SidebarGroupLabel";

export const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("sidebar-group-content", className)}
      {...props}
    >
      {children}
    </div>
  );
});
SidebarGroupContent.displayName = "SidebarGroupContent";

export const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(({ children, className, ...props }, ref) => {
  return (
    <ul ref={ref} className={cn("sidebar-menu", className)} {...props}>
      {children}
    </ul>
  );
});
SidebarMenu.displayName = "SidebarMenu";

export const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement>
>(({ children, className, ...props }, ref) => {
  return (
    <li ref={ref} className={cn("sidebar-menu-item", className)} {...props}>
      {children}
    </li>
  );
});
SidebarMenuItem.displayName = "SidebarMenuItem";

export const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ children, className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn("sidebar-menu-button", className)}
      {...props}
    >
      {children}
    </button>
  );
});
SidebarMenuButton.displayName = "SidebarMenuButton";

export const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ children, className, ...props }, ref) => {
  return (
    <button ref={ref} className={cn("sidebar-trigger", className)} {...props}>
      {children}
    </button>
  );
});
SidebarTrigger.displayName = "SidebarTrigger";

export const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("sidebar-inset", className)} {...props}>
      {children}
    </div>
  );
});
SidebarInset.displayName = "SidebarInset";

export interface SidebarContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

export const SidebarContext = React.createContext<
  SidebarContextType | undefined
>(undefined);

export const SidebarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const toggleSidebar = React.useCallback(() => setIsOpen((prev) => !prev), []);

  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};
