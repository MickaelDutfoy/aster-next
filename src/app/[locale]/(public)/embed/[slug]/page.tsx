import '@/styles/public-page.scss';

import { DeniedPage } from '@/components/main/DeniedPage';
import { PublicPageBody } from '@/components/public-page/PublicPageBody';
import { ForcedTheme } from '@/components/tools/ForcedTheme';
import { getPublicPageBySlug } from '@/lib/publish/getPublicPageBySlug';

const PublicEmbedPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ theme?: string }>;
}) => {
  const { slug } = await params;
  const { theme } = await searchParams;

  const publicPage = await getPublicPageBySlug(slug);

  if (!publicPage || !publicPage.isPublished) {
    return <DeniedPage cause="error" />;
  }

  return (
    <>
      <ForcedTheme theme={theme} />
      <PublicPageBody
        title={publicPage.organization.name}
        description={publicPage.organization.description ?? ''}
        animals={publicPage.organization.animals}
        animalFooter={publicPage.publicAnimalSheetFooter ?? ''}
        displayHealthInfo={publicPage.displayHealthInfo}
        displayLocations={publicPage.displayLocations}
        email={publicPage.organization.email ?? ''}
        phoneNumber={publicPage.organization.phoneNumber ?? ''}
        embed={true}
      />
    </>
  );
};

export default PublicEmbedPage;
