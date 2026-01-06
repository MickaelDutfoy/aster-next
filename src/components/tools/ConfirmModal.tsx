'use client';

import { Action } from '@/lib/types';
import { CircleX } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { showToast } from './ToastProvider';

export const ConfirmModal = ({ onCancel, action }: { onCancel: () => void; action: Action }) => {
  const t = useTranslations();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onConfirm = async () => {
    try {
      setIsLoading(true);
      await action.handler();
    } catch {
      showToast({ ok: false, status: 'error', message: t('toasts.errorGeneric') });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <CircleX className="close" size={35} onClick={onCancel} />
        <h3>{action.name}</h3>
        <div className="confirm-modal-content">
          <p>{t('common.areYouSure')}</p>
          <div className="yes-no">
            <button
              type="submit"
              onClick={onConfirm}
              className="little-button"
              aria-busy={isLoading}
              disabled={isLoading}
            >
              {isLoading ? t('common.validating') : t('common.validate')}
            </button>
            <button
              type="button"
              className="little-button"
              onClick={onCancel}
              aria-busy={isLoading}
              disabled={isLoading}
            >
              {t('common.cancel')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
