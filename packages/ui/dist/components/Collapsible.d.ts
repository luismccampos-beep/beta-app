import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { type VariantProps } from "class-variance-authority";
import * as React from "react";
declare const collapsibleTriggerVariants: (props?: ({
    variant?: "default" | "outline" | "filled" | null | undefined;
    size?: "sm" | "md" | "lg" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export interface CollapsibleProps extends React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Root> {
    animated?: boolean;
}
declare const Collapsible: React.ForwardRefExoticComponent<CollapsibleProps & React.RefAttributes<HTMLDivElement>>;
export interface CollapsibleTriggerProps extends React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.CollapsibleTrigger>, VariantProps<typeof collapsibleTriggerVariants> {
    icon?: React.ReactNode;
    showChevron?: boolean;
    asChild?: boolean;
}
declare const CollapsibleTrigger: React.ForwardRefExoticComponent<CollapsibleTriggerProps & React.RefAttributes<HTMLButtonElement>>;
export interface CollapsibleContentProps extends React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.CollapsibleContent> {
    animated?: boolean;
}
declare const CollapsibleContent: React.ForwardRefExoticComponent<CollapsibleContentProps & React.RefAttributes<HTMLDivElement>>;
interface CollapsibleGroupProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    spacing?: "sm" | "md" | "lg";
}
declare const CollapsibleGroup: React.ForwardRefExoticComponent<CollapsibleGroupProps & React.RefAttributes<HTMLDivElement>>;
export { Collapsible, CollapsibleTrigger, CollapsibleContent, CollapsibleGroup, collapsibleTriggerVariants, };
