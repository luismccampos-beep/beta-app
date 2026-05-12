import React from 'react'
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary'

export interface ErrorFallbackProps {
  error?: Error
  resetError: () => void
}

interface Props {
  fallback: React.ComponentType<ErrorFallbackProps>
  showErrorDetails?: boolean
  children: React.ReactNode
}

const ErrorBoundary: React.FC<Props> = ({ fallback: Fallback, showErrorDetails = false, children }) => {
  return (
    <ReactErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => (
        <Fallback error={showErrorDetails ? (error as Error) : undefined} resetError={resetErrorBoundary} />
      )}
    >
      {children}
    </ReactErrorBoundary>
  )
}

export { ErrorBoundary };
export default ErrorBoundary;
export type { Props as ErrorBoundaryProps };
