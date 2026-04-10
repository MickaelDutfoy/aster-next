import { Legal } from '@/components/auth/Legal';
import { Language } from '@/lib/types';
import '@/styles/privacy.scss';
import { Metadata } from 'next';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: true,
  },
};

const LegalPage = async ({ params }: { params: Promise<{ locale: Language }> }) => {
  const { locale } = await params;

  return <Legal locale={locale} />;
};

export default LegalPage;
