import React from 'react';
export interface DateRange {
    start: Date;
    end: Date;
}
export interface DateRangePickerProps {
    value?: DateRange;
    onChange?: (range: DateRange) => void;
    className?: string;
    placeholder?: string;
    format?: string;
    locale?: string;
    disabled?: boolean;
    minDate?: Date;
    maxDate?: Date;
    presets?: {
        label: string;
        range: DateRange;
    }[];
}
export declare const DateRangePicker: React.FC<DateRangePickerProps>;
/** @alias */
export default DateRangePicker;
