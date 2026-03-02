'use server';

import { sendEmail } from '@/lib/email';
import { isUser } from '@/lib/permissions/isUser';
import { ActionValidation } from '@/lib/types';

export const sendContactForm = async (formData: FormData): Promise<ActionValidation> => {
  const guard = await isUser();
  if (!guard.validation.ok) return guard.validation;
  if (!guard.user) {
    return { ok: false, status: 'error', message: 'toasts.errorGeneric' };
  }

  const user = guard.user;

  const escapeHtml = (input: string) =>
    input
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');

  const contactTopic = formData.get('contactTopic')?.toString().trim();
  const contactContent = formData.get('contactContent')?.toString().trim() ?? '';
  const normalizedContent = escapeHtml(contactContent).replaceAll('\n', '<br>');

  if (!contactTopic || !normalizedContent)
    return { ok: false, status: 'error', message: 'toasts.requiredFieldsMissing' };

  try {
    await sendEmail({
      to: 'm.dutfoy@gmail.com',
      subject: `Contact Aster : ${contactTopic}`,
      html: `<p><strong>De :</strong> ${user.email}</p><p><strong>Contenu :</strong><br><br>${normalizedContent}</p>`,
    });

    return {
      ok: true,
      status: 'success',
      message: 'contact.success',
    };
  } catch (err) {
    console.error(err);
    return {
      ok: false,
      status: 'error',
      message: 'toasts.errorGeneric',
    };
  }
};
