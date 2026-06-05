import { DeniedPage } from '@/components/main/DeniedPage';
import { getPublicPageBySlug } from '@/lib/publish/getPublicPageBySlug';

const PublicPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;

  const publicPage = await getPublicPageBySlug(slug);

  if (!publicPage || !publicPage.isPublished) {
    return <DeniedPage cause="error" />;
  }

  return (
    <main>
      <h1>{publicPage.organization.name}</h1>
      <p>{publicPage.organization.description}</p>
    </main>
  );
};

export default PublicPage;
