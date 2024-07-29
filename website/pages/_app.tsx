import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { fontSans, fontMono } from "@/config/fonts";
import { StrictMode } from "react";
import DefaultLayout from "../layouts/default";
import { NextUIProvider } from "@nextui-org/system";

export default function App({ Component, pageProps }: AppProps) {
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
