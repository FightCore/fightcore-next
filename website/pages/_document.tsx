import { Head, Html, Main, NextScript } from 'next/document';
import Script from 'next/script';

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="min-h-screen bg-background font-sans antialiased" suppressHydrationWarning>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
