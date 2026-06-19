'use server';

import { cookies } from 'next/headers';

export const markDashboardTutorialSeen = async () => {
  const cookieStore = await cookies();

  cookieStore.set('dashboard_tutorial_seen', 'v1', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
  });
};
