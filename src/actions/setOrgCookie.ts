'use server';

import { cookies } from 'next/headers';

export const setOrgCookie = async (orgId: number) => {
  const cookieStore = await cookies();
  cookieStore.set('orgId', String(orgId), {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production', // clé : pas de Secure en dev
  });
};
