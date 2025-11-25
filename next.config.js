/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable image optimization if causing issues
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;