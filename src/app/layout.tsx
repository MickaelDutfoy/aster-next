import ToastProvider from '@/components/ToastProvider';
import '@/styles/_global.scss';
import type { Metadata } from 'next';
import { Comfortaa, Nunito } from 'next/font/google';

export const nunito = Nunito({
  // app main font
  subsets: ['latin', 'latin-ext'],
  style: ['normal', 'italic'],
  weight: ['400', '700'],
  variable: '--font-nunito',
});

export const comfortaa = Comfortaa({
  // buttons, titles
  subsets: ['latin', 'latin-ext'],
  style: ['normal'],
  weight: ['400', '700'],
  variable: '--font-comfortaa',
});

export const metadata: Metadata = {
  title: 'Aster - Dev',
  description: 'A webapp to manage your animal welfare organizations',
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${nunito.variable} ${comfortaa.variable}`}>
      <body>
        <ToastProvider />
        {children}
        {modal}
      </body>
    </html>
  );
}
