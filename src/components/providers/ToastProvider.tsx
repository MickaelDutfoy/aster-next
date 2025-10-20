'use client';

import '@/styles/toasts.scss';
import { useEffect, useRef, useState } from 'react';

type ToastType = 'success' | 'error' | 'info';
type Toast = { id: number; message: string; type: ToastType };

export type ToastEventDetail = { message: string; type?: ToastType; duration?: number };

export function showToast(message: string, type: ToastType = 'info', duration = 3000) {
  if (typeof window === 'undefined') return;
  const event = new CustomEvent<ToastEventDetail>('toast', { detail: { message, type, duration } });
  window.dispatchEvent(event);
}

export default function ToastProvider() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<Map<number, number>>(new Map());

  useEffect(() => {
    function onToast(e: Event) {
      const {
        message,
        type = 'info',
        duration = 3000,
      } = (e as CustomEvent<ToastEventDetail>).detail;
      const id = Date.now() + Math.floor(Math.random() * 1000);

      setToasts((prev) => [...prev, { id, message, type }]);

      const toast = window.setTimeout(() => dismiss(id), duration);
      timers.current.set(id, toast);
    }

    window.addEventListener('toast', onToast as EventListener);
    return () => window.removeEventListener('toast', onToast as EventListener);
  }, []);

  function dismiss(id: number) {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
    const toast = timers.current.get(id);
    if (toast) {
      clearTimeout(toast);
      timers.current.delete(id);
    }
  }

  return (
    <div id="toast-container" aria-live="polite" aria-atomic="true" className="toast-container">
      {toasts.map((toast) => (
        <button
          key={toast.id}
          className={`toast ${toast.type === 'error' ? 'toast-error' : toast.type === 'success' ? 'toast-success' : 'toast-info'}`}
          onClick={() => dismiss(toast.id)}
          type="button"
        >
          <span className="toast-message">{toast.message}</span>
        </button>
      ))}
    </div>
  );
}
