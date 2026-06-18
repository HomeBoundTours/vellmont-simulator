import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: '/vellmont-simulator',
  assetPrefix: '/vellmont-simulator/',
};

export default nextConfig;
