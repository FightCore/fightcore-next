"use client";
import { NavBar } from "@/layouts/nav-bar";
import { SideNav } from "@/layouts/side-nav";
import { Head } from "./head";

export default function DefaultLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex flex-col h-screen bg-gray-100 dark:bg-gray-950">
      {/* The NavBar that can only be seen on smaller displays*/}
      <div
        className="block md:hidden fixed h-16 w-full z-50 bg-white
        border-b border-gray-200 dark:bg-gray-900 dark:border-gray-700"
      >
        <Head />
        <NavBar />
      </div>
      {/* The SideNav that only can be seen on bigger displays  */}
      <aside
        className="hidden md:block fixed top-09 w-64 h-screen bg-white border-r border-gray-200
        sm:translate-x-0 dark:bg-gray-900 dark:border-gray-700"
      >
        <SideNav />
      </aside>
      <div className="px-3 md:mt-0 md:ml-64 z-0">
        <main
          className="container mx-auto max-w-7xl pt-16 md:pt-0 px-6 flex-grow bg-white border-r
          border-gray-200 sm:translate-x-0 dark:bg-gray-900 dark:border-gray-700"
        >
          <div className="mb-3 text-white bg-red-700 rounded-b-lg p-2">
            <h2 className="text-xl font-bold">Warning</h2>
            <p>
              The beta website hitboxes are currently undergoing massive changes. Data will be incorrect. Please refer
              to the regular website for the accurate data.
            </p>
          </div>
          {children}
        </main>
      </div>
      <footer className="w-full flex items-center justify-center py-3"></footer>
    </div>
  );
}
