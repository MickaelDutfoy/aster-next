import type { Metadata } from 'next';

export const SITE_URL = 'https://aster-app.eu';

export const DEFAULT_METADATA = {
  title: 'Aster',
  description: 'An application for animal welfare organizations',
};

type AsterOpenGraphParams = {
  title: string;
  description: string;
  path: string;
};

export function getAsterOpenGraph({
  title,
  description,
  path,
}: AsterOpenGraphParams): Metadata['openGraph'] {
  return {
    title,
    description,
    url: new URL(path, SITE_URL).toString(),
    siteName: 'Aster',
    type: 'website',
    images: [
      {
        url: new URL('/opengraph-image.png', SITE_URL).toString(),
        width: 1200,
        height: 630,
        alt: 'Aster',
      },
    ],
  };
}
