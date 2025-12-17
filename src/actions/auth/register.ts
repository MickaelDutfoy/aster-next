'use server';

import { signIn } from '@/auth';
import { sendEmail } from '@/lib/email';
import { prisma } from '@/lib/prisma';
import { registerSchema } from '@/lib/schemas/authSchemas';
import { ActionValidation } from '@/lib/types';
import { zodErrorMessage } from '@/lib/utils/zodErrorMessage';
import bcrypt from 'bcryptjs';
import { getTranslations } from 'next-intl/server';

export const register = async (formdata: FormData, locale: string): Promise<ActionValidation> => {
  const t = await getTranslations({ locale, namespace: 'emails' });

  const newUserForm = {
    firstName: formdata.get('userFirstName')?.toString().trim(),
    lastName: formdata.get('userLastName')?.toString().trim(),
    email: formdata.get('userEmail')?.toString().trim().toLowerCase(),
    phoneNumber: formdata.get('userPhoneNumber')?.toString().trim(),
    password: formdata.get('userPassword')?.toString(),
    passwordConfirm: formdata.get('userPasswordConfirm')?.toString(),
  };

  const parsedNewUser = registerSchema.safeParse(newUserForm);

  if (!parsedNewUser.success) {
    return {
      ok: false,
      status: 'error',
      message: zodErrorMessage(parsedNewUser.error),
    };
  }

  const newUser = parsedNewUser.data;

  const passwordHash = await bcrypt.hash(newUser.password, 12);

  try {
    await prisma.member.create({
      data: {
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        phoneNumber: newUser.phoneNumber,
        passwordHash: passwordHash,
      },
    });

    await signIn('credentials', {
      redirect: false,
      email: newUser.email,
      password: newUser.password,
    });

    await sendEmail({
      to: newUser.email,
      subject: t('register.subject'),
      html: `
        <p>${t('common.hello')}</p>
        <p>${t('register.accountCreated')}</p>
        <p>${t('register.p1')}</p>
        <p>${t('register.p2')}</p>
        <p>${t('register.p3')}</p>
        <p>${t('common.footer')}</p>
      `,
    });

    return { ok: true, status: 'success', message: 'auth.register.success' };
  } catch (err: any) {
    console.error(err);

    if (err.code === 'P2002') {
      return {
        ok: false,
        status: 'error',
        message: 'auth.register.alreadyExists',
      };
    }

    return {
      ok: false,
      status: 'error',
      message: 'toasts.errorGeneric',
    };
  }
};
