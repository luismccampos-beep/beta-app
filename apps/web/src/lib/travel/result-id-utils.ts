export function iataFromMockResultId(id: string): string | null {
  const m = id.match(/^mock-\w+-[A-Z]{3}-([A-Z]{3})-/i);
  return m?.[1]?.toUpperCase() ?? null;
}
