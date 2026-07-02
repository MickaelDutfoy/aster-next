import '@/styles/public-page.scss';

import { DeniedPage } from '@/components/main/DeniedPage';
import { PublicPageBody } from '@/components/public-page/PublicPageBody';
import { getAsterOpenGraph } from '@/lib/metadata';
import { getOrgDetailsBySlug } from '@/lib/publish/getOrgDetailsBySlug';
import { getPublicPageBySlug } from '@/lib/publish/getPublicPageBySlug';
import { Language } from '@/lib/types';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Language; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale });

  const publicPage = await getOrgDetailsBySlug(slug);

  const title = publicPage?.organization.name ?? 'Aster';
  const description = publicPage?.organization.description ?? '';
  const path = `/${locale}/${slug}`;

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

const PublicPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;

  const publicPage = await getPublicPageBySlug(slug);

  if (!publicPage || !publicPage.isPublished) {
    return <DeniedPage cause="error" />;
  }

  return (
    <PublicPageBody
      title={publicPage.organization.name}
      description={publicPage.organization.description ?? ''}
      animals={publicPage.organization.animals}
      animalFooter={publicPage.publicAnimalSheetFooter ?? ''}
      displayHealthInfo={publicPage.displayHealthInfo}
      displayLocations={publicPage.displayLocations}
      email={publicPage.organization.email ?? ''}
      phoneNumber={publicPage.organization.phoneNumber ?? ''}
      embed={false}
    />
  );
};

export default PublicPage;
