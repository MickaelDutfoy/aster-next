'use client';

import { sendContactForm } from '@/actions/sendContactForm';
import { Member } from '@/lib/types';
import { useTranslations } from 'next-intl';
import { useRef, useState } from 'react';
import { showToast } from '../tools/ToastProvider';

export const ContactForm = ({ user }: { user: Member }) => {
  const t = useTranslations();
  const formRef = useRef<HTMLFormElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const contactTopic = formData.get('contactTopic')?.toString().trim();
    const contactContent = formData.get('contactContent')?.toString().trim();
    const contactAccept = formData.has('contactAccept');

    if (!contactTopic || !contactContent) {
      showToast({
        ok: false,
        status: 'error',
        message: t('toasts.requiredFieldsMissing'),
      });
      return;
    }

    if (!contactAccept) {
      showToast({
        ok: false,
        status: 'error',
        message: t('toasts.termsNotAccepted'),
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await sendContactForm(formData, user.email);
      showToast({
        ...res,
        message: res.message ? t(res.message) : undefined,
      });
      if (res.ok) {
        formRef.current?.reset();
      }
    } catch (err) {
      showToast({
        ok: false,
        status: 'error',
        message: t('toasts.errorGeneric'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form ref={formRef} className="contact-form" onSubmit={handleSubmit}>
      <p className="notice">{t('common.requiredFieldsNotice')}</p>
      <p>{t('contact.topic')}</p>
      <input type="text" name="contactTopic" />
      <p>{t('contact.content')}</p>
      <textarea name="contactContent" />
      <p className="notice">{t('contact.notice')}</p>
      <label className="accept-terms" htmlFor="contactAccept">
        {t('contact.accept')}
        <input type="checkbox" name="contactAccept" id="contactAccept" />
      </label>
      <button type="submit" className="little-button" aria-busy={isLoading} disabled={isLoading}>
        {isLoading ? t('common.sending') : t('common.send')}
      </button>
    </form>
  );
};
