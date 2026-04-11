'use server';

import { signIn } from '@/auth';
import { getAuthErrorCode } from '@/lib/auth/getAuthErrorCode';
import { checkRateLimit } from '@/lib/auth/rateLimit';
import { prisma } from '@/lib/prisma';
import { ActionValidation } from '@/lib/types';
import { headers } from 'next/headers';

export const login = async (formData: FormData): Promise<ActionValidation> => {
  const user = {
    email: formData.get('userEmail')?.toString().trim().toLowerCase(),
    password: formData.get('userPassword')?.toString(),
  };

  if (!user.email || !user.password) {
    return { ok: false, status: 'error', message: 'auth.login.invalid' };
  }

  const requestHeaders = await headers();
  const ip = requestHeaders.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';

  const key = `login:${ip}`;

  const allowed = await checkRateLimit(key, 5, 10 * 60 * 1000); // 5 tentatives / 10 min

  if (!allowed) {
    return {
      ok: false,
      status: 'error',
      message: 'toasts.tooManyAttempts',
    };
  }

  try {
    await signIn('credentials', {
      redirect: false,
      email: user.email,
      password: user.password,
    });

    await prisma.rateLimit.deleteMany({ where: { key } });

    return { ok: true, status: 'success' };
  } catch (err: any) {
    console.error(err);

    const code = getAuthErrorCode(err);

    if (code === 'INVALID_CREDENTIALS') {
      return { ok: false, status: 'error', message: 'auth.login.invalid' };
    }

    return {
      ok: false,
      status: 'error',
      message: 'toasts.errorGeneric',
    };
  }
};
