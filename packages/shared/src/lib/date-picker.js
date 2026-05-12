// Date Picker component using react-day-picker
// This file ensures the dependency is properly used in the project
import { DayPicker } from 'react-day-picker';
export { DayPicker };
// Default date picker configuration
export const defaultDatePickerProps = {
    mode: 'single',
    showOutsideDays: true,
    fixedWeeks: false,
};
// Helper to create a date range picker config
export const createDateRangeConfig = () => ({
    mode: 'range',
    showOutsideDays: true,
    fixedWeeks: false,
});
//# sourceMappingURL=date-picker.js.map