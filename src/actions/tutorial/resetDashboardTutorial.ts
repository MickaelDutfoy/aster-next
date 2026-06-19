'use server';

import { cookies } from 'next/headers';

export const resetDashboardTutorial = async () => {
  const cookieStore = await cookies();

  cookieStore.delete('dashboard_tutorial_seen');
};
