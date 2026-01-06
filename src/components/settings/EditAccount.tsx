'use client';

import { sendResetPasswordMail } from '@/actions/auth/sendResetPasswordMail';
import { editAccount } from '@/actions/settings/editAccount';
import { useRouter } from '@/i18n/routing';
import { editProfileSchema } from '@/lib/schemas/authSchemas';
import { Member } from '@/lib/types';
import { zodErrorMessage } from '@/lib/utils/zodErrorMessage';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { showToast } from '../tools/ToastProvider';

export const EditAccount = ({ user }: { user: Member }) => {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const userForm = {
      firstName: formData.get('userFirstName')?.toString().trim(),
      lastName: formData.get('userLastName')?.toString().trim(),
      phoneNumber: formData.get('userPhoneNumber')?.toString().trim(),
    };

    const parsedUser = editProfileSchema.safeParse(userForm);

    if (!parsedUser.success) {
      showToast({
        ok: false,
        status: 'error',
        message: t(zodErrorMessage(parsedUser.error)),
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await editAccount(formData);
      showToast({
        ...res,
        message: res.message ? t(res.message) : undefined,
      });
      if (res.ok) router.replace(`/settings`);
    } catch (err) {
      console.error(err);
      showToast({
        ok: false,
        status: 'error',
        message: t('toasts.errorGeneric'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handeResetPassword = async () => {
    try {
      const res = await sendResetPasswordMail(user.email, locale, true);
      showToast({
        ...res,
        message: res.message ? t(res.message) : undefined,
      });
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
    <form className="edit-account" onSubmit={handleSubmitForm}>
      <h3>{t('settings.editAccount.title')}</h3>
      <p className="notice">{t('common.requiredFieldsNotice')}</p>
      <div className="full-name">
        <input
          type="text"
          name="userFirstName"
          placeholder={t('auth.register.firstNamePlaceholder') + ' *'}
          defaultValue={user.firstName}
        />
        <input
          type="text"
          name="userLastName"
          placeholder={t('auth.register.lastNamePlaceholder') + ' *'}
          defaultValue={user.lastName}
        />
      </div>
      <div className="email">
        <p>{t('auth.emailLabel')}</p>
        <input
          type="text"
          className="disabled"
          placeholder={t('auth.emailPlaceholder')}
          defaultValue={user.email}
        />
      </div>
      <div className="password">
        <p>{t('auth.passwordLabel')}</p>
        <input
          type="text"
          className="disabled"
          placeholder={t('auth.passwordPlaceholder')}
          defaultValue="********"
        />
      </div>
      <div className="phone-number">
        <p>{t('settings.editAccount.phoneLabel')}</p>
        <input
          type="text"
          name="userPhoneNumber"
          placeholder={t('auth.register.phonePlaceholder') + ' *'}
          defaultValue={user.phoneNumber}
        />
      </div>
      <div className="creds-info">
        <p className="notice">{t('settings.editAccount.noticeCredentials')}</p>
        <button type="button" className="little-button" onClick={handeResetPassword}>
          {t('settings.editAccount.changePasswordButton')}
        </button>
      </div>
      <button type="submit" className="little-button" aria-busy={isLoading} disabled={isLoading}>
        {isLoading ? t('common.loading') : t('common.submit')}
      </button>
    </form>
  );
};
