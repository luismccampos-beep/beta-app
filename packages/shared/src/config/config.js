// shared/src/config/config.ts
// Default configuration (falls back to these if env vars missing)
const defaultConfig = {
    apiBaseUrl: 'http://localhost:3000',
    auth: {
        jwtSecret: (typeof globalThis !== 'undefined' && globalThis.process?.env?.JWT_SECRET) || 'INSECURE-DEFAULT-SECRET-CHANGE-IN-PRODUCTION',
        accessTokenExpiry: '15m',
        refreshTokenExpiry: '7d',
    },
    database: {
        url: 'mongodb://localhost:27017/mydb',
        poolSize: 5,
    },
    cors: {
        origins: ['http://localhost:3000', 'http://localhost:8080'],
    },
    logging: {
        level: 'debug',
    },
};
// Helper to get environment variable with default
const getEnvVar = (key, defaultValue = '') => 
// eslint-disable-next-line security/detect-object-injection
globalThis.process?.env?.[key] || defaultValue;
// Check if running in production
const isProduction = globalThis.process?.env?.NODE_ENV === 'production';
// Get production-specific config
const getProductionConfig = () => ({
    apiBaseUrl: getEnvVar('API_BASE_URL', defaultConfig.apiBaseUrl),
    auth: {
        jwtSecret: getEnvVar('JWT_SECRET', defaultConfig.auth.jwtSecret),
        accessTokenExpiry: getEnvVar('ACCESS_TOKEN_EXPIRY', defaultConfig.auth.accessTokenExpiry),
        refreshTokenExpiry: getEnvVar('REFRESH_TOKEN_EXPIRY', defaultConfig.auth.refreshTokenExpiry),
    },
    database: {
        url: getEnvVar('DATABASE_URL', defaultConfig.database.url),
        poolSize: parseInt(getEnvVar('DATABASE_POOL_SIZE', defaultConfig.database.poolSize.toString())),
    },
    cors: {
        origins: (() => {
            const corsOriginsStr = getEnvVar('CORS_ORIGINS');
            return corsOriginsStr ? corsOriginsStr.split(',').map((o) => o.trim()) : defaultConfig.cors.origins;
        })(),
    },
    logging: {
        level: getEnvVar('LOGGING_LEVEL') || defaultConfig.logging.level,
    },
});
// Get development-specific config
const getDevelopmentConfig = () => ({
    ...defaultConfig,
    apiBaseUrl: getEnvVar('API_BASE_URL', defaultConfig.apiBaseUrl),
    database: {
        ...defaultConfig.database,
        url: getEnvVar('DATABASE_URL', defaultConfig.database.url),
    },
});
// Get environment-specific config (production overrides)
const getEnvConfig = () => (isProduction ? getProductionConfig() : getDevelopmentConfig());
// Singleton config instance
const config = getEnvConfig();
// Type-safe accessors
const _Config = {
    get apiBaseUrl() {
        return config.apiBaseUrl;
    },
    get auth() {
        return config.auth;
    },
    get database() {
        return config.database;
    },
    get cors() {
        return config.cors;
    },
    get logging() {
        return config.logging;
    },
};
// Helper to validate required env vars in production
const _validateEnv = () => {
    if (globalThis.process?.env?.NODE_ENV === 'production') {
        const requiredVars = ['JWT_SECRET', 'DATABASE_URL', 'API_BASE_URL'];
        const missingVars = requiredVars.filter((varName) => 
        // eslint-disable-next-line security/detect-object-injection
        !globalThis.process?.env?.[varName]);
        if (missingVars.length > 0) {
            throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
        }
    }
};
export { config };
export const Config = _Config;
export const validateEnv = _validateEnv;
//# sourceMappingURL=config.js.map