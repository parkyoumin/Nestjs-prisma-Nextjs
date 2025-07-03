"use client";

import { useEffect, useState } from "react";

export type ToastType = "success" | "error" | "info";

export interface ToastProps {
  id: number;
  message: string;
  type: ToastType;
  onDismiss: (id: number) => void;
}

const TOAST_COLORS: Record<ToastType, string> = {
  success: "bg-green-500",
  error: "bg-red-500",
  info: "bg-blue-500",
};

export default function Toast({ id, message, type, onDismiss }: ToastProps) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleDismiss();
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => {
      onDismiss(id);
    }, 300);
  };

  return (
    <div
      className={`flex w-full items-center gap-4 rounded-lg p-4 text-white shadow-lg ${
        TOAST_COLORS[type]
      } ${isExiting ? "animate-slide-out-down" : "animate-slide-in-up"}`}
    >
      <p className="flex-1 font-medium whitespace-nowrap">{message}</p>
      <button
        onClick={handleDismiss}
        className="rounded-full p-1 text-white/80 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white"
        aria-label="Dismiss"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}
