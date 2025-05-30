const CompressionPlugin = require('compression-webpack-plugin');
const path = require('path');
const { withSentryConfig } = require('@sentry/nextjs');

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
    USE_SENTRY: process.env.USE_SENTRY
  },
  compiler: {
    reactRemoveProperties: true,
  },
  experimental: {
    optimizePackageImports: ['@heroui', '@sentry/browser', 'framer-motion', 'ka-table', 'd3']
  },
  productionBrowserSourceMaps: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
    quietDeps: true
  },
  /** @type {(config: import('webpack').Configuration, context: import('next/dist/server/config-shared').WebpackConfigContext) => import('webpack').Configuration} */
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.plugins.push(new CompressionPlugin());
    }
    return config;
  },
};

module.exports =  withSentryConfig(withBundleAnalyzer(nextConfig), {
    org: 'fightcore',
    project: 'fightcore-next',

    silent: !process.env.CI, // Can be used to suppress logs

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,

    tunnelRoute: "/monitoring",
  })
