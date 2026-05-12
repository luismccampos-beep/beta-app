"use client";

import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import { XCircle, Copy, ChevronDown, ChevronUp } from 'lucide-react';

import { Button } from './Button';

type FallbackRender = (args: {
  error: Error;
  errorInfo?: ErrorInfo;
  resetError: () => void;
}) => ReactNode;

export interface EnhancedErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  fallbackRender?: FallbackRender;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  onReset?: () => void;
  resetKeys?: unknown[];
  isolate?: boolean;
  labels?: {
    title?: string;
    subtitle?: string;
    tryAgain?: string;
    showDetails?: string;
    hideDetails?: string;
    message?: string;
    copied?: string;
    copyDetails?: string;
  };
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
  shake: boolean;
  resetKey: number;
  copySuccess: boolean;
}

const containerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 300, damping: 25 }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2 }
  },
};

const shakeVariants: Variants = {
  shake: {
    x: [0, -10, 10, -10, 10, 0],
    transition: { duration: 0.5 }
  }
};

const detailVariants: Variants = {
  hidden: {
    opacity: 0,
    height: 0,
    marginTop: 0
  },
  visible: {
    opacity: 1,
    height: 'auto',
    marginTop: 16,
    transition: { duration: 0.3, ease: 'easeOut' }
  },
  exit: {
    opacity: 0,
    height: 0,
    marginTop: 0,
    transition: { duration: 0.2, ease: 'easeIn' }
  },
};

const DEFAULT_LABELS = {
  title: 'Ocorreu um erro',
  subtitle: 'Pedimos desculpa, algo inesperado aconteceu.',
  tryAgain: 'Tentar novamente',
  showDetails: 'Ver detalhes',
  hideDetails: 'Ocultar detalhes',
  message: 'Mensagem:',
  copied: 'Copiado!',
  copyDetails: 'Copiar detalhes',
};

// Extracted component for the error icon with pulse animation
const ErrorIcon = () => (
  <div className="relative">
    <XCircle className="h-16 w-16 text-red-600 dark:text-red-500" />
    <motion.div
      className="absolute inset-0 h-16 w-16 text-red-600 dark:text-red-500"
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.5, 0, 0.5]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <XCircle className="h-16 w-16" />
    </motion.div>
  </div>
);

// Extracted component for error header
const ErrorHeader = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div className="flex flex-col items-center space-y-4">
    <ErrorIcon />
    <div className="text-center space-y-2">
      <h2 className="text-2xl font-bold text-red-700 dark:text-red-400">
        {title}
      </h2>
      <p className="text-gray-600 dark:text-gray-400 text-sm">
        {subtitle}
      </p>
    </div>
  </div>
);

// Extracted component for error name badge
const ErrorNameBadge = ({ errorName }: { errorName: string }) => {
  if (errorName === 'Error') return null;
  
  return (
    <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
      <p className="text-sm font-mono text-red-800 dark:text-red-300">
        {errorName}
      </p>
    </div>
  );
};

// Extracted component for action buttons
const ErrorActions = ({
  onReset,
  onToggleDetails,
  showDetails,
  labels
}: {
  onReset: () => void;
  onToggleDetails: () => void;
  showDetails: boolean;
  labels: typeof DEFAULT_LABELS;
}) => (
  <div className="mt-6 flex flex-col sm:flex-row gap-3">
    <Button
      onClick={onReset}
      className="flex-1 bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
    >
      {labels.tryAgain}
    </Button>
    <Button
      onClick={onToggleDetails}
      variant="outline"
      className="flex-1 text-red-600 dark:text-red-400 border-red-300 dark:border-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
    >
      {showDetails ? (
        <>
          <ChevronUp className="h-4 w-4 mr-2" />
          {labels.hideDetails}
        </>
      ) : (
        <>
          <ChevronDown className="h-4 w-4 mr-2" />
          {labels.showDetails}
        </>
      )}
    </Button>
  </div>
);

// Extracted component for stack trace section
const StackTraceSection = ({ title, content }: { title: string; content: string }) => (
  <div>
    <h3 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
      {title}
    </h3>
    <pre className="text-xs text-gray-800 dark:text-gray-200 font-mono overflow-auto max-h-32 whitespace-pre-wrap break-all bg-white dark:bg-gray-900 p-2 rounded">
      {content}
    </pre>
  </div>
);

// Extracted component for error details panel
const ErrorDetailsPanel = ({
  error,
  errorInfo,
  errorMessage,
  copySuccess,
  onCopy,
  labels
}: {
  error: Error;
  errorInfo: ErrorInfo | null;
  errorMessage: string;
  copySuccess: boolean;
  onCopy: () => void;
  labels: typeof DEFAULT_LABELS;
}) => (
  <motion.div
    variants={detailVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
    className="overflow-hidden"
  >
    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg space-y-3">
      <div>
        <h3 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
          {labels.message}
        </h3>
        <p className="text-sm text-gray-800 dark:text-gray-200 font-mono">
          {errorMessage}
        </p>
      </div>

      {error.stack && (
        <StackTraceSection title="Stack Trace:" content={error.stack} />
      )}

      {errorInfo?.componentStack && (
        <StackTraceSection title="Component Stack:" content={errorInfo.componentStack} />
      )}

      <Button
        onClick={onCopy}
        variant="ghost"
        size="sm"
        className="w-full text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
        disabled={copySuccess}
      >
        {copySuccess ? (
          <>
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="mr-2"
            >
              ✓
            </motion.span>
            {labels.copied}
          </>
        ) : (
          <>
            <Copy className="h-4 w-4 mr-2" />
            {labels.copyDetails}
          </>
        )}
      </Button>
    </div>
  </motion.div>
);

class EnhancedErrorBoundary extends Component<EnhancedErrorBoundaryProps, State> {
  private shakeTimeoutId: number | null = null;
  private copyTimeoutId: number | null = null;

  override state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    showDetails: false,
    shake: false,
    resetKey: 0,
    copySuccess: false,
  };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      shake: true
    };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    this.props.onError?.(error, errorInfo);

    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    this.shakeTimeoutId = window.setTimeout(() => {
      this.setState({ shake: false });
    }, 500);
  }

  override componentDidUpdate(prevProps: EnhancedErrorBoundaryProps) {
    if (this.hasResetKeysChanged(prevProps.resetKeys) && this.state.hasError) {
      this.resetError();
    }
  }

  override componentWillUnmount() {
    this.clearTimeouts();
  }

  private clearTimeouts() {
    if (this.shakeTimeoutId) {
      clearTimeout(this.shakeTimeoutId);
    }
    if (this.copyTimeoutId) {
      clearTimeout(this.copyTimeoutId);
    }
  }

  private hasResetKeysChanged(prevResetKeys?: unknown[]): boolean {
    const { resetKeys } = this.props;
    
    if (!resetKeys || !prevResetKeys) {
      return false;
    }

    if (resetKeys.length !== prevResetKeys.length) {
      return true;
    }

    const prevIterator = prevResetKeys[Symbol.iterator]();
    for (const key of resetKeys) {
      const prevKey = prevIterator.next().value;
      if (key !== prevKey) {
        return true;
      }
    }

    return false;
  }

  resetError = () => {
    this.props.onReset?.();

    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
      shake: false,
      resetKey: this.state.resetKey + 1,
      copySuccess: false,
    });
  };

  toggleDetails = () => {
    this.setState((prevState) => ({
      showDetails: !prevState.showDetails
    }));
  };

  copyErrorDetails = async () => {
    const { error, errorInfo } = this.state;

    if (!error) return;

    const errorText = this.formatErrorText(error, errorInfo);

    try {
      await navigator.clipboard.writeText(errorText);
      this.setState({ copySuccess: true });

      this.copyTimeoutId = window.setTimeout(() => {
        this.setState({ copySuccess: false });
      }, 2000);
    } catch (err) {
      console.error('Failed to copy error details:', err);
    }
  };

  private formatErrorText(error: Error, errorInfo: ErrorInfo | null): string {
    return [
      '=== Error Details ===',
      '',
      'Message:',
      error.toString(),
      '',
      'Stack:',
      error.stack || 'No stack trace available',
      '',
      'Component Stack:',
      errorInfo?.componentStack || 'No component stack available',
      '',
      'Timestamp:',
      new Date().toISOString(),
    ].join('\n');
  }

  private getLabels() {
    return { ...DEFAULT_LABELS, ...this.props.labels };
  }

  private renderCustomFallback(): ReactNode | null {
    const { fallback, fallbackRender } = this.props;
    const { error, errorInfo } = this.state;

    if (fallbackRender && error) {
      return fallbackRender({
        error,
        errorInfo: errorInfo || undefined,
        resetError: this.resetError
      });
    }

    if (fallback) {
      return fallback;
    }

    return null;
  }

  renderFallbackUI() {
    const customFallback = this.renderCustomFallback();
    if (customFallback) {
      return customFallback;
    }

    const { error, errorInfo, showDetails, shake, copySuccess } = this.state;
    const { isolate } = this.props;
    const labels = this.getLabels();

    const errorMessage = error?.message || 'An unexpected error occurred';
    const errorName = error?.name || 'Error';

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="error-backdrop"
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
            isolate ? '' : 'bg-black/30 backdrop-blur-sm'
          }`}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={containerVariants}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <motion.div
            className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-6 w-full max-w-md"
            variants={shake ? shakeVariants : {}}
            animate={shake ? 'shake' : ''}
          >
            <ErrorHeader title={labels.title} subtitle={labels.subtitle} />

            <ErrorNameBadge errorName={errorName} />

            <ErrorActions
              onReset={this.resetError}
              onToggleDetails={this.toggleDetails}
              showDetails={showDetails}
              labels={labels}
            />

            <AnimatePresence>
              {showDetails && error && (
                <ErrorDetailsPanel
                  error={error}
                  errorInfo={errorInfo}
                  errorMessage={errorMessage}
                  copySuccess={copySuccess}
                  onCopy={this.copyErrorDetails}
                  labels={labels}
                />
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  override render() {
    if (this.state.hasError) {
      return this.renderFallbackUI();
    }

    return <div key={this.state.resetKey}>{this.props.children}</div>;
  }
}

export { EnhancedErrorBoundary };
export default EnhancedErrorBoundary;
