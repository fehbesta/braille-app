'use client';

import { createContext, useContext, useState, useCallback, useRef, ReactNode } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'xp';

interface Toast { id: number; message: string; type: ToastType; exiting: boolean; }
interface ToastContextValue { show: (message: string, type?: ToastType) => void; }

const ToastContext = createContext<ToastContextValue>({ show: () => {} });
export function useToast() { return useContext(ToastContext); }

const ACCENT: Record<ToastType, string> = {
  success: 'border-l-[#75b7a8]',
  error:   'border-l-rose-500',
  info:    'border-l-[#8f9995]',
  xp:      'border-l-[#d6a85b]',
};

const ICONS: Record<ToastType, string> = {
  success: 'OK', error: 'ERR', info: 'INFO', xp: 'XP',
};

const ICON_COLOR: Record<ToastType, string> = {
  success: 'text-[#75b7a8]',
  error:   'text-rose-400',
  info:    'text-[#a9b0a9]',
  xp:      'text-[#d6a85b]',
};

let nextId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)));
    const t = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      timers.current.delete(id);
    }, 200);
    timers.current.set(id, t);
  }, []);

  const show = useCallback((message: string, type: ToastType = 'info') => {
    const id = ++nextId;
    setToasts((prev) => [...prev.slice(-2), { id, message, type, exiting: false }]);
    const t = setTimeout(() => dismiss(id), 3000);
    timers.current.set(id, t);
  }, [dismiss]);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="fixed bottom-5 right-5 z-[200] flex flex-col gap-2 items-end pointer-events-none"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className={[
              'pointer-events-auto flex items-center gap-3 pl-3 pr-3 py-2.5',
              'surface-strong border-l-2',
              ACCENT[toast.type],
              'rounded-lg text-[#f3eee5] text-xs font-medium max-w-xs w-full',
              toast.exiting ? 'toast-exit' : 'toast-enter',
            ].join(' ')}
          >
            <span className={`shrink-0 text-xs ${ICON_COLOR[toast.type]}`} aria-hidden>{ICONS[toast.type]}</span>
            <span className="flex-1 text-[#d8d1c4]">{toast.message}</span>
            <button
              onClick={() => dismiss(toast.id)}
              className="shrink-0 text-[#66706d] hover:text-[#a9b0a9] transition-colors text-base leading-none"
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
