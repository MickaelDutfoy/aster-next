'use client';

import { useEffect } from 'react';

export const AsterEmbedHeightReporter = ({ slug }: { slug: string }) => {
  useEffect(() => {
    const HEIGHT_THRESHOLD = 24;
    let lastHeight = 0;

    const sendHeight = () => {
      const modal = document.querySelector('[data-aster-modal]');
      const baseHeight = document.documentElement.scrollHeight;
      const modalBottom = modal ? modal.getBoundingClientRect().bottom + window.scrollY : 0;
      const height = Math.ceil(Math.max(baseHeight, modalBottom + 24));

      const isSmallChange = Math.abs(height - lastHeight) < HEIGHT_THRESHOLD;

      if (isSmallChange) return;

      lastHeight = height;
      window.parent.postMessage(
        {
          type: 'ASTER_EMBED_HEIGHT',
          slug,
          height,
        },
        '*',
      );
    };

    const sendHeightAfterRender = () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(sendHeight);
      });
    };

    sendHeightAfterRender();

    const observer = new ResizeObserver(sendHeightAfterRender);
    observer.observe(document.documentElement);
    observer.observe(document.body);

    window.addEventListener('load', sendHeightAfterRender);
    window.addEventListener('resize', sendHeightAfterRender);
    window.addEventListener('aster:resize-embed', sendHeightAfterRender);

    return () => {
      observer.disconnect();
      window.removeEventListener('load', sendHeightAfterRender);
      window.removeEventListener('resize', sendHeightAfterRender);
      window.removeEventListener('aster:resize-embed', sendHeightAfterRender);
    };
  }, [slug]);

  return null;
};
