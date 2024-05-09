/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  compress: true,
  experimental: {
    largePageDataBytes: 100 * 100000,
  },
};

module.exports = nextConfig;
