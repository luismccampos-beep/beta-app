import * as React from "react"

import { cn } from "../utils/cn"

export interface NotificationBellProps extends React.HTMLAttributes<HTMLDivElement> {
  iconClassName?: string
  badgeClassName?: string
}

const NotificationBell = React.forwardRef<HTMLDivElement, NotificationBellProps>(
  ({ className, iconClassName: _iconClassName, badgeClassName: _badgeClassName, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("relative", className)} {...props}>
        Bell
      </div>
    )
  }
)
NotificationBell.displayName = "NotificationBell"

export { NotificationBell }
export default NotificationBell
