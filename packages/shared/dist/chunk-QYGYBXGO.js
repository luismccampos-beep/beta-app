// src/utils/env.ts
var getEnv = (key) => {
  if (key === "__proto__" || key === "constructor") {
    return void 0;
  }
  if (typeof window !== "undefined") {
    const windowEnv = window.__ENV__;
    if (windowEnv && Object.prototype.hasOwnProperty.call(windowEnv, key)) {
      return windowEnv[key];
    }
  }
  if (typeof process !== "undefined" && process.env) {
    if (Object.prototype.hasOwnProperty.call(process.env, key)) {
      return process.env[key];
    }
  }
  return void 0;
};
var isEnvEnabled = (key) => {
  return getEnv(key) === "true";
};
var isNext = () => {
  const isBrowserEnv = typeof window !== "undefined";
  const hasNextData = isBrowserEnv && Object.prototype.hasOwnProperty.call(window, "__NEXT_DATA__");
  const hasNextRuntime = typeof process !== "undefined" && (!!process.env?.NEXT_RUNTIME || !!process.env?.NEXT_PUBLIC_VERCEL_ENV);
  return !!(hasNextData || hasNextRuntime);
};
var isBrowser = () => {
  return typeof window !== "undefined";
};

export {
  getEnv,
  isEnvEnabled,
  isNext,
  isBrowser
};
//# sourceMappingURL=chunk-QYGYBXGO.js.map