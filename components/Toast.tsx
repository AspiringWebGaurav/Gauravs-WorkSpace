'use client';

import * as React from "react";
import { cn } from "@/lib/utils";

export type ToastIntent = "success" | "error" | "info";

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  intent?: ToastIntent;
}

interface ToastContextValue {
  toasts: ToastMessage[];
  pushToast: (toast: Omit<ToastMessage, "id">) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextValue | undefined>(
  undefined
);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = React.useState<ToastMessage[]>([]);

  const pushToast = React.useCallback(
    (toast: Omit<ToastMessage, "id">) => {
      setToasts((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          intent: toast.intent ?? "info",
          title: toast.title,
          description: toast.description,
        },
      ]);
    },
    [setToasts]
  );

  const dismissToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  React.useEffect(() => {
    if (!toasts.length) return;
    const timers = toasts.map((toast) =>
      window.setTimeout(() => {
        dismissToast(toast.id);
      }, 4200)
    );
    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [toasts, dismissToast]);

  return (
    <ToastContext.Provider value={{ toasts, pushToast, dismissToast }}>
      {children}
      <div className="fixed right-4 top-4 z-50 flex w-80 flex-col gap-3 md:right-8 md:top-8">
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onDismiss={() => dismissToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const intentStyles: Record<ToastIntent, string> = {
  success: "border-green-500/50 bg-green-500/10 text-green-100",
  error: "border-danger/60 bg-danger/10 text-danger-100",
  info: "border-brand/60 bg-brand/10 text-brand-foreground",
};

const ToastItem = ({
  toast,
  onDismiss,
}: {
  toast: ToastMessage;
  onDismiss: () => void;
}) => (
  <div
    className={cn(
      "glass animate-fade-in rounded-xl border px-4 py-3 text-sm shadow-lg shadow-black/40",
      intentStyles[toast.intent ?? "info"]
    )}
  >
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="font-semibold">{toast.title}</p>
        {toast.description ? (
          <p className="mt-1 text-xs text-slate-200/80">{toast.description}</p>
        ) : null}
      </div>
      <button
        type="button"
        onClick={onDismiss}
        className="rounded-full border border-white/10 p-1 text-xs text-slate-200 transition hover:border-white/30 hover:bg-white/10"
        aria-label="Dismiss notification"
      >
        Ã—
      </button>
    </div>
  </div>
);

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};


