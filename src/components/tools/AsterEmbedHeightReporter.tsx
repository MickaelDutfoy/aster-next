'use client';

import { useEffect } from 'react';

export const AsterEmbedHeightReporter = ({ slug }: { slug: string }) => {
  useEffect(() => {
    const EMBED_HEIGHT_PADDING = 16;

    const sendHeight = () => {
      const mainContent = document.querySelector('[data-aster-embed-content]');
      const modal = document.querySelector('[data-aster-modal]');

      const contentBottom = mainContent
        ? mainContent.getBoundingClientRect().bottom + window.scrollY
        : document.documentElement.scrollHeight;

      const modalBottom = modal ? modal.getBoundingClientRect().bottom + window.scrollY : 0;

      const height = Math.ceil(Math.max(contentBottom, modalBottom) + EMBED_HEIGHT_PADDING);

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

    const observer = new ResizeObserver(sendHeightAfterRender);

    observer.observe(document.documentElement);
    observer.observe(document.body);

    window.addEventListener('load', sendHeightAfterRender);
    window.addEventListener('resize', sendHeightAfterRender);
    window.addEventListener('aster:resize-embed', sendHeightAfterRender);

    sendHeightAfterRender();

    return () => {
      observer.disconnect();

      window.removeEventListener('load', sendHeightAfterRender);
      window.removeEventListener('resize', sendHeightAfterRender);
      window.removeEventListener('aster:resize-embed', sendHeightAfterRender);
    };
  }, [slug]);

  return null;
};