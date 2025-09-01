'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import Toast, { ToastProps } from '@/components/ui/Toast';

interface ToastContextType {
  showToast: (toast: Omit<ToastProps, 'id'>) => void;
  showSuccess: (title: string, message?: string, action?: ToastProps['action']) => void;
  showError: (title: string, message?: string, action?: ToastProps['action']) => void;
  showWarning: (title: string, message?: string, action?: ToastProps['action']) => void;
  showInfo: (title: string, message?: string, action?: ToastProps['action']) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: React.ReactNode;
}

export default function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showToast = useCallback((toast: Omit<ToastProps, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: ToastProps = { ...toast, id };
    setToasts(prev => [...prev, newToast]);
  }, []);

  const showSuccess = useCallback((title: string, message?: string, action?: ToastProps['action']) => {
    showToast({ type: 'success', title, message, action });
  }, [showToast]);

  const showError = useCallback((title: string, message?: string, action?: ToastProps['action']) => {
    showToast({ type: 'error', title, message, action });
  }, [showToast]);

  const showWarning = useCallback((title: string, message?: string, action?: ToastProps['action']) => {
    showToast({ type: 'warning', title, message, action });
  }, [showToast]);

  const showInfo = useCallback((title: string, message?: string, action?: ToastProps['action']) => {
    showToast({ type: 'info', title, message, action });
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, showSuccess, showError, showWarning, showInfo }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        <AnimatePresence>
          {toasts.map((toast) => (
            <Toast
              key={toast.id}
              {...toast}
              onClose={removeToast}
            />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}