import { ContactForm } from '@/components/main/ContactForm';
import { DeniedPage } from '@/components/main/DeniedPage';
import { Member } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';

const Contact = async () => {
  const user: Member | null = await getUser();
  if (!user) return <DeniedPage cause="error" />;

  return <ContactForm />;
};

export default Contact;
