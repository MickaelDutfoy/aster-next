'use server';

import { signIn } from '@/auth';
import { ActionValidation } from '@/lib/types';

export const login = async (formData: FormData): Promise<ActionValidation> => {
  const user = {
    email: formData.get('userEmail')?.toString().trim(),
    password: formData.get('userPassword')?.toString(),
  };

  if (!user.email || !user.password) {
    return { ok: false, status: 'error', message: 'Identifiants invalides.' };
  }

  try {
    await signIn('credentials', {
      redirect: false,
      email: user.email,
      password: user.password,
    });

    return { ok: true, status: 'success' };
  } catch (err) {
    console.error(err);
    return { ok: false, status: 'error', message: 'Une erreur est survenue.' };
  }
};
