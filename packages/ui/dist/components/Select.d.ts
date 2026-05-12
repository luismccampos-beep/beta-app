import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
export interface SelectProps extends Omit<SelectPrimitive.SelectProps, "onValueChange" | "value"> {
    onValueChange?: (value: string) => void;
    value?: string;
    children?: React.ReactNode;
    disabled?: boolean;
    className?: string;
    triggerClassName?: string;
    contentClassName?: string;
    itemClassName?: string;
    labelClassName?: string;
    placeholder?: string;
    position?: "popper" | "item-aligned";
    size?: "sm" | "md" | "lg";
    variant?: "default" | "outline" | "ghost";
}
declare const Select: React.FC<SelectProps>;
declare const SelectGroup: React.ForwardRefExoticComponent<SelectPrimitive.SelectGroupProps & React.RefAttributes<HTMLDivElement>>;
declare const SelectValue: React.ForwardRefExoticComponent<SelectPrimitive.SelectValueProps & React.RefAttributes<HTMLSpanElement>>;
declare const SelectTrigger: React.ForwardRefExoticComponent<Omit<SelectPrimitive.SelectTriggerProps & React.RefAttributes<HTMLButtonElement>, "ref"> & {
    size?: "sm" | "md" | "lg";
    variant?: "default" | "outline" | "ghost";
} & React.RefAttributes<HTMLButtonElement>>;
declare const SelectScrollUpButton: React.ForwardRefExoticComponent<Omit<SelectPrimitive.SelectScrollUpButtonProps & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
declare const SelectScrollDownButton: React.ForwardRefExoticComponent<Omit<SelectPrimitive.SelectScrollDownButtonProps & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
declare const SelectContent: React.ForwardRefExoticComponent<Omit<SelectPrimitive.SelectContentProps & React.RefAttributes<HTMLDivElement>, "ref"> & {
    size?: "sm" | "md" | "lg";
    variant?: "default" | "outline" | "ghost";
} & React.RefAttributes<HTMLDivElement>>;
declare const SelectLabel: React.ForwardRefExoticComponent<Omit<SelectPrimitive.SelectLabelProps & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
declare const SelectItem: React.ForwardRefExoticComponent<Omit<SelectPrimitive.SelectItemProps & React.RefAttributes<HTMLDivElement>, "ref"> & {
    size?: "sm" | "md" | "lg";
    variant?: "default" | "outline" | "ghost";
} & React.RefAttributes<HTMLDivElement>>;
declare const SelectSeparator: React.ForwardRefExoticComponent<Omit<SelectPrimitive.SelectSeparatorProps & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
export { Select, SelectGroup, SelectContent, SelectValue, SelectTrigger, SelectLabel, SelectItem, SelectSeparator, SelectScrollUpButton, SelectScrollDownButton, };
