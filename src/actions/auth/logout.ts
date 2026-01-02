'use server';

import { signOut } from '@/auth';
import { ActionValidation } from '@/lib/types';

export const logout = async (): Promise<ActionValidation> => {
  try {
    await signOut({ redirect: false });

    return { ok: true, message: 'auth.logout.success' };
  } catch (err) {
    console.error(err);
    return { ok: false, status: 'error', message: 'toasts.errorGeneric' };
  }
};
