/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable image optimization if causing issues
  images: {
    unoptimized: true,
  },
  // Suppress punycode deprecation warning
  webpack: (config) => {
    config.ignoreWarnings = [
      { module: /node_modules\/punycode/ },
    ];
    return config;
  },
};

module.exports = nextConfig;