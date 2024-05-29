/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  compress: true,
  reactStrictMode: true,
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
};

module.exports = nextConfig;
