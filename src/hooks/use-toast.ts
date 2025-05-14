
import { useState, useCallback, createContext, useContext } from 'react';

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  duration?: number;
  variant?: 'default' | 'destructive' | 'success';
}

interface ToastContextValue {
  toasts: Toast[];
  toast: (props: Omit<Toast, 'id'>) => void;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback(
    ({ title, description, variant, duration = 5000 }: Omit<Toast, 'id'>) => {
      const id = Math.random().toString(36).slice(2);
      setToasts((prevToasts) => [...prevToasts, { id, title, description, variant, duration }]);

      // Auto dismiss
      if (duration > 0) {
        setTimeout(() => {
          dismiss(id);
        }, duration);
      }
    },
    []
  );

  const dismiss = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss, dismissAll }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

// Export a standalone toast function for convenience
export const toast = {
  default: (props: { title?: string; description: string }) => {
    console.warn('Standalone toast called. Make sure you have ToastProvider set up.');
  },
  success: (props: { title?: string; description: string }) => {
    console.warn('Standalone toast called. Make sure you have ToastProvider set up.');
  },
  error: (props: { title?: string; description: string }) => {
    console.warn('Standalone toast called. Make sure you have ToastProvider set up.');
  },
  warning: (props: { title?: string; description: string }) => {
    console.warn('Standalone toast called. Make sure you have ToastProvider set up.');
  }
};
