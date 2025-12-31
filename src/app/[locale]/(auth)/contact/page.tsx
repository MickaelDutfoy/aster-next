import { ContactForm } from '@/components/ContactForm';
import { DeniedPage } from '@/components/main/DeniedPage';
import { Member } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';

const Contact = async () => {
  const user: Member | null = await getUser();
  if (!user) return <DeniedPage cause="error" />;

  return <ContactForm user={user} />;
};

export default Contact;
