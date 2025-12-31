import ClientLayout from '@/components/tools/ClientLayout';
import ToastProvider from '@/components/tools/ToastProvider';
import { routing } from '@/i18n/routing';
import '@/styles/_global.scss';
import type { Metadata, Viewport } from 'next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { Comfortaa, Nunito } from 'next/font/google';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';

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
  description: 'A mobile app for your animal welfare organizations',
};

export const viewport: Viewport = {
  themeColor: '#FAF6F5',
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html suppressHydrationWarning className={`${nunito.variable} ${comfortaa.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
                    (function () {
                      try {
                        var t = localStorage.getItem('theme'); // 'light' | 'dark' | 'system' | null
                        if (t === 'light' || t === 'dark') document.documentElement.dataset.theme = t;
                        else document.documentElement.removeAttribute('data-theme');
                      } catch (e) {}
                    })();`,
          }}
        />
      </head>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ClientLayout>
            <ToastProvider />
            {children}
          </ClientLayout>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
