import { type ClassValue } from 'clsx';
/**
 * Combines multiple class names and merges Tailwind CSS classes
 * @param inputs - Class names or class name objects to be combined
 * @returns A single string of combined and deduplicated class names
 */
export declare function cn(...inputs: ClassValue[]): string;
