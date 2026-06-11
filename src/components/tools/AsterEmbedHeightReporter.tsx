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

    sendHeight();

    const observer = new ResizeObserver(sendHeight);
    observer.observe(document.documentElement);
    observer.observe(document.body);

    window.addEventListener('load', sendHeight);
    window.addEventListener('resize', sendHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener('load', sendHeight);
      window.removeEventListener('resize', sendHeight);
    };
  }, [slug]);

  return null;
};
