import { DayPicker } from 'react-day-picker';
export { DayPicker };
export type { DayPickerProps } from 'react-day-picker';
export type { Mode, DateRange } from 'react-day-picker';
export declare const defaultDatePickerProps: {
    mode: "single";
    showOutsideDays: boolean;
    fixedWeeks: boolean;
};
export declare const createDateRangeConfig: () => {
    mode: "range";
    showOutsideDays: boolean;
    fixedWeeks: boolean;
};
