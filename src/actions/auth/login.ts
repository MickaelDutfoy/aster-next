'use server';

import { signIn } from '@/auth';

export const login = async (formdata: FormData): Promise<{ ok: boolean; message?: string }> => {
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

    return { ok: true };
  } catch (err) {
    console.error(err);
    return { ok: false, message: 'Identifiants invalides.' };
  }
};
