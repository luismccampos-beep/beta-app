export interface ToastProps {
    title?: string;
    description?: string;
    duration?: number;
    variant?: "default" | "destructive" | "success" | "info" | "warning";
}
export interface Toast extends ToastProps {
    id: string;
}
export declare const useToast: () => {
    toast: (message: string | ToastProps, _p0?: {
        description?: string;
    }) => void;
    dismiss: (toastId?: string) => string | number;
    success: (message: string | ToastProps, _p0?: {
        description?: string;
    }) => void;
    error: (message: string | ToastProps, _p0?: {
        description?: string;
    }) => void;
    info: (message: string | ToastProps, _p0?: {
        description?: string;
    }) => void;
    warning: (message: string | ToastProps, _p0?: {
        description?: string;
    }) => void;
};
