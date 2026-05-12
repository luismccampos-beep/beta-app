// shared/src/logger/logger.ts
class Logger {
    constructor(level = 'info') {
        this.level = level;
    }
    shouldLog(level) {
        const levels = ['debug', 'info', 'warn', 'error'];
        return levels.indexOf(level) >= levels.indexOf(this.level);
    }
    formatMessage(level, message, context) {
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            level,
            message,
            ...context,
        };
        return JSON.stringify(logEntry);
    }
    info(message, context) {
        if (this.shouldLog('info')) {
            console.log(this.formatMessage('info', message, context));
        }
    }
    error(message, context) {
        if (this.shouldLog('error')) {
            console.error(this.formatMessage('error', message, context));
        }
    }
    warn(message, context) {
        if (this.shouldLog('warn')) {
            console.warn(this.formatMessage('warn', message, context));
        }
    }
    debug(message, context) {
        if (this.shouldLog('debug')) {
            console.debug(this.formatMessage('debug', message, context));
        }
    }
}
export const logger = new Logger('info');
//# sourceMappingURL=logger.js.map