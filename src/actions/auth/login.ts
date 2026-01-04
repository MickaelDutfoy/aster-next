'use server';

import { signIn } from '@/auth';
import { ActionValidation } from '@/lib/types';
import { getAuthErrorCode } from '@/lib/utils/getAuthErrorCode';

export const login = async (formData: FormData): Promise<ActionValidation> => {
  const user = {
    email: formData.get('userEmail')?.toString().trim().toLowerCase(),
    password: formData.get('userPassword')?.toString(),
  };

  if (!user.email || !user.password) {
    return { ok: false, status: 'error', message: 'auth.login.invalid' };
  }

  try {
    await signIn('credentials', {
      redirect: false,
      email: user.email,
      password: user.password,
    });

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
