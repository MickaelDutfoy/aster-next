import '@/styles/public-page.scss';

import { DeniedPage } from '@/components/main/DeniedPage';
import { PublicPageBody } from '@/components/public-page/PublicPageBody';
import { AsterEmbedHeightReporter } from '@/components/tools/AsterEmbedHeightReporter';
import { ForcedTheme } from '@/components/tools/ForcedTheme';
import { getPublicPageBySlug } from '@/lib/publish/getPublicPageBySlug';

const PublicEmbedPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ theme?: string; appearance?: string }>;
}) => {
  const { slug } = await params;
  const { theme, appearance } = await searchParams;
  const isSeamless = appearance === 'seamless';

  const publicPage = await getPublicPageBySlug(slug);

  if (!publicPage || !publicPage.isEmbeddable) {
    return <DeniedPage cause="error" />;
  }

  return (
    <div data-aster-embed-appearance={isSeamless ? 'seamless' : undefined}>
      <ForcedTheme theme={theme} />
      <AsterEmbedHeightReporter slug={slug} />
      <PublicPageBody
        title={publicPage.organization.name}
        description={publicPage.organization.description ?? ''}
        animals={publicPage.organization.animals}
        animalFooter={publicPage.publicAnimalSheetFooter ?? ''}
        displayHealthInfo={publicPage.displayHealthInfo}
        displayLocations={publicPage.displayLocations}
        displaySpecies={publicPage.displaySpecies}
        email={publicPage.organization.email ?? ''}
        phoneNumber={publicPage.organization.phoneNumber ?? ''}
        embed={true}
      />
    </div>
  );
};

export default PublicEmbedPage;
