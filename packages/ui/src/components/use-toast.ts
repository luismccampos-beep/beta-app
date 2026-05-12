"use client"
import { toast as sonnerToast } from "sonner";

export interface ToastProps {
  title?: string;
  description?: string;
  duration?: number;
  variant?: "default" | "destructive" | "success" | "info" | "warning";
}

export interface Toast extends ToastProps {
  id: string;
}

export const useToast = () => {
  const toast = (
    message: string | ToastProps,
    _p0?: { description?: string },
  ) => {
    if (typeof message === "string") {
      sonnerToast(message);
    } else {
      const { title, description, duration, variant } = message;
      const options: Record<string, unknown> = {};
      if (description !== undefined) options.description = description;
      if (duration !== undefined) {
        options.duration = duration;
      }

      const sonnerMethod =
        variant === "destructive"
          ? "error"
          : variant && variant !== "default"
            ? variant
            : null;

      if (sonnerMethod && sonnerMethod in sonnerToast) {
        const method =
          sonnerToast[sonnerMethod as "error" | "success" | "info" | "warning"];
        method(title || description || "", options);
      } else {
        sonnerToast(title || description || "", options);
      }
    }
  };

  return {
    toast,
    dismiss: (toastId?: string) => sonnerToast.dismiss(toastId),
    success: (message: string | ToastProps, _p0?: { description?: string }) => {
      if (typeof message === "string") {
        sonnerToast.success(message);
      } else {
        const { title, description, duration } = message;
        const options: Record<string, unknown> = {};
        if (description !== undefined) options.description = description;
        if (duration !== undefined) {
          options.duration = duration;
        }
        sonnerToast.success(title || description || "", options);
      }
    },
    error: (message: string | ToastProps, _p0?: { description?: string }) => {
      if (typeof message === "string") {
        sonnerToast.error(message);
      } else {
        const { title, description, duration } = message;
        const options: Record<string, unknown> = {};
        if (description !== undefined) options.description = description;
        if (duration !== undefined) {
          options.duration = duration;
        }
        sonnerToast.error(title || description || "", options);
      }
    },
    info: (message: string | ToastProps, _p0?: { description?: string }) => {
      if (typeof message === "string") {
        sonnerToast.info(message);
      } else {
        const { title, description, duration } = message;
        const options: Record<string, unknown> = {};
        if (description !== undefined) options.description = description;
        if (duration !== undefined) {
          options.duration = duration;
        }
        sonnerToast.info(title || description || "", options);
      }
    },
    warning: (message: string | ToastProps, _p0?: { description?: string }) => {
      if (typeof message === "string") {
        sonnerToast.warning(message);
      } else {
        const { title, description, duration } = message;
        const options: Record<string, unknown> = {};
        if (description !== undefined) options.description = description;
        if (duration !== undefined) {
          options.duration = duration;
        }
        sonnerToast.warning(title || description || "", options);
      }
    },
  };
};
