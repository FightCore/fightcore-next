import { NavBar } from '@/components/layout/nav-bar';
import { SideNav } from '@/components/layout/side-nav';
import { siteConfig } from '@/config/site';
import { Metadata } from 'next';

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

export default function DefaultLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='relative flex flex-col h-screen bg-gray-100 dark:bg-gray-950'>
      {/* The NavBar that can only be seen on smaller displays*/}
      <div className='block md:hidden fixed h-16 w-full z-50 bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-700'>
        <NavBar />
      </div>
      {/* The SideNav that only can be seen on bigger displays  */}
      <aside className='hidden md:block fixed top-09 w-64 h-screen bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-900 dark:border-gray-700'>
        <SideNav />
      </aside>
      <div className='px-3 md:mt-0 md:ml-64 z-0'>
        <div className='container mx-auto max-w-7xl pt-16 md:pt-0 px-6 flex-grow bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-900 dark:border-gray-700'>
          {children}
        </div>
      </div>
      <footer className='w-full flex items-center justify-center py-3'></footer>
    </div>
  );
}
