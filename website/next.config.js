const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  compress: true,
  reactStrictMode: true,
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  env: {
    IS_BETA: process.env.IS_BETA,
    DO_TRACKING: process.env.DO_TRACKING,
  },
  productionBrowserSourceMaps: true,
};

module.exports = withBundleAnalyzer(nextConfig);
