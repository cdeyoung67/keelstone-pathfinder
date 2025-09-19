/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Disable ESLint during builds for deployment
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignore TypeScript errors during builds for deployment
    ignoreBuildErrors: true,
  },
  
  // Configuration for Azure Static Web Apps
  output: 'export',
  distDir: 'build',
  trailingSlash: true,
  images: {
    unoptimized: true, // Static export doesn't support image optimization
  },
}

module.exports = nextConfig
