'use server';

import { auth } from '@/auth';
import { redirect } from '@/i18n/routing';
import { getLocale } from 'next-intl/server';
import { cookies } from 'next/headers';

export const markIntroSeen = async () => {
  const session = await auth();
  const locale = await getLocale();

  const cookieStore = await cookies();
  cookieStore.set('intro_seen', '1', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
  });
  if (!session) {
    redirect({ href: '/login', locale });
  } else {
    redirect({ href: '/', locale });
  }
};
