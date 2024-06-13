import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { fontSans, fontMono } from "@/config/fonts";
import { useRouter } from "next/router";
import { StrictMode } from "react";
import DefaultLayout from "../layouts/default";
import { NextUIProvider } from "@nextui-org/system";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <StrictMode>
      <NextUIProvider navigate={router.push}>
        <NextThemesProvider attribute="class" defaultTheme="dark">
          <DefaultLayout>
            <Component {...pageProps} />
          </DefaultLayout>
        </NextThemesProvider>
      </NextUIProvider>
    </StrictMode>
  );
}

export const fonts = {
  sans: fontSans.style.fontFamily,
  mono: fontMono.style.fontFamily,
};
