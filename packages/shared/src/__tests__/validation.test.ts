import { describe, expect, it } from 'vitest';

import { isValidNIF, isValidTaxId, nifSchema, taxIdSchema } from '../utils/validation';

describe('isValidNIF', () => {
  it('accepts a valid individual NIF', () => {
    // 123456789 has a valid check digit
    expect(isValidNIF('123456789')).toBe(true);
  });

  it('accepts a valid company NIF (starts with 5)', () => {
    // 500000000 is a valid corporate NIF check
    expect(isValidNIF('500000000')).toBe(true);
  });

  it('strips spaces and dashes before validating', () => {
    expect(isValidNIF('123 456 789')).toBe(true);
    expect(isValidNIF('123-456-789')).toBe(true);
  });

  it('rejects NIFs with wrong length', () => {
    expect(isValidNIF('12345678')).toBe(false);
    expect(isValidNIF('1234567890')).toBe(false);
    expect(isValidNIF('')).toBe(false);
  });

  it('rejects NIFs with an invalid first digit', () => {
    // 0 and 4 are not valid first digits for any current NIF category
    expect(isValidNIF('012345678')).toBe(false);
    expect(isValidNIF('412345678')).toBe(false);
  });

  it('rejects NIFs with an invalid check digit', () => {
    expect(isValidNIF('123456780')).toBe(false);
    expect(isValidNIF('123456788')).toBe(false);
  });

  it('rejects non-string inputs', () => {
    expect(isValidNIF(null)).toBe(false);
    expect(isValidNIF(undefined)).toBe(false);
    expect(isValidNIF(123456789 as unknown as string)).toBe(false);
  });

  it('rejects NIFs with non-digit characters', () => {
    expect(isValidNIF('12345678X')).toBe(false);
    expect(isValidNIF('abcdefghi')).toBe(false);
  });
});

describe('nifSchema', () => {
  it('allows an empty string (use .min(1) on top if required)', () => {
    expect(nifSchema.safeParse('').success).toBe(true);
  });

  it('passes a valid NIF', () => {
    expect(nifSchema.safeParse('123456789').success).toBe(true);
  });

  it('fails an invalid NIF', () => {
    const result = nifSchema.safeParse('123456788');
    expect(result.success).toBe(false);
  });
});

describe('isValidTaxId', () => {
  it('accepts 5-20 alphanumeric chars (spaces/dashes stripped)', () => {
    expect(isValidTaxId('ESX1234567A')).toBe(true);
    expect(isValidTaxId('FR 12 345678901')).toBe(true);
    expect(isValidTaxId('GB-123456789')).toBe(true);
  });

  it('rejects too short or too long values', () => {
    expect(isValidTaxId('1234')).toBe(false);
    expect(isValidTaxId('A'.repeat(21))).toBe(false);
  });

  it('rejects symbols other than spaces/dashes', () => {
    expect(isValidTaxId('AB$12345')).toBe(false);
  });
});

describe('taxIdSchema', () => {
  it('allows empty string', () => {
    expect(taxIdSchema.safeParse('').success).toBe(true);
  });

  it('passes a generic tax id', () => {
    expect(taxIdSchema.safeParse('GB123456789').success).toBe(true);
  });

  it('fails an invalid tax id', () => {
    expect(taxIdSchema.safeParse('!!!').success).toBe(false);
  });
});
