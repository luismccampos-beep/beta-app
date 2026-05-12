type ClassValue = unknown;

declare module '@akmleva/shared' {
  export function cn(...inputs: ClassValue[]): string;
}

declare module '@akmleva/shared/utils/cn' {
  export function cn(...inputs: ClassValue[]): string;
}

