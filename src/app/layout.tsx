import ToastProvider from '@/components/providers/ToastProvider';
import '@/styles/_global.scss';
import type { Metadata, Viewport } from 'next';
import { Comfortaa, Nunito } from 'next/font/google';

export const nunito = Nunito({
  subsets: ['latin', 'latin-ext'],
  style: ['normal', 'italic'],
  weight: ['400', '700'],
  variable: '--font-nunito',
});

export const comfortaa = Comfortaa({
  subsets: ['latin', 'latin-ext'],
  style: ['normal'],
  weight: ['400', '700'],
  variable: '--font-comfortaa',
});

export const metadata: Metadata = {
  applicationName: 'Aster',
  title: 'Aster',
  appleWebApp: { capable: true, statusBarStyle: 'default' },
  description: 'A webapp to manage your animal welfare organizations',
};

export const viewport: Viewport = {
  themeColor: '#0ea5e9',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${nunito.variable} ${comfortaa.variable}`}>
      <body>
        <ToastProvider />
        {children}
      </body>
    </html>
  );
}
