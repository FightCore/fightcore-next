'use client';
import { NavBar } from '@/layouts/nav-bar';
import { SideNav } from '@/layouts/side-nav';
import { Head } from './head';

export default function DefaultLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex h-screen flex-col bg-gray-100 dark:bg-gray-950">
      {/* The NavBar that can only be seen on smaller displays*/}
      <div className="fixed z-50 block h-16 w-full border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 md:hidden">
        <Head />
        <NavBar />
      </div>
      {/* The SideNav that only can be seen on bigger displays  */}
      <aside className="top-09 fixed hidden h-screen w-64 border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 sm:translate-x-0 md:block">
        <SideNav />
      </aside>
      <div className="z-0 px-3 md:ml-64 md:mt-0">
        <main className="container mx-auto max-w-7xl flex-grow px-6 pt-16 sm:translate-x-0 md:pt-0">{children}</main>
      </div>
      <footer className="flex w-full items-center justify-center py-3"></footer>
    </div>
  );
}
