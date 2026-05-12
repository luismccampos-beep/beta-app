// packages/shared/src/utils/date.ts
// Date helpers shared across apps
/**
 * Formats a Date into `YYYY-MM-DD` string in local timezone,
 * avoiding off-by-one issues due to TZ offsets.
 */
export function toDateString(date) {
    const normalized = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return normalized.toISOString().slice(0, 10);
}
/**
 * Adds the given number of days to a source date and returns a new Date.
 */
export function addDays(source, days) {
    const d = new Date(source);
    d.setDate(d.getDate() + days);
    return d;
}
/**
 * Returns the difference in whole days between two dates (end - start).
 */
export function diffDays(start, end) {
    const ms = end.getTime() - start.getTime();
    return Math.ceil(ms / (1000 * 60 * 60 * 24));
}
;
//# sourceMappingURL=date.js.map