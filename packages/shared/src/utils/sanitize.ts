const controlChars = /[\u0000-\u001F\u007F]/g;
const whitespace = /\s+/g;

export const sanitizeText = (value: string, options?: { maxLength?: number }): string => {
  const maxLength = options?.maxLength ?? 200;
  const trimmed = value.replace(controlChars, '').replace(whitespace, ' ').trim();
  return trimmed.slice(0, maxLength);
};

export const sanitizeHref = (value?: string): string | undefined => {
  if (!value) return undefined;
  const trimmed = value.replace(controlChars, '').trim();
  if (!trimmed) return undefined;

  if (trimmed.startsWith('/')) return trimmed;
  if (trimmed.startsWith('#')) return trimmed;
  if (trimmed.startsWith('?')) return trimmed;

  try {
    const url = new URL(trimmed, 'https://akmleva.local');
    const protocol = url.protocol;
    const hostname = url.hostname.toLowerCase();
    const isLocal = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '0.0.0.0';

    if (protocol === 'mailto:' || protocol === 'tel:') return trimmed;
    if (protocol === 'https:') return trimmed;
    if (protocol === 'http:' && isLocal) return trimmed;
  } catch {
    return undefined;
  }

  return undefined;
};
