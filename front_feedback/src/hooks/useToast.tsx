"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from "react";
import { createPortal } from "react-dom";
import Toast, { ToastProps } from "@/components/Toast";

interface ToastOptions {
  message: string;
  type: ToastProps["type"];
}

interface ToastContextType {
  addToast: (options: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

interface ToastState extends ToastProps {}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastState[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const addToast = useCallback(({ message, type }: ToastOptions) => {
    const id = Date.now();
    setToasts((prevToasts) => [
      ...prevToasts,
      { id, message, type, onDismiss: removeToast },
    ]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  const portalStyle: React.CSSProperties = {
    position: "fixed",
    bottom: "5rem",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 50,
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {isMounted &&
        createPortal(
          <div style={portalStyle}>
            <div className="space-y-3">
              {toasts.map((toast) => (
                <Toast key={toast.id} {...toast} />
              ))}
            </div>
          </div>,
          document.body,
        )}
    </ToastContext.Provider>
  );
}
