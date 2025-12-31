'use client';

import { ActionValidation } from '@/lib/types';
import '@/styles/toasts.scss';
import { useEffect, useRef, useState } from 'react';

type ToastEventDetail = {
  message: string;
  status?: 'success' | 'error' | 'info';
  duration?: number;
};

export function showToast(res: ActionValidation, duration?: number) {
  if (typeof window === 'undefined') return;
  const event = new CustomEvent<ToastEventDetail>('toast', {
    detail: { message: res.message ?? '', status: res.status, duration },
  });
  window.dispatchEvent(event);
}

export default function ToastProvider() {
  const [toasts, setToasts] = useState<
    { id: number; message: string; status: 'success' | 'error' | 'info' }[]
  >([]);
  const timers = useRef<Map<number, number>>(new Map());

  useEffect(() => {
    function onToast(e: Event) {
      const {
        message,
        status = 'info',
        duration = 3000,
      } = (e as CustomEvent<ToastEventDetail>).detail;
      if (!message) return;

      const id = Date.now() + Math.floor(Math.random() * 1000);

      setToasts((prev) => [...prev, { id, message, status }]);

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
          className={`toast ${toast.status === 'error' ? 'toast-error' : toast.status === 'success' ? 'toast-success' : 'toast-info'}`}
          onClick={() => dismiss(toast.id)}
          type="button"
        >
          <span className="toast-message">{toast.message}</span>
        </button>
      ))}
    </div>
  );
}
