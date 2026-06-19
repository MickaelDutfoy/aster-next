import Discover from '@/components/Discover';
import { getAsterOpenGraph } from '@/lib/metadata';
import { Language } from '@/lib/types';
import '@/styles/discover.scss';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Language }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  const title = t('discover.meta.title');
  const description = t('discover.meta.description');
  const path = `/${locale}/discover`;

  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: getAsterOpenGraph({
      title,
      description,
      path,
    }),
  };
}

const DiscoverPage = async ({ params }: { params: Promise<{ locale: Language }> }) => {
  const { locale } = await params;

  return <Discover locale={locale} />;
};

export default DiscoverPage;