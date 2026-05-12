'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { memo } from 'react';
import { DayPicker } from 'react-day-picker';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../utils/cn';
import { buttonVariants } from './Button';
// ============================================================================
// CONSTANTS — stable references, never re-allocated
// ============================================================================
const BASE_CLASSNAMES = {
    months: cn('flex flex-col sm:flex-row', 'gap-4 sm:gap-6'),
    month: 'space-y-4',
    caption: cn('relative flex items-center justify-center', 'pt-1.5 pb-1'),
    caption_label: cn('text-sm font-semibold tracking-tight', 'text-gray-900 dark:text-gray-100', 'select-none'),
    nav: 'flex items-center gap-1',
    nav_button: cn(buttonVariants({ variant: 'outline' }), 'size-8 p-0', 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800', 'text-gray-500 dark:text-gray-400', 'hover:text-gray-900 dark:hover:text-gray-100', 'opacity-60 hover:opacity-100', 'transition-all duration-150', 'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2', 'dark:focus-visible:ring-offset-gray-900', 'active:scale-95', 'rounded-lg'),
    nav_button_previous: 'absolute left-1.5',
    nav_button_next: 'absolute right-1.5',
    table: 'w-full border-collapse',
    head_row: 'flex',
    head_cell: cn('w-10 rounded-md text-center text-[0.7rem] font-medium uppercase tracking-wider', 'text-gray-400 dark:text-gray-500', 'select-none'),
    row: 'flex w-full mt-1',
    cell: cn('relative size-10 p-0 text-center text-sm', '[&:has([aria-selected].day-range-end)]:rounded-r-lg', '[&:has([aria-selected].day-outside)]:bg-accent/50', '[&:has([aria-selected])]:bg-accent', 'first:[&:has([aria-selected])]:rounded-l-lg', 'last:[&:has([aria-selected])]:rounded-r-lg', 'focus-within:relative focus-within:z-20'),
    day: cn(buttonVariants({ variant: 'ghost' }), 'size-10 p-0 font-normal', 'rounded-lg', 'text-gray-700 dark:text-gray-300', 'hover:bg-gray-100 dark:hover:bg-gray-800', 'hover:text-gray-900 dark:hover:text-gray-100', 'transition-colors duration-150', 'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1', 'dark:focus-visible:ring-offset-gray-900', 'aria-selected:opacity-100', 'active:scale-[0.92]', 'motion-safe:transition-transform'),
    day_range_end: 'day-range-end',
    day_selected: cn('bg-primary text-primary-foreground', 'hover:bg-primary/90 hover:text-primary-foreground', 'focus:bg-primary focus:text-primary-foreground', 'shadow-sm shadow-primary/25', 'dark:shadow-primary/15', 'font-semibold'),
    day_today: cn('bg-accent text-accent-foreground', 'font-semibold', 'ring-1 ring-accent-foreground/20'),
    day_outside: cn('day-outside', 'text-gray-300 dark:text-gray-600', 'opacity-50', 'aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30'),
    day_range_middle: cn('aria-selected:bg-accent aria-selected:text-accent-foreground', 'rounded-none'),
    day_disabled: cn('text-gray-300 dark:text-gray-600', 'opacity-40 cursor-not-allowed'),
    day_hidden: 'invisible',
};
// ============================================================================
// NAV ICONS — use React.ReactElement return type, compatible with new JSX transform
// ============================================================================
function IconLeft(props) {
    return _jsx(ChevronLeft, { "aria-hidden": true, className: cn('size-4', props.className) });
}
function IconRight(props) {
    return _jsx(ChevronRight, { "aria-hidden": true, className: cn('size-4', props.className) });
}
// ============================================================================
// COMPONENT
// ============================================================================
/**
 * Accessible date picker built on `react-day-picker` with:
 *
 * - Full dark-mode support
 * - Responsive layout (vertical on mobile, horizontal on desktop)
 * - Subtle press & hover micro-interactions
 * - Keyboard-navigable with visible focus rings
 */
const Calendar = memo(function Calendar({ className, classNames: classNamesOverride, showOutsideDays = true, components, ...props }) {
    const mergedClassNames = {
        ...BASE_CLASSNAMES,
        ...classNamesOverride,
    };
    // react-day-picker v9 uses Chevron component instead of IconLeft/IconRight.
    // We pass a Chevron that switches direction based on the `orientation` prop.
    const mergedComponents = {
        Chevron: ({ orientation, ...rest }) => orientation === 'left'
            ? _jsx(IconLeft, { ...rest })
            : _jsx(IconRight, { ...rest }),
        ...components,
    };
    return (_jsx(DayPicker, { showOutsideDays: showOutsideDays, className: cn('p-3 sm:p-4', 'rounded-2xl', 'bg-white dark:bg-gray-900', 'border border-gray-200/80 dark:border-gray-800/60', 'shadow-xl shadow-black/8 dark:shadow-black/30', 'ring-1 ring-black/[0.03] dark:ring-white/[0.04]', 'motion-safe:animate-in motion-safe:fade-in-0 motion-safe:zoom-in-95', 'motion-safe:duration-200', className), classNames: mergedClassNames, components: mergedComponents, ...props }));
});
Calendar.displayName = 'Calendar';
export { Calendar };
//# sourceMappingURL=Calendar.js.map