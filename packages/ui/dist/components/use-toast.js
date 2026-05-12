"use client";
import { toast as sonnerToast } from "sonner";
export const useToast = () => {
    const toast = (message, _p0) => {
        if (typeof message === "string") {
            sonnerToast(message);
        }
        else {
            const { title, description, duration, variant } = message;
            const options = {};
            if (description !== undefined)
                options.description = description;
            if (duration !== undefined) {
                options.duration = duration;
            }
            const sonnerMethod = variant === "destructive"
                ? "error"
                : variant && variant !== "default"
                    ? variant
                    : null;
            if (sonnerMethod && sonnerMethod in sonnerToast) {
                const method = sonnerToast[sonnerMethod];
                method(title || description || "", options);
            }
            else {
                sonnerToast(title || description || "", options);
            }
        }
    };
    return {
        toast,
        dismiss: (toastId) => sonnerToast.dismiss(toastId),
        success: (message, _p0) => {
            if (typeof message === "string") {
                sonnerToast.success(message);
            }
            else {
                const { title, description, duration } = message;
                const options = {};
                if (description !== undefined)
                    options.description = description;
                if (duration !== undefined) {
                    options.duration = duration;
                }
                sonnerToast.success(title || description || "", options);
            }
        },
        error: (message, _p0) => {
            if (typeof message === "string") {
                sonnerToast.error(message);
            }
            else {
                const { title, description, duration } = message;
                const options = {};
                if (description !== undefined)
                    options.description = description;
                if (duration !== undefined) {
                    options.duration = duration;
                }
                sonnerToast.error(title || description || "", options);
            }
        },
        info: (message, _p0) => {
            if (typeof message === "string") {
                sonnerToast.info(message);
            }
            else {
                const { title, description, duration } = message;
                const options = {};
                if (description !== undefined)
                    options.description = description;
                if (duration !== undefined) {
                    options.duration = duration;
                }
                sonnerToast.info(title || description || "", options);
            }
        },
        warning: (message, _p0) => {
            if (typeof message === "string") {
                sonnerToast.warning(message);
            }
            else {
                const { title, description, duration } = message;
                const options = {};
                if (description !== undefined)
                    options.description = description;
                if (duration !== undefined) {
                    options.duration = duration;
                }
                sonnerToast.warning(title || description || "", options);
            }
        },
    };
};
//# sourceMappingURL=use-toast.js.map