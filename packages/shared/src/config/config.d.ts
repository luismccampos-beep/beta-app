export interface EnvConfig {
    apiBaseUrl: string;
    auth: {
        jwtSecret: string;
        accessTokenExpiry: string;
        refreshTokenExpiry: string;
    };
    database: {
        url: string;
        poolSize?: number;
    };
    cors: {
        origins: string[];
    };
    logging: {
        level: 'debug' | 'info' | 'warn' | 'error';
    };
}
declare const config: EnvConfig;
export { config };
export declare const Config: {
    readonly apiBaseUrl: string;
    readonly auth: {
        jwtSecret: string;
        accessTokenExpiry: string;
        refreshTokenExpiry: string;
    };
    readonly database: {
        url: string;
        poolSize?: number;
    };
    readonly cors: {
        origins: string[];
    };
    readonly logging: {
        level: "debug" | "info" | "warn" | "error";
    };
};
export declare const validateEnv: () => void;
