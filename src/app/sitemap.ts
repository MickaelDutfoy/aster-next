import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.AUTH_URL;

  const locales = ['fr', 'en', 'no'];

  return locales.map((locale) => ({
    url: `${baseUrl}/${locale}/discover`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: 'monthly',
    priority: 1.0,
  }));
}
