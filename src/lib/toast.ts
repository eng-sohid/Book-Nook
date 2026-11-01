import { toast as sonnerToast } from "sonner";

type ToastOptions = {
  id?: string | number;
  duration?: number;
};

export const toast = {
  success: (message: string, options?: ToastOptions) =>
    sonnerToast.success(message, options),

  error: (message: string, options?: ToastOptions) =>
    sonnerToast.error(message, options),

  warning: (message: string, options?: ToastOptions) =>
    sonnerToast.warning(message, options),

  info: (message: string, options?: ToastOptions) =>
    sonnerToast.info(message, options),

  loading: (message: string) => sonnerToast.loading(message),

  dismiss: (id?: string | number) => sonnerToast.dismiss(id),

  promise: sonnerToast.promise,
};
