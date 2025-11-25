/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Optimize for WebContainer environments (Bolt.new, StackBlitz)
  webpack: (config, { isServer }) => {
    // Disable code splitting to prevent chunk loading issues
    if (!isServer) {
      config.optimization.splitChunks = false;
      config.optimization.runtimeChunk = false;
    }
    return config;
  },
  // Disable image optimization if causing issues
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;