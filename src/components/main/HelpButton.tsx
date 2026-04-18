'use client';

import { MessageCircleQuestionMark } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

export const HelpButton = ({ message }: { message: string }) => {
  const t = useTranslations();

  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="help">
      {open && <div className="overlay" onClick={() => setOpen(false)} />}
      <button className="help-button" onClick={() => setOpen(true)}>
        <span>{t('help.label')}</span>
        <MessageCircleQuestionMark className="icon" size={26} />
      </button>
      {open && <div className="help-message">{t(message)}</div>}
    </div>
  );
};
