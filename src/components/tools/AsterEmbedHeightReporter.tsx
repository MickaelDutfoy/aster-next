'use client';

import { useEffect } from 'react';

export const AsterEmbedHeightReporter = ({ slug }: { slug: string }) => {
  useEffect(() => {
    const HEIGHT_THRESHOLD = 24;
    let lastHeight = 0;

    const sendHeight = (force = false) => {
      const modal = document.querySelector('[data-aster-modal]');
      const mainContent = document.querySelector('[data-aster-embed-content]');

      const baseHeight = mainContent
        ? mainContent.getBoundingClientRect().bottom + window.scrollY
        : document.documentElement.scrollHeight;

      const modalBottom = modal ? modal.getBoundingClientRect().bottom + window.scrollY : 0;

      const height = Math.ceil(Math.max(baseHeight, modalBottom + 24));

      const isSmallChange = Math.abs(height - lastHeight) < HEIGHT_THRESHOLD;

      if (!force && isSmallChange) return;

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

    const sendHeightAfterRender = (force = false) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => sendHeight(force));
      });
    };

    const handleLoad = () => sendHeightAfterRender();
    const handleResize = () => sendHeightAfterRender();
    const handleEmbedResize = () => sendHeightAfterRender(true);

    sendHeightAfterRender();

    window.addEventListener('aster:resize-embed', handleEmbedResize);

    const observer = new ResizeObserver(() => sendHeightAfterRender());

    observer.observe(document.documentElement);
    observer.observe(document.body);

    window.addEventListener('load', handleLoad);
    window.addEventListener('resize', handleResize);
    window.addEventListener('aster:resize-embed', handleEmbedResize);

    return () => {
      observer.disconnect();

      window.removeEventListener('load', handleLoad);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('aster:resize-embed', handleEmbedResize);
    };
  }, [slug]);

  return null;
};
