'use server';

import { sendEmail } from '@/lib/email';
import { ActionValidation } from '@/lib/types';

const escapeHtml = (s: string) =>
  s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');


export const sendContactForm = async (
  formData: FormData,
  userEmail: string,
): Promise<ActionValidation> => {
  const contactTopic = formData.get('contactTopic')?.toString().trim();
  const raw = formData.get('contactContent')?.toString().trim() ?? '';
  const contactContent = escapeHtml(raw).replaceAll('\n', '<br>');

  try {
    await sendEmail({
      to: 'm.dutfoy@gmail.com',
      subject: `Contact Aster :  ${contactTopic}`,
      html: `<p><strong>De :</strong> ${userEmail}</p><p><strong>Contenu :</strong><br><br> ${contactContent}</p>`,
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
