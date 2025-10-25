import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Aster',
    short_name: 'Aster',
    description: 'A Mobile Web App for your animal welfare organizations',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/icons/aster-icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/aster-icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
