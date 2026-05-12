import * as React from "react";
export interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
    size?: "sm" | "md" | "lg" | "default";
}
declare const LoadingSpinner: React.ForwardRefExoticComponent<LoadingSpinnerProps & React.RefAttributes<HTMLDivElement>>;
export { LoadingSpinner };
