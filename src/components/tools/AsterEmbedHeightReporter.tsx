'use client';

import { useEffect } from 'react';

export const AsterEmbedHeightReporter = ({ slug }: { slug: string }) => {
  useEffect(() => {
    const EMBED_HEIGHT_PADDING = 16;

    const mainContent = document.querySelector('[data-aster-embed-content]');

    const getContentBottom = () => {
      if (!mainContent) {
        return document.documentElement.scrollHeight;
      }

      const children = Array.from(mainContent.children);

      if (children.length === 0) {
        return mainContent.getBoundingClientRect().top + window.scrollY;
      }

      return Math.max(
        ...children.map((child) => child.getBoundingClientRect().bottom + window.scrollY),
      );
    };

    const sendHeight = () => {
      const modal = document.querySelector('[data-aster-modal]');

      const contentBottom = getContentBottom();
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

    if (mainContent) {
      observer.observe(mainContent);

      Array.from(mainContent.children).forEach((child) => {
        observer.observe(child);
      });
    }

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