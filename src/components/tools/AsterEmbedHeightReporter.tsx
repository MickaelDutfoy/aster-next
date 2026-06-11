'use client';

import { useEffect } from 'react';

export const AsterEmbedHeightReporter = ({ slug }: { slug: string }) => {
  useEffect(() => {
    const sendHeight = () => {
      window.parent.postMessage(
        {
          type: 'ASTER_EMBED_HEIGHT',
          slug,
          height: document.documentElement.scrollHeight,
        },
        '*',
      );
    };

    const sendHeightAfterRender = () => {
      requestAnimationFrame(sendHeight);
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
