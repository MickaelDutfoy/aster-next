import { auth } from '@/auth';
import { ContactForm } from '@/components/main/ContactForm';
import { DeniedPage } from '@/components/main/DeniedPage';

const Contact = async () => {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) return <DeniedPage cause="error" />;

  return <ContactForm />;
};

export default Contact;
