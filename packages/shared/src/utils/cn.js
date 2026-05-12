import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
/**
 * Combines multiple class names and merges Tailwind CSS classes
 * @param inputs - Class names or class name objects to be combined
 * @returns A single string of combined and deduplicated class names
 */
export function cn(...inputs) {
    return twMerge(clsx(...inputs));
}
//# sourceMappingURL=cn.js.map