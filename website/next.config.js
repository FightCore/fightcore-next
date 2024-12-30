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

module.exports = process.env.USE_SENTRY
  ? withSentryConfig(withBundleAnalyzer(nextConfig), {
    org: 'fightcore',
    project: 'javascript-nextjs',

    // An auth token is required for uploading source maps.
    authToken: process.env.SENTRY_AUTH_TOKEN,

    tunnelRoute: '/monitoring-tunnel',

    silent: false, // Can be used to suppress logs
  })
  : withBundleAnalyzer(nextConfig);
