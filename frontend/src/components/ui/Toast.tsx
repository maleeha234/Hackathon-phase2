"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Toast } from "@/types";

const toastIcons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const toastColors = {
  success: "bg-success-50 text-success-600 border-success-200",
  error: "bg-danger-50 text-danger-600 border-danger-200",
  warning: "bg-warning-50 text-warning-600 border-warning-200",
  info: "bg-primary-50 text-primary-600 border-primary-200",
};

interface ToastItemProps {
  toast: Toast;
  onClose: (id: string) => void;
}

function ToastItem({ toast, onClose }: ToastItemProps) {
  const Icon = toastIcons[toast.type];

  React.useEffect(() => {
    if (toast.type === "error") return; // Error toasts persist

    const timer = setTimeout(() => {
      onClose(toast.id);
    }, 5000);

    return () => clearTimeout(timer);
  }, [toast, onClose]);

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 rounded-lg border shadow-lg animate-slide-in",
        toastColors[toast.type]
      )}
      role="alert"
      aria-live="polite"
    >
      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{toast.title}</p>
        {toast.message && (
          <p className="mt-0.5 text-sm opacity-90">{toast.message}</p>
        )}
      </div>
      <button
        onClick={() => onClose(toast.id)}
        className="flex-shrink-0 p-1 rounded hover:bg-black/5 transition-colors"
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: Toast[];
  onClose: (id: string) => void;
  position?: "top-right" | "bottom-right";
}

export function ToastContainer({
  toasts,
  onClose,
  position = "top-right",
}: ToastContainerProps) {
  const positionClasses = {
    "top-right": "top-4 right-4",
    "bottom-right": "bottom-4 right-4",
  };

  if (typeof document === "undefined" || toasts.length === 0) return null;

  return createPortal(
    <div
      className={cn(
        "fixed z-[100] flex flex-col gap-2 w-full max-w-sm pointer-events-none",
        positionClasses[position]
      )}
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} onClose={onClose} />
        </div>
      ))}
    </div>,
    document.body
  );
}

// Toast hook for managing toasts
export function useToast() {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const addToast = React.useCallback(
    (toast: Omit<Toast, "id">) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { ...toast, id }]);
      return id;
    },
    []
  );

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = React.useMemo(
    () => ({
      success: (title: string, message?: string) =>
        addToast({ type: "success", title, message }),
      error: (title: string, message?: string) =>
        addToast({ type: "error", title, message }),
      warning: (title: string, message?: string) =>
        addToast({ type: "warning", title, message }),
      info: (title: string, message?: string) =>
        addToast({ type: "info", title, message }),
    }),
    [addToast]
  );

  return { toasts, addToast, removeToast, toast };
}
