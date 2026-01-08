/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  output: 'standalone',
  images:{
    domains: ['encrypted-tbn0.gstatic.com'],
  }
};

export default nextConfig;
