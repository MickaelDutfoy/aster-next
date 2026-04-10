import Discover from '@/components/Discover';
import { Language } from '@/lib/types';
import '@/styles/discover.scss';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

type PageProps = {
  params: Promise<{ locale: Language }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  return {
    title: t('discover.meta.title'),
    description: t('discover.meta.description'),
    alternates: {
      canonical: `/${locale}/discover`,
    },
    openGraph: {
      title: t('discover.meta.title'),
      description: t('discover.meta.description'),
      url: `/${locale}/discover`,
      siteName: 'Aster',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('discover.meta.title'),
      description: t('discover.meta.description'),
    },
  };
}

const DiscoverPage = async ({ params }: PageProps) => {
  const { locale } = await params;

  return <Discover locale={locale} />;
};

export default DiscoverPage;