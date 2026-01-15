import { Share2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { showToast } from './ToastProvider';

export const ShareButton = () => {
  const t = useTranslations();

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
    <button className="share-button" onClick={handleShare}>
      <Share2 size={28} />
    </button>
  );
};
