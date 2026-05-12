"use client";

import React, { Component, type ReactNode } from 'react';
import { Button } from '@akmleva/ui';
import { AlertTriangle, RefreshCw } from 'lucide-react';

import { reportError, type ErrorReportContext } from '../../../logger';
import { sanitizeText } from '../../../utils/sanitize';

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  fallbackRender?: (context: {
    error?: Error;
    errorInfo?: React.ErrorInfo;
    resetError: () => void;
    reload: () => void;
  }) => ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  onRecover?: () => void;
  onRetry?: () => void;
  onReload?: () => void;
  resetKeys?: Array<unknown>;
  boundaryId?: string;
  reportToMonitoring?: boolean;
  showRetry?: boolean;
  customMessage?: string;
  className?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
  retryCount: number;
}

const didResetKeysChange = (prevKeys?: Array<unknown>, nextKeys?: Array<unknown>): boolean => {
  if (!prevKeys || !nextKeys) return false;
  if (prevKeys.length !== nextKeys.length) return true;


  for (let i = 0; i < prevKeys.length; i++) {
    // eslint-disable-next-line security/detect-object-injection
    const prevKey = prevKeys[i];
    // eslint-disable-next-line security/detect-object-injection
    const nextKey = nextKeys[i];
    if (!Object.is(prevKey, nextKey)) {
      return true;
    }
  }

  return false;
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, retryCount: 0 };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    if (this.props.reportToMonitoring !== false) {
      const context: ErrorReportContext = {};
      if (this.props.boundaryId) {
        context.boundaryId = this.props.boundaryId;
      }
      if (errorInfo.componentStack) {
        context.componentStack = errorInfo.componentStack;
      }
      reportError(error, context);
    }

    this.props.onError?.(error, errorInfo);

    this.setState({ errorInfo });
  }

  handleRetry = (): void => {
    try {
      this.props.onRetry?.();
      this.props.onRecover?.();
      this.setState({
        hasError: false,
        retryCount: this.state.retryCount + 1,
      });
    } catch (error) {
      const context: ErrorReportContext = { tags: { action: 'retry' } };
      if (this.props.boundaryId) {
        context.boundaryId = this.props.boundaryId;
      }
      reportError(error, context);
    }
  };

  handleReload = (): void => {
    try {
      if (this.props.onReload) {
        this.props.onReload();
        return;
      }
      window.location.reload();
    } catch (error) {
      const context: ErrorReportContext = { tags: { action: 'reload' } };
      if (this.props.boundaryId) {
        context.boundaryId = this.props.boundaryId;
      }
      reportError(error, context);
    }
  };

  override componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    if (this.state.hasError && didResetKeysChange(prevProps.resetKeys, this.props.resetKeys)) {
      this.handleRetry();
    }
  }

  override render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallbackRender) {
        const fallbackContext = {
          resetError: this.handleRetry,
          reload: this.handleReload,
          ...(this.state.error && { error: this.state.error }),
          ...(this.state.errorInfo && { errorInfo: this.state.errorInfo }),
        };
        return this.props.fallbackRender(fallbackContext);
      }

      if (this.props.fallback) {
        return this.props.fallback;
      }

      const title = sanitizeText(this.props.customMessage || 'Algo correu mal', { maxLength: 120 });
      const message = sanitizeText(
        this.state.error?.message || 'Ocorreu um erro inesperado. Por favor, tente novamente.',
        { maxLength: 240 }
      );

      return (
        <div
          className={`flex flex-col items-center justify-center min-h-[200px] p-6 text-center ${this.props.className || ''}`}
          role="alert"
          aria-live="assertive"
        >
          <div className="max-w-md mx-auto">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" aria-hidden="true" />

            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {title}
            </h2>

            <p className="text-gray-600 mb-6">
              {message}
            </p>

            {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  Detalhes do erro (desenvolvimento)
                </summary>
                <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto max-h-60">
                  <code>
                    {this.state.error?.stack}
                    {'\n\n'}
                    {this.state.errorInfo.componentStack}
                  </code>
                </pre>
              </details>
            )}

            <div className="flex gap-3 justify-center flex-wrap">
              {this.props.showRetry !== false && (
                <Button
                  type="button"
                  onClick={this.handleRetry}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  aria-label="Tentar novamente"
                >
                  <RefreshCw className="h-4 w-4" aria-hidden="true" />
                  Tentar Novamente
                </Button>
              )}

              <Button
                type="button"
                onClick={this.handleReload}
                size="sm"
                className="flex items-center gap-2"
                aria-label="Recarregar página"
              >
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
                Recarregar Página
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export const ErrorBoundaryGroup = ({
  boundaries,
  children,
}: {
  boundaries: Array<Omit<ErrorBoundaryProps, 'children'> & { boundaryId?: string }>;
  children: ReactNode;
}): ReactNode => {
  return boundaries.reduceRight((acc, boundary, index) => {
    const key = boundary.boundaryId || `boundary-${index}`;
    return (
      <ErrorBoundary key={key} {...boundary}>
        {acc}
      </ErrorBoundary>
    );
  }, children as ReactNode);
};

export const withErrorBoundary = <Props extends object>(
  WrappedComponent: React.ComponentType<Props>,
  boundaryProps?: Omit<ErrorBoundaryProps, 'children'>
): React.ComponentType<Props> => {
  const WithErrorBoundary = (props: Props) => (
    <ErrorBoundary {...boundaryProps}>
      <WrappedComponent {...props} />
    </ErrorBoundary>
  );

  WithErrorBoundary.displayName = `withErrorBoundary(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return WithErrorBoundary;
};

/** @alias */
export default ErrorBoundary;