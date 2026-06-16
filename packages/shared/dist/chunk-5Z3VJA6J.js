// src/logger/logger.ts
var Logger = class {
  constructor(level = "info") {
    this.level = level;
  }
  shouldLog(level) {
    const levels = ["debug", "info", "warn", "error"];
    return levels.indexOf(level) >= levels.indexOf(this.level);
  }
  formatMessage(level, message, context) {
    const timestamp = (/* @__PURE__ */ new Date()).toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...context
    };
    return JSON.stringify(logEntry);
  }
  info(message, context) {
    if (this.shouldLog("info")) {
      console.log(this.formatMessage("info", message, context));
    }
  }
  error(message, context) {
    if (this.shouldLog("error")) {
      console.error(this.formatMessage("error", message, context));
    }
  }
  warn(message, context) {
    if (this.shouldLog("warn")) {
      console.warn(this.formatMessage("warn", message, context));
    }
  }
  debug(message, context) {
    if (this.shouldLog("debug")) {
      console.debug(this.formatMessage("debug", message, context));
    }
  }
};
var logger = new Logger("info");

// src/logger/errorReporter.ts
var ComponentError = class extends Error {
  constructor(message, code = "COMPONENT_ERROR", metadata) {
    super(message);
    this.name = "ComponentError";
    this.code = code;
    if (metadata) {
      this.metadata = metadata;
    }
  }
};
var NavigationError = class extends ComponentError {
  constructor(message, metadata) {
    super(message, "NAVIGATION_ERROR", metadata);
    this.name = "NavigationError";
  }
};
var normalizeError = (error) => {
  if (error instanceof Error) return error;
  if (typeof error === "string") return new Error(error);
  if (typeof error === "object" && error !== null) {
    try {
      return new Error(JSON.stringify(error));
    } catch {
      return new Error("Unknown error");
    }
  }
  return new Error(String(error));
};
var getGlobal = () => {
  if (typeof window !== "undefined") return window;
  if (typeof globalThis !== "undefined") return globalThis;
  return void 0;
};
var reportError = (error, context) => {
  const normalized = normalizeError(error);
  const payload = {
    message: normalized.message,
    name: normalized.name,
    stack: normalized.stack,
    boundaryId: context?.boundaryId,
    componentStack: context?.componentStack,
    tags: context?.tags,
    metadata: context?.metadata,
    user: context?.user
  };
  logger.error("Shared component error", payload);
  const globalObj = getGlobal();
  const sentry = globalObj?.Sentry;
  if (sentry?.withScope) {
    sentry.withScope((scope) => {
      if (context?.boundaryId) scope.setTag("boundaryId", context.boundaryId);
      if (context?.tags) scope.setTags(context.tags);
      if (context?.metadata) scope.setContext("metadata", context.metadata);
      if (context?.componentStack) scope.setContext("react", { componentStack: context.componentStack });
      if (context?.user) scope.setUser(context.user);
      sentry.captureException?.(normalized, { extra: payload });
    });
  } else {
    sentry?.captureException?.(normalized, { extra: payload });
  }
  const logRocket = globalObj?.LogRocket;
  logRocket?.captureException?.(normalized);
};

export {
  logger,
  ComponentError,
  NavigationError,
  normalizeError,
  reportError
};
//# sourceMappingURL=chunk-5Z3VJA6J.js.map