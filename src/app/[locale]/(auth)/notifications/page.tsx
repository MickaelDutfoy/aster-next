import { DeniedPage } from '@/components/main/DeniedPage';
import { NotificationCenter } from '@/components/main/NotificationCenter';
import { getUserNotifications } from '@/lib/notifications/getUserNotifications';
import { Member } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';
import '@/styles/notifications.scss';
import { Notification } from '@prisma/client';

const NotificationsPage = async () => {
  const user: Member | null = await getUser();
  if (!user) return <DeniedPage cause="error" />;

  const notifications: Notification[] = await getUserNotifications(user.id);

  return <NotificationCenter user={user} notifications={notifications} />;
};

export default NotificationsPage;
