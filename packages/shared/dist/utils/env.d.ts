/**
 * Safely get an environment variable value.
 * Fixes security/detect-object-injection by validating keys and using hasOwnProperty.
 */
declare const getEnv: (key: string) => string | undefined;
/**
 * Check if an environment variable is set to 'true'.
 */
declare const isEnvEnabled: (key: string) => boolean;
/**
 * Detect if the code is running in a Next.js environment.
 */
declare const isNext: () => boolean;
/**
 * Detect if the code is running in a browser environment.
 */
declare const isBrowser: () => boolean;
export { getEnv, isEnvEnabled, isNext, isBrowser };
