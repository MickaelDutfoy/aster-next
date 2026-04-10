import { Privacy } from '@/components/auth/Privacy';
import { Language } from '@/lib/types';
import '@/styles/privacy.scss';
import { Metadata } from 'next';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: true,
  },
};

const PrivacyPage = async ({ params }: { params: Promise<{ locale: Language }> }) => {
  const { locale } = await params;

  return <Privacy locale={locale} />;
};

export default PrivacyPage;
