import * as React from "react";
export interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    withIcon?: boolean;
    withText?: boolean;
    variant?: 'default' | 'white' | 'dark';
}
export declare const Logo: React.ForwardRefExoticComponent<LogoProps & React.RefAttributes<HTMLDivElement>>;
export default Logo;
