import '@/styles/globals.css';
import { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { fontSans } from '@/config/fonts';
import { Providers } from './providers';
import { Navbar } from '@/components/layout/nav-bar';
import { Link } from '@nextui-org/react';
import clsx from 'clsx';
import { SideNav } from '@/components/layout/side-nav';

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head />
      <body
        className={clsx(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable
        )}
      >
        <Providers themeProps={{ attribute: 'class', defaultTheme: 'dark' }}>
          <div className='relative flex flex-col h-screen bg-gray-100 dark:bg-gray-950'>
            {/* The NavBar that can only be seen on smaller displays*/}
            <div className='block md:hidden fixed h-32 w-full z-50 bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-700'>
              <Navbar />
            </div>
            {/* The SideNav that only can be seen on bigger displays  */}
            <aside className='hidden md:block fixed top-09 w-64 h-screen bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-900 dark:border-gray-700'>
              <SideNav />
            </aside>
            <div className='px-3 mt-32 md:mt-0 md:ml-64 z-0'>
              <main className='container mx-auto max-w-7xl pt-16 px-6 flex-grow bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-900 dark:border-gray-700'>
                {children}
              </main>
            </div>
            <footer className='w-full flex items-center justify-center py-3'></footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
