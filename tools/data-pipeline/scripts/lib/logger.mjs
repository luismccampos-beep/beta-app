const isColorSupported = process.env.NO_COLOR === undefined && process.stdout.isTTY;

const colors = {
  red: isColorSupported ? '\x1b[31m' : '',
  green: isColorSupported ? '\x1b[32m' : '',
  yellow: isColorSupported ? '\x1b[33m' : '',
  blue: isColorSupported ? '\x1b[34m' : '',
  magenta: isColorSupported ? '\x1b[35m' : '',
  cyan: isColorSupported ? '\x1b[36m' : '',
  gray: isColorSupported ? '\x1b[90m' : '',
  reset: isColorSupported ? '\x1b[0m' : '',
};

function timestamp() {
  return new Date().toISOString().replace('T', ' ').slice(0, 19);
}

function prefix(level, color) {
  return `${colors.gray}${timestamp()}${colors.reset} ${color}[${level}]${colors.reset}`;
}

export const logger = {
  info: (msg, ...args) => console.log(`${prefix('INFO', colors.cyan)} ${msg}`, ...args),
  ok: (msg, ...args) => console.log(`${prefix(' OK ', colors.green)} ${msg}`, ...args),
  warn: (msg, ...args) => console.warn(`${prefix('WARN', colors.yellow)} ${msg}`, ...args),
  error: (msg, ...args) => console.error(`${prefix('ERR ', colors.red)} ${msg}`, ...args),
  debug: (msg, ...args) => {
    if (process.env.DEBUG) console.log(`${prefix('DBUG', colors.magenta)} ${msg}`, ...args);
  },
};

export class ScriptError extends Error {
  constructor(message, options = {}) {
    super(message);
    this.name = 'ScriptError';
    this.exitCode = options.exitCode ?? 1;
    this.cause = options.cause;
  }
}

export function handleScriptError(error) {
  if (error instanceof ScriptError) {
    logger.error(error.message);
    if (error.cause) logger.debug('Caused by:', error.cause);
    process.exit(error.exitCode);
  }
  logger.error('Unexpected error:', error.message ?? error);
  process.exit(1);
}

export function withErrorHandling(fn) {
  return async (...args) => {
    try {
      await fn(...args);
    } catch (error) {
      handleScriptError(error);
    }
  };
}
