import { Loader2 } from 'lucide-react'
import { cn } from './utils'

interface SpinnerProps {
  className?: string
  size?: 'sm' | 'default' | 'lg'
}

const sizeClasses = {
  sm: 'h-4 w-4',
  default: 'h-5 w-5',
  lg: 'h-8 w-8',
}

function Spinner({ className, size = 'default' }: SpinnerProps) {
  return (
    <Loader2
      className={cn('animate-spin text-current', sizeClasses[size], className)}
      aria-hidden="true"
    />
  )
}

export { Spinner }
