'use client';

import { useServerInsertedHTML } from 'next/navigation';
import { useRef } from 'react';

export function ThemeInitializer() {
  const inserted = useRef(false);

  useServerInsertedHTML(() => {
    if (inserted.current) return null;

    inserted.current = true;

    return (
      <script
        id="theme-initializer"
        dangerouslySetInnerHTML={{
          __html: `
            (function () {
              try {
                var t = localStorage.getItem('theme');

                if (t === 'light' || t === 'dark' || t === 'high-contrast') {
                  document.documentElement.dataset.theme = t;
                } else {
                  document.documentElement.removeAttribute('data-theme');
                }
              } catch (e) {}
            })();
          `,
        }}
      />
    );
  });

  return null;
}
