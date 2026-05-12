// Aqui ficam as constantes base do projeto

// Nome da aplicação
export const APP_NAME = 'AKMLEVA';

// API
export const API_BASE_URL = (typeof globalThis !== 'undefined' && (globalThis as { process?: { env?: { API_BASE_URL?: string } } }).process?.env?.API_BASE_URL) || 'http://localhost:3000';

// Status codes comuns
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Roles de usuário
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  USER: 'USER',
  GUEST: 'GUEST',
} as const;

// Locales suportados
export const SUPPORTED_LANGUAGES = ['pt-BR', 'en-US', 'es-ES'] as const;

// Chaves de localização
export const LOCALE_KEYS = {
  WELCOME: 'welcome',
  LOGIN: 'login',
  LOGOUT: 'logout',
  DASHBOARD: 'dashboard',
} as const;

export const APP_ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
} as const;

