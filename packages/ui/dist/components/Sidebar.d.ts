import * as React from "react";
export interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
    isOpen?: boolean;
    onClose?: () => void;
}
export declare const Sidebar: React.ForwardRefExoticComponent<SidebarProps & React.RefAttributes<HTMLElement>>;
export declare const SidebarHeader: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>>;
export declare const SidebarContent: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>>;
export declare const SidebarFooter: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>>;
export declare const SidebarGroup: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>>;
export declare const SidebarGroupLabel: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>>;
export declare const SidebarGroupContent: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>>;
export declare const SidebarMenu: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLUListElement> & React.RefAttributes<HTMLUListElement>>;
export declare const SidebarMenuItem: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLLIElement> & React.RefAttributes<HTMLLIElement>>;
export declare const SidebarMenuButton: React.ForwardRefExoticComponent<React.ButtonHTMLAttributes<HTMLButtonElement> & React.RefAttributes<HTMLButtonElement>>;
export declare const SidebarTrigger: React.ForwardRefExoticComponent<React.ButtonHTMLAttributes<HTMLButtonElement> & React.RefAttributes<HTMLButtonElement>>;
export declare const SidebarInset: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>>;
export interface SidebarContextType {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    toggleSidebar: () => void;
}
export declare const SidebarContext: React.Context<SidebarContextType | undefined>;
export declare const SidebarProvider: ({ children, }: {
    children: React.ReactNode;
}) => import("react/jsx-runtime").JSX.Element;
export declare const useSidebar: () => SidebarContextType;
