'use server';

import { signIn } from '@/auth';

export const login = async (formdata: FormData) => {
  'use server';

  const user = {
    email: formdata.get('userEmail')?.toString(),
    password: formdata.get('userPassword')?.toString(),
  };

  try {
    await signIn('credentials', {
      redirectTo: '/',
      email: user.email,
      password: user.password,
    });

    console.log('Vous êtes connecté !', 'success');
  } catch (error) {
    console.log('Identifiants invalides !', 'error');
  }
};
