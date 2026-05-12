/**
 * Formats a Date into `YYYY-MM-DD` string in local timezone,
 * avoiding off-by-one issues due to TZ offsets.
 */
export declare function toDateString(date: Date): string;
/**
 * Adds the given number of days to a source date and returns a new Date.
 */
export declare function addDays(source: Date, days: number): Date;
/**
 * Returns the difference in whole days between two dates (end - start).
 */
export declare function diffDays(start: Date, end: Date): number;
