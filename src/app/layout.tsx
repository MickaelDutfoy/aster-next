import type { Metadata } from "next";
import { Comfortaa, Nunito } from 'next/font/google';
import "./globals.scss";

export const comfortaa = Comfortaa({ subsets: ['latin'] });

export const nunito = Nunito({
    weight: ['400', '700'],
    subsets: ['latin'],
});

export const metadata: Metadata = {
  title: "Aster",
  description: "A webapp to manage your animal welfare organizations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${comfortaa.className} ${nunito.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}