import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.AUTH_URL!;
  const lastModified = new Date().toISOString().split('T')[0];

  const languages = {
    fr: `${baseUrl}/fr/discover`,
    en: `${baseUrl}/en/discover`,
    nb: `${baseUrl}/nb/discover`,
  };

  return [
    {
      url: languages.fr,
      lastModified,
      changeFrequency: 'monthly',
      priority: 1,
      alternates: {
        languages,
      },
    },
    {
      url: languages.en,
      lastModified,
      changeFrequency: 'monthly',
      priority: 1,
      alternates: {
        languages,
      },
    },
    {
      url: languages.nb,
      lastModified,
      changeFrequency: 'monthly',
      priority: 1,
      alternates: {
        languages,
      },
    },
  ];
}