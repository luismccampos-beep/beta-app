import { Loader2 } from 'lucide-react'
import { cn } from '@akmleva/shared'

export interface FullPageLoadingProps {
  message?: string
  className?: string
  /** If true, renders with a backdrop overlay. If false, replaces content. */
  isOverlay?: boolean
}

function FullPageLoading({ 
  message = 'Loading...', 
  className,
  isOverlay = false
}: FullPageLoadingProps) {
  
  const baseStyles = "flex flex-col items-center justify-center gap-3 text-muted-foreground"
  
  // If overlay, we fix it to the viewport with a high Z-index and backdrop blur
  const containerStyles = isOverlay 
    ? "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
    : "min-h-screen w-full bg-background"

  return (
    <div 
      className={cn(baseStyles, containerStyles, className)} 
      role="status"
      aria-label={message}
    >
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      {message && (
        <span className="text-sm font-medium animate-pulse">{message}</span>
      )}
      <span className="sr-only">Loading content, please wait...</span>
    </div>
  )
}

export default FullPageLoading;
