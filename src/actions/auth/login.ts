'use server';

import { signIn } from '@/auth';
import { ActionValidation } from '@/lib/types';

export const login = async (prevstate: any, formdata: FormData): Promise<ActionValidation> => {
  const user = {
    email: formdata.get('userEmail')?.toString(),
    password: formdata.get('userPassword')?.toString(),
  };

  try {
    await signIn('credentials', {
      redirect: false,
      email: user.email,
      password: user.password,
    });

    return { ok: true, status: 'success' };
  } catch (err) {
    console.error(err);
    return { ok: false, status: 'error', message: 'Identifiants invalides.' };
  }
};
