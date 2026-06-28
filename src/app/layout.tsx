import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';

import '../styles/index.css';
import { Toaster } from './components/ui/sonner';
import { Providers } from './components/Providers';
import { AppBottomNav } from './components/BottomNav';
import { CookieBanner } from './components/ui/CookieBanner';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: false,
});

export const metadata: Metadata = {
  title: {
    default: 'AKMLEVA',
    template: '%s | AKMLEVA',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
  },
};

const themeScript = `
  (function() {
    try {
      var theme = localStorage.getItem('theme-mode');
      if (!theme) {
        theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch(e) {}
  })();
`;

export default async function RootLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning className={inter.variable}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="bg-white dark:bg-gray-950 font-sans antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg focus:shadow-lg focus:outline-none"
        >
          Skip to main content
        </a>
        <Providers>
          <NextIntlClientProvider messages={messages}>
            <div id="main-content" className="pb-16 sm:pb-0">
              {children}
            </div>
            <AppBottomNav />
            <CookieBanner />
          </NextIntlClientProvider>
          <Toaster richColors closeButton />
        </Providers>
      </body>
    </html>
  );
}