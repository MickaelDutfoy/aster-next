'use client';

import { Download } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

export const DonwloadButton = ({ href }: { href: string }) => {
  const t = useTranslations();

  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadClick = () => {
    setIsDownloading(true);

    window.setTimeout(() => {
      setIsDownloading(false);
    }, 1800);
  };

  return (
    <a
      className={`share-button ${isDownloading ? 'is-loading' : ''}`}
      href={href}
      onClick={handleDownloadClick}
    >
      <Download size={28} />
    </a>
  );
};
