import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Aster',
    short_name: 'Aster',
    description: 'A mobile app for your animal welfare organizations',
    start_url: '/',
    display: 'standalone',
    background_color: '#FAF6F5',
    theme_color: '#FAF6F5',
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
