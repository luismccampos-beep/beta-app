import * as React from "react";
export interface NotificationBellProps extends React.HTMLAttributes<HTMLDivElement> {
    iconClassName?: string;
    badgeClassName?: string;
}
declare const NotificationBell: React.ForwardRefExoticComponent<NotificationBellProps & React.RefAttributes<HTMLDivElement>>;
export { NotificationBell };
export default NotificationBell;
