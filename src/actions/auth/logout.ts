'use server';

import { signOut } from '@/auth';
import { ActionValidation } from '@/lib/types';

export const logout = async (prevstate: any, formdata: FormData): Promise<ActionValidation> => {
  'use server';

  try {
    await signOut({ redirect: false });

    return { ok: true, message: 'Vous avez été déconnecté(e).' };
  } catch (err) {
    console.error(err);
    return { ok: false, status: 'error' };
  }
};
