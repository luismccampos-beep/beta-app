interface LogContext {
    [key: string]: unknown;
}
declare class Logger {
    private level;
    constructor(level?: string);
    private shouldLog;
    private formatMessage;
    info(message: string, context?: LogContext): void;
    error(message: string, context?: LogContext): void;
    warn(message: string, context?: LogContext): void;
    debug(message: string, context?: LogContext): void;
}
export declare const logger: Logger;
export {};
