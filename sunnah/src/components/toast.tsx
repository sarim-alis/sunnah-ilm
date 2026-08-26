"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

type ToastItem = {
  type: "success" | "error";
  text1: string;
  text2?: string;
};

type ToastContextValue = {
  show: (item: ToastItem) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [item, setItem] = useState<ToastItem | null>(null);

  const show = useCallback((next: ToastItem) => {
    setItem(next);
    window.setTimeout(() => setItem(null), 2800);
  }, []);

  const value = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {item ? (
        <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
          <div
            className={`w-full max-w-sm rounded-2xl border px-4 py-3 shadow-lg ${
              item.type === "error"
                ? "border-error/30 bg-card text-text"
                : "border-border bg-card text-text"
            }`}
          >
            <p className="text-sm font-bold">{item.text1}</p>
            {item.text2 ? (
              <p className="mt-0.5 text-sm text-muted">{item.text2}</p>
            ) : null}
          </div>
        </div>
      ) : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
