import { fontMono, fontSans } from '@/config/fonts';
import '@/styles/globals.scss';
import { NextUIProvider } from '@nextui-org/system';
import * as Sentry from '@sentry/browser';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import DefaultLayout from '../layouts/default';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    console.log('Initializing Sentry');
    Sentry.init({
      dsn: 'https://373aec30d96a935aec1a26d7980eabd5@o4507902200119296.ingest.de.sentry.io/4507902211194960',
      tunnel: 'https://sentry.fightcore.gg',

      // Set tracesSampleRate to 1.0 to capture 100%
      // of transactions for tracing.
      // We recommend adjusting this value in production
      tracesSampleRate: 1.0,

      // Capture Replay for 10% of all sessions,
      // plus for 100% of sessions with an error
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
    });
  }, []);
  useEffect(() => {
    console.log('Initializing Sentry');
    Sentry.init({
      dsn: 'https://373aec30d96a935aec1a26d7980eabd5@o4507902200119296.ingest.de.sentry.io/4507902211194960',
      tunnel: 'https://sentry.fightcore.gg',

      // Set tracesSampleRate to 1.0 to capture 100%
      // of transactions for tracing.
      // We recommend adjusting this value in production
      tracesSampleRate: 1.0,

      // Capture Replay for 10% of all sessions,
      // plus for 100% of sessions with an error
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
    });
  }, []);
  return (
    <NextUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="dark">
        <DefaultLayout>
          <Component {...pageProps} />
        </DefaultLayout>
      </NextThemesProvider>
    </NextUIProvider>
  );
}

export const fonts = {
  sans: fontSans.style.fontFamily,
  mono: fontMono.style.fontFamily,
};
