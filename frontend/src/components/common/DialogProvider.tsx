"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

interface DialogOptions {
  title?: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

interface DialogState {
  open: boolean;
  type: "alert" | "confirm";
  message: string;
  title?: string;
  confirmLabel: string;
  cancelLabel: string;
  resolve: (value: boolean) => void;
}

interface DialogContextValue {
  alert: (message: string, options?: DialogOptions) => Promise<void>;
  confirm: (message: string, options?: DialogOptions) => Promise<boolean>;
}

const DialogContext = createContext<DialogContextValue | null>(null);

export function useDialog() {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error("useDialog must be used within DialogProvider");
  return ctx;
}

export default function DialogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<DialogState | null>(null);
  const resolveRef = useRef<((value: boolean) => void) | null>(null);

  const showDialog = useCallback(
    (
      type: "alert" | "confirm",
      message: string,
      options?: DialogOptions,
    ): Promise<boolean> => {
      return new Promise((resolve) => {
        resolveRef.current = resolve;
        setState({
          open: true,
          type,
          message,
          title: options?.title,
          confirmLabel: options?.confirmLabel ?? "확인",
          cancelLabel: options?.cancelLabel ?? "취소",
          resolve,
        });
      });
    },
    [],
  );

  const alert = useCallback(
    async (message: string, options?: DialogOptions) => {
      await showDialog("alert", message, options);
    },
    [showDialog],
  );

  const confirm = useCallback(
    (message: string, options?: DialogOptions) => {
      return showDialog("confirm", message, options);
    },
    [showDialog],
  );

  const handleConfirm = () => {
    resolveRef.current?.(true);
    setState(null);
  };

  const handleCancel = () => {
    resolveRef.current?.(false);
    setState(null);
  };

  useEffect(() => {
    if (!state?.open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleCancel();
      if (e.key === "Enter") handleConfirm();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [state?.open]);

  return (
    <DialogContext.Provider value={{ alert, confirm }}>
      {children}
      {state?.open && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-6">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={state.type === "alert" ? handleConfirm : handleCancel}
          />
          <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-primary-400 to-primary-500" />
            <div className="px-6 pt-6 pb-4">
              {state.title && (
                <h3 className="text-base font-semibold text-gray-800 mb-2">
                  {state.title}
                </h3>
              )}
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                {state.message}
              </p>
            </div>
            <div
              className={`px-6 pb-6 flex gap-2 ${
                state.type === "alert" ? "justify-center" : "justify-end"
              }`}
            >
              {state.type === "confirm" && (
                <button
                  onClick={handleCancel}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-500 font-medium hover:bg-gray-50 transition-colors"
                >
                  {state.cancelLabel}
                </button>
              )}
              <button
                onClick={handleConfirm}
                className={`py-2.5 rounded-xl text-sm font-medium transition-colors bg-primary-500 text-white hover:bg-primary-600 active:scale-95 ${
                  state.type === "confirm" ? "flex-1" : "px-10"
                }`}
              >
                {state.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </DialogContext.Provider>
  );
}
