'use client';
import { useEffect } from 'react';

export default function ServiceWorkerRegister() {
  useEffect(() => {
    // Désactivé pour test A/B :
    // if ("serviceWorker" in navigator) {
    //   navigator.serviceWorker.register("/sw.js?v=off").catch(() => {});
    // }
  }, []);
  return null;
}
