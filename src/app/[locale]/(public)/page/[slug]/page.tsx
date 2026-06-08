import '@/styles/public-page.scss';

import { DeniedPage } from '@/components/main/DeniedPage';
import { PublicPageBody } from '@/components/public-page/PublicPageBody';
import { getPublicPageBySlug } from '@/lib/publish/getPublicPageBySlug';

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
