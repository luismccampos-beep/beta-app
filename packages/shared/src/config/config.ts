// shared/src/config/config.ts

// Environment-specific configuration
export interface EnvConfig {
  apiBaseUrl: string;
  auth: {
    jwtSecret: string;
    accessTokenExpiry: string; // e.g. "15m"
    refreshTokenExpiry: string; // e.g. "7d"
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

// Default configuration (falls back to these if env vars missing)
const defaultConfig: EnvConfig = {
  apiBaseUrl: 'http://localhost:3000',
  auth: {
    jwtSecret: (typeof globalThis !== 'undefined' && (globalThis as { process?: { env?: { JWT_SECRET?: string } } }).process?.env?.JWT_SECRET) || 'INSECURE-DEFAULT-SECRET-CHANGE-IN-PRODUCTION',
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
const getEnvVar = (key: string, defaultValue: string = ''): string =>
  // eslint-disable-next-line security/detect-object-injection
  (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env?.[key] || defaultValue;

// Check if running in production
const isProduction = (globalThis as { process?: { env?: { NODE_ENV?: string } } }).process?.env?.NODE_ENV === 'production';

// Get production-specific config
const getProductionConfig = (): EnvConfig => ({
  apiBaseUrl: getEnvVar('API_BASE_URL', defaultConfig.apiBaseUrl),
  auth: {
    jwtSecret: getEnvVar('JWT_SECRET', defaultConfig.auth.jwtSecret)!,
    accessTokenExpiry: getEnvVar('ACCESS_TOKEN_EXPIRY', defaultConfig.auth.accessTokenExpiry)!,
    refreshTokenExpiry: getEnvVar('REFRESH_TOKEN_EXPIRY', defaultConfig.auth.refreshTokenExpiry)!,
  },
  database: {
    url: getEnvVar('DATABASE_URL', defaultConfig.database.url)!,
    poolSize: parseInt(getEnvVar('DATABASE_POOL_SIZE', defaultConfig.database.poolSize!.toString())!),
  },
  cors: {
    origins: (() => {
      const corsOriginsStr = getEnvVar('CORS_ORIGINS');
      return corsOriginsStr ? corsOriginsStr.split(',').map((o: string) => o.trim()) : defaultConfig.cors.origins;
    })(),
  },
  logging: {
    level: (getEnvVar('LOGGING_LEVEL') as 'debug' | 'info' | 'warn' | 'error') || defaultConfig.logging.level,
  },
});

// Get development-specific config
const getDevelopmentConfig = (): EnvConfig => ({
  ...defaultConfig,
  apiBaseUrl: getEnvVar('API_BASE_URL', defaultConfig.apiBaseUrl)!,
  database: {
    ...defaultConfig.database,
    url: getEnvVar('DATABASE_URL', defaultConfig.database.url)!,
  },
});

// Get environment-specific config (production overrides)
const getEnvConfig = (): EnvConfig => (isProduction ? getProductionConfig() : getDevelopmentConfig());

// Singleton config instance
const config = getEnvConfig();

// Type-safe accessors
const _Config = {
  get apiBaseUrl(): string {
    return config.apiBaseUrl;
  },
  get auth(): {
    jwtSecret: string;
    accessTokenExpiry: string;
    refreshTokenExpiry: string;
  } {
    return config.auth;
  },
  get database(): {
    url: string;
    poolSize?: number;
  } {
    return config.database;
  },
  get cors(): {
    origins: string[];
  } {
    return config.cors;
  },
  get logging(): {
    level: 'debug' | 'info' | 'warn' | 'error';
  } {
    return config.logging;
  },
};

// Helper to validate required env vars in production
const _validateEnv = (): void => {
  if ((globalThis as { process?: { env?: { NODE_ENV?: string } } }).process?.env?.NODE_ENV === 'production') {
    const requiredVars = ['JWT_SECRET', 'DATABASE_URL', 'API_BASE_URL'];
    
    const missingVars = requiredVars.filter((varName) => 
      // eslint-disable-next-line security/detect-object-injection
      !(globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env?.[varName]
    );
    if (missingVars.length > 0) {
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }
  }
};

export { config };
export const Config = _Config;
export const validateEnv = _validateEnv;
