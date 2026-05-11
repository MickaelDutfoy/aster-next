import { DeniedPage } from '@/components/main/DeniedPage';
import { Settings } from '@/components/settings/Settings';
import { Member } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';

const SettingsPage = async () => {
  const user: Member | null = await getUser();
  if (!user) return <DeniedPage cause="error" />;

  return <Settings userId={user.id} />;
};

export default SettingsPage;
