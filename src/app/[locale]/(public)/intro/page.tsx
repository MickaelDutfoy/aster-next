import { Intro } from '@/components/Intro';
import { getAsterOpenGraph } from '@/lib/metadata';
import { Language } from '@/lib/types';
import '@/styles/intro.scss';
import { Metadata } from 'next';
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
  const path = `/${locale}/intro`;

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

const IntroPage = async () => {
  return <Intro />;
};

export default IntroPage;
