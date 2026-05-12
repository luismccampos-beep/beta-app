import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { type VariantProps } from "class-variance-authority";
declare const Popover: React.FC<PopoverPrimitive.PopoverProps>;
declare const PopoverAnchor: React.ForwardRefExoticComponent<PopoverPrimitive.PopoverAnchorProps & React.RefAttributes<HTMLDivElement>>;
declare const popoverTriggerVariants: (props?: ({
    variant?: "default" | "outline" | "ghost" | null | undefined;
    size?: "sm" | "md" | "lg" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export interface PopoverTriggerProps extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger>, VariantProps<typeof popoverTriggerVariants> {
}
declare const PopoverTrigger: React.ForwardRefExoticComponent<PopoverTriggerProps & React.RefAttributes<HTMLButtonElement>>;
declare const popoverContentVariants: (props?: ({
    size?: "sm" | "md" | "lg" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export interface PopoverContentProps extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>, VariantProps<typeof popoverContentVariants> {
    showArrow?: boolean;
    animated?: boolean;
}
declare const PopoverContent: React.ForwardRefExoticComponent<PopoverContentProps & React.RefAttributes<HTMLDivElement>>;
export interface PopoverCloseProps extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Close> {
    icon?: React.ReactNode;
}
declare const PopoverClose: React.ForwardRefExoticComponent<PopoverCloseProps & React.RefAttributes<HTMLButtonElement>>;
export { Popover, PopoverTrigger, PopoverContent, PopoverClose, PopoverAnchor };
