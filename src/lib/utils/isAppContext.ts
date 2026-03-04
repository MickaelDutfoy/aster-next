export const isAppContext = () => {
  if (typeof window === 'undefined') return false;

  return (
    window.matchMedia?.('(display-mode: standalone)')?.matches ||
    // @ts-expect-error - iOS Safari
    window.navigator.standalone === true
  );
};
