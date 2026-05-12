/**
 * Safely get an environment variable value.
 * Fixes security/detect-object-injection by validating keys and using hasOwnProperty.
 */
const getEnv = (key: string): string | undefined => {
  // 1. Prevenir Prototype Pollution: não permitir chaves de protótipo
  if (key === '__proto__' || key === 'constructor') {
    return undefined;
  }

  // 2. Browser Environment check
  if (typeof window !== 'undefined') {
    const windowEnv = (window as { __ENV__?: Record<string, string> }).__ENV__;
    
    // Verificação segura de propriedade para satisfazer o linter de segurança
    if (windowEnv && Object.prototype.hasOwnProperty.call(windowEnv, key)) {
      // eslint-disable-next-line security/detect-object-injection
      return windowEnv[key];
    }
  }

  // 3. Node.js / Server Environment check
  if (typeof process !== 'undefined' && process.env) {
    if (Object.prototype.hasOwnProperty.call(process.env, key)) {
      // eslint-disable-next-line security/detect-object-injection
      return process.env[key];
    }
  }

  return undefined;
};

/**
 * Check if an environment variable is set to 'true'.
 */
const isEnvEnabled = (key: string): boolean => {
  return getEnv(key) === 'true';
};

/**
 * Detect if the code is running in a Next.js environment.
 */
const isNext = (): boolean => {
  const isBrowserEnv = typeof window !== 'undefined';
  const hasNextData = isBrowserEnv && Object.prototype.hasOwnProperty.call(window, '__NEXT_DATA__');
  
  // Next.js define variáveis específicas no processo durante o runtime/build
  const hasNextRuntime = typeof process !== 'undefined' && (
    !!process.env?.NEXT_RUNTIME || 
    !!process.env?.NEXT_PUBLIC_VERCEL_ENV
  );
  
  return !!(hasNextData || hasNextRuntime);
};

/**
 * Detect if the code is running in a browser environment.
 */
const isBrowser = (): boolean => {
  return typeof window !== 'undefined';
};

export { getEnv, isEnvEnabled, isNext, isBrowser };
