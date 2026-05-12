export const SESSION_COOKIE_NAME = 'akmleva_session';

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

