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
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Optimize the client-side bundles
      config.optimization.splitChunks = {
        chunks: "all",
      };
    }
    return config;
  },
};

module.exports = withBundleAnalyzer(nextConfig);
