/**
 * Utility functions for formatting data in admin interfaces
 */
export declare const formatCurrency: (amount: number, currency?: string, locale?: string) => string;
export declare const formatNumber: (value: number, locale?: string) => string;
export declare const formatPercentage: (value: number, decimals?: number, locale?: string) => string;
export declare const formatDate: (date: string | Date, locale?: string, options?: Intl.DateTimeFormatOptions) => string;
export declare const formatTime: (date: string | Date, locale?: string) => string;
export declare const formatDateTime: (date: string | Date, locale?: string) => string;
export declare const formatDuration: (milliseconds: number) => string;
export declare const formatFileSize: (bytes: number) => string;
export declare const truncateText: (text: string, maxLength: number, suffix?: string) => string;
export declare const capitalize: (text: string) => string;
export declare const camelToTitle: (text: string) => string;
export declare const formatPhoneNumber: (phone: string) => string;
export declare const formatStatusBadge: (status: string, _type?: "default" | "success" | "warning" | "error" | "info") => {
    text: string;
    className: string;
};
export declare const formatStatNumber: (value: number) => string;
export declare const formatters: {
    currency: (amount: number, currency?: string, locale?: string) => string;
    number: (value: number, locale?: string) => string;
    percentage: (value: number, decimals?: number, locale?: string) => string;
    date: (date: string | Date, locale?: string, options?: Intl.DateTimeFormatOptions) => string;
    time: (date: string | Date, locale?: string) => string;
    dateTime: (date: string | Date, locale?: string) => string;
    duration: (milliseconds: number) => string;
    fileSize: (bytes: number) => string;
    truncateText: (text: string, maxLength: number, suffix?: string) => string;
    capitalize: (text: string) => string;
    camelToTitle: (text: string) => string;
    phoneNumber: (phone: string) => string;
    statusBadge: (status: string, _type?: "default" | "success" | "warning" | "error" | "info") => {
        text: string;
        className: string;
    };
    statNumber: (value: number) => string;
};
