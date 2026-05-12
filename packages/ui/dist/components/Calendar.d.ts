import { type DayPickerProps } from 'react-day-picker';
export type CalendarProps = DayPickerProps & {
    /** Additional CSS classes merged onto the root element. */
    className?: string;
};
/**
 * Accessible date picker built on `react-day-picker` with:
 *
 * - Full dark-mode support
 * - Responsive layout (vertical on mobile, horizontal on desktop)
 * - Subtle press & hover micro-interactions
 * - Keyboard-navigable with visible focus rings
 */
declare const Calendar: import("react").NamedExoticComponent<CalendarProps>;
export { Calendar };
