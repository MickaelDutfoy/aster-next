import { Share2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { showToast } from '../tools/ToastProvider';

export const SharePublicPage = ({ url }: { url: string }) => {
  const t = useTranslations();

  const handleShare = async () => {
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
