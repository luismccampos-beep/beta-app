// Date Picker component using react-day-picker
// This file ensures the dependency is properly used in the project

import { DayPicker } from 'react-day-picker';

export { DayPicker };

export type { DayPickerProps } from 'react-day-picker';
export type { Mode, DateRange } from 'react-day-picker';

// Default date picker configuration
export const defaultDatePickerProps = {
  mode: 'single' as const,
  showOutsideDays: true,
  fixedWeeks: false,
};

// Helper to create a date range picker config
export const createDateRangeConfig = () => ({
  mode: 'range' as const,
  showOutsideDays: true,
  fixedWeeks: false,
});
