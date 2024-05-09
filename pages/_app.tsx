import '@/styles/globals.css';
import type { AppProps } from 'next/app';

// Import form system rather than react as a temp fix
// https://github.com/nextui-org/nextui/issues/2930
// TODO update on new release
import { NextUIProvider } from '@nextui-org/system';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { fontSans, fontMono } from '@/config/fonts';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <NextUIProvider navigate={router.push}>
      <NextThemesProvider>
        <Component {...pageProps} />
      </NextThemesProvider>
    </NextUIProvider>
  );
}

export const fonts = {
  sans: fontSans.style.fontFamily,
  mono: fontMono.style.fontFamily,
};
