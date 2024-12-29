const CompressionPlugin = require('compression-webpack-plugin');
const path = require('path')

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
/** @type {import('next-sitemap').IConfig} */
const nextConfig = {
  output: 'export',
  compress: true,
  reactStrictMode: true,
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  env: {
    IS_BETA: process.env.IS_BETA,
    DO_TRACKING: process.env.DO_TRACKING,
  },
  productionBrowserSourceMaps: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  /** @type {(config: import('webpack').Configuration, context: import('next/dist/server/config-shared').WebpackConfigContext) => import('webpack').Configuration} */
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.plugins.push(new CompressionPlugin());
    }
    return config;
  },
};

module.exports = withBundleAnalyzer(nextConfig);
