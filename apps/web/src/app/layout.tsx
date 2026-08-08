import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Archivo_Black, Space_Grotesk } from 'next/font/google';
import './globals.css';

const HTML_LANG = 'en';

const fontUi = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-ui',
  display: 'swap',
});

const fontDisplay = Archivo_Black({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: '5 Alive Card Game',
  description: 'Fast-paced 5 Alive card game console.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={HTML_LANG} className={`${fontUi.variable} ${fontDisplay.variable}`}>
      <body className="font-ui antialiased bg-slate-950 text-white">
        {children}
      </body>
    </html>
  );
}
