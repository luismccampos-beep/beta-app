// src/config/config.ts
var defaultConfig = {
  apiBaseUrl: "http://localhost:3000",
  auth: {
    jwtSecret: typeof globalThis !== "undefined" && globalThis.process?.env?.JWT_SECRET || "INSECURE-DEFAULT-SECRET-CHANGE-IN-PRODUCTION",
    accessTokenExpiry: "15m",
    refreshTokenExpiry: "7d"
  },
  database: {
    url: "mongodb://localhost:27017/mydb",
    poolSize: 5
  },
  cors: {
    origins: ["http://localhost:3000", "http://localhost:8080"]
  },
  logging: {
    level: "debug"
  }
};
var getEnvVar = (key, defaultValue = "") => (
  // eslint-disable-next-line security/detect-object-injection
  globalThis.process?.env?.[key] || defaultValue
);
var isProduction = globalThis.process?.env?.NODE_ENV === "production";
var getProductionConfig = () => ({
  apiBaseUrl: getEnvVar("API_BASE_URL", defaultConfig.apiBaseUrl),
  auth: {
    jwtSecret: getEnvVar("JWT_SECRET", defaultConfig.auth.jwtSecret),
    accessTokenExpiry: getEnvVar("ACCESS_TOKEN_EXPIRY", defaultConfig.auth.accessTokenExpiry),
    refreshTokenExpiry: getEnvVar("REFRESH_TOKEN_EXPIRY", defaultConfig.auth.refreshTokenExpiry)
  },
  database: {
    url: getEnvVar("DATABASE_URL", defaultConfig.database.url),
    poolSize: parseInt(getEnvVar("DATABASE_POOL_SIZE", defaultConfig.database.poolSize.toString()))
  },
  cors: {
    origins: (() => {
      const corsOriginsStr = getEnvVar("CORS_ORIGINS");
      return corsOriginsStr ? corsOriginsStr.split(",").map((o) => o.trim()) : defaultConfig.cors.origins;
    })()
  },
  logging: {
    level: getEnvVar("LOGGING_LEVEL") || defaultConfig.logging.level
  }
});
var getDevelopmentConfig = () => ({
  ...defaultConfig,
  apiBaseUrl: getEnvVar("API_BASE_URL", defaultConfig.apiBaseUrl),
  database: {
    ...defaultConfig.database,
    url: getEnvVar("DATABASE_URL", defaultConfig.database.url)
  }
});
var getEnvConfig = () => isProduction ? getProductionConfig() : getDevelopmentConfig();
var config = getEnvConfig();
var _Config = {
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
  }
};
var _validateEnv = () => {
  if (globalThis.process?.env?.NODE_ENV === "production") {
    const requiredVars = ["JWT_SECRET", "DATABASE_URL", "API_BASE_URL"];
    const missingVars = requiredVars.filter(
      (varName) => (
        // eslint-disable-next-line security/detect-object-injection
        !globalThis.process?.env?.[varName]
      )
    );
    if (missingVars.length > 0) {
      throw new Error(`Missing required environment variables: ${missingVars.join(", ")}`);
    }
  }
};
var Config = _Config;
var validateEnv = _validateEnv;

export {
  config,
  Config,
  validateEnv
};
//# sourceMappingURL=chunk-5NOVLBOW.js.map