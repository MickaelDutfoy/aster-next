'use client';

import { Share2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { showToast } from './ToastProvider';

export const ShareButton = () => {
  const t = useTranslations();

  const [isSharing, setIsSharing] = useState(false);

  async function handleShareClick() {
    setIsSharing(true);

    try {
      await handleShare();
    } finally {
      window.setTimeout(() => {
        setIsSharing(false);
      }, 250);
    }
  }

  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      await navigator.share({ url });
    } else {
      await navigator.clipboard.writeText(url);
      showToast({ status: 'success', message: t('common.copiedToClipboard') });
    }
  };

  return (
    <button
      type="button"
      className={`share-button ${isSharing ? 'is-loading' : ''}`}
      onClick={handleShareClick}
    >
      <Share2 size={28} />
    </button>
  );
};
