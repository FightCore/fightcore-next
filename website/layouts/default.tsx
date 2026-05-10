'use client';
import { GlobalSearch } from '@/components/global-search/global-search';
import { GlobalSearchProvider } from '@/components/global-search/global-search-context';
import { NavBar } from '@/layouts/nav-bar';
import { SideNav } from '@/layouts/side-nav';
import { Head } from './head';
import { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';

export default function DefaultLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <GlobalSearchProvider>
      <div className="relative flex min-h-screen flex-col bg-background">
        <Head />
        <GlobalSearch showTrigger={false} />
        <div className="fixed z-50 h-16 w-full border-b border-border bg-surface">
          <NavBar />
        </div>
        <aside
          className={`fixed top-16 hidden h-[calc(100vh-4rem)] border-r border-border bg-surface transition-all duration-200 md:block ${isCollapsed ? 'w-14' : 'w-56'}`}
        >
          <SideNav isCollapsed={isCollapsed} />
        </aside>
        {/* Toggle handle — fixed to the right edge of the sidebar, vertically centered */}
        <button
          onClick={() => setIsCollapsed((c) => !c)}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={`fixed top-1/2 z-40 hidden -translate-y-1/2 items-center justify-center rounded-r border border-l-0 border-border bg-surface py-4 px-0.5 text-foreground/40 transition-all duration-200 hover:text-foreground md:flex ${isCollapsed ? 'left-14' : 'left-56'}`}
        >
          {isCollapsed ? <FaChevronRight size={10} /> : <FaChevronLeft size={10} />}
        </button>
        <div className={`z-0 px-3 pt-16 transition-all duration-200 ${isCollapsed ? 'md:ml-14' : 'md:ml-56'}`}>
          <main className="container mx-auto max-w-7xl flex-grow px-6 pt-4">{children}</main>
        </div>
        <footer className="flex w-full items-center justify-center py-3"></footer>
      </div>
    </GlobalSearchProvider>
  );
}
