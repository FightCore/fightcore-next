import React from "react";
import NextHead from "next/head";
import Script from "next/script";

export const Head = () => {
  return (
    <>
      <NextHead>
        <meta
          key="viewport"
          content="viewport-fit=cover, width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=1"
          name="viewport"
        />
        <meta name="twitter:site" content="@Fightcoregg" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="FightCore" />
        <meta property="og:locale" content="en_US" />
        <link href="/favicon.ico" rel="icon" />
      </NextHead>
      {process.env.DO_TRACKING ? (
        <Script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="aa894a1c-5553-438e-986e-bd9bf0e67afd"
        ></Script>
      ) : (
        <NextHead>
          <meta name="debug:tracking" content="no-tracking" />
        </NextHead>
      )}
    </>
  );
};
