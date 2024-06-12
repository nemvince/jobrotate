import { writable } from 'svelte/store';

type ToastType = 'info' | 'success' | 'warning' | 'error';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

export const toast = writable<Toast[]>([]);

let id = 0;

export const addToast = (message: string, type: ToastType = 'info') => {
  toast.update((toasts) => [...toasts, { id: id++, message, type }]);

  setTimeout(() => {
    removeToast(id - 1);
  }, 5000);
};

export const removeToast = (id: number) => {
  toast.update((toasts) => toasts.filter((toast) => toast.id !== id));
};
