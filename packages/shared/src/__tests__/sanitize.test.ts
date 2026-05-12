import { describe, expect, it } from 'vitest';

import { sanitizeHref, sanitizeText } from '../utils/sanitize';

describe('sanitizeText', () => {
  it('removes control characters and collapses whitespace', () => {
    const value = '\u0000  Hello   world \n\t';
    expect(sanitizeText(value)).toBe('Hello world');
  });

  it('respects maxLength', () => {
    expect(sanitizeText('1234567890', { maxLength: 4 })).toBe('1234');
  });
});

describe('sanitizeHref', () => {
  it('allows safe relative and fragment urls', () => {
    expect(sanitizeHref('/account/settings')).toBe('/account/settings');
    expect(sanitizeHref('#section')).toBe('#section');
    expect(sanitizeHref('?tab=profile')).toBe('?tab=profile');
  });

  it('allows https and localhost http urls', () => {
    expect(sanitizeHref('https://akmleva.com')).toBe('https://akmleva.com');
    expect(sanitizeHref('http://localhost:3000')).toBe('http://localhost:3000');
  });

  it('allows mailto and tel', () => {
    expect(sanitizeHref('mailto:hello@akmleva.com')).toBe('mailto:hello@akmleva.com');
    expect(sanitizeHref('tel:+351211234567')).toBe('tel:+351211234567');
  });

  it('blocks unsafe protocols', () => {
    expect(sanitizeHref('javascript:alert(1)')).toBeUndefined();
    expect(sanitizeHref('http://evil.com')).toBeUndefined();
    expect(sanitizeHref('data:text/html,alert(1)')).toBeUndefined();
    expect(sanitizeHref('https://%')).toBeUndefined();
  });
});
