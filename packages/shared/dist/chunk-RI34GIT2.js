// src/constants/constants.ts
var APP_NAME = "AKMLEVA";
var API_BASE_URL = typeof globalThis !== "undefined" && globalThis.process?.env?.API_BASE_URL || "http://localhost:3000";
var HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};
var USER_ROLES = {
  ADMIN: "ADMIN",
  USER: "USER",
  GUEST: "GUEST"
};
var SUPPORTED_LANGUAGES = ["pt-PT", "en-US", "es-ES"];
var LOCALE_KEYS = {
  WELCOME: "welcome",
  LOGIN: "login",
  LOGOUT: "logout",
  DASHBOARD: "dashboard"
};
var APP_ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  DASHBOARD: "/dashboard"
};

export {
  APP_NAME,
  API_BASE_URL,
  HTTP_STATUS,
  USER_ROLES,
  SUPPORTED_LANGUAGES,
  LOCALE_KEYS,
  APP_ROUTES
};
//# sourceMappingURL=chunk-RI34GIT2.js.map