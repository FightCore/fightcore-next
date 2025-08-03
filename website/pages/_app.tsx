import { fontMono, fontSans } from '@/config/fonts';
import '@/styles/globals.scss';
import { Button } from '@heroui/button';
import { HeroUIProvider } from '@heroui/system';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import DefaultLayout from '../layouts/default';

export default function App({ Component, pageProps }: AppProps) {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 900);
    };

    window.addEventListener('scroll', handleScroll);
  }, []);
  return (
    <HeroUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="dark">
        {showBackToTop ? (
          <div className="fixed right-0 bottom-0 z-10 mr-6 mb-6 hidden md:block">
            <Button
              size="sm"
              onPress={() => {
                document.getElementById('top')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              ↑ Back to Top
            </Button>
          </div>
        ) : (
          <></>
        )}
        <DefaultLayout>
          <Component {...pageProps} />
        </DefaultLayout>
      </NextThemesProvider>
    </HeroUIProvider>
  );
}

export const fonts = {
  sans: fontSans.style.fontFamily,
  mono: fontMono.style.fontFamily,
};
