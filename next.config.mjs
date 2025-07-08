/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
    dirs: [], // Don't lint any directories during build
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Enable static export for Electron
  output: 'export',
  trailingSlash: true,
  distDir: 'out',
  experimental: {
    swcPlugins: [
      ['@swc/plugin-transform-imports', {}]
    ],
    // Enable ES modules support
    esmExternals: true,
  },
  // Force Next.js to use Babel instead of SWC for WatermelonDB decorators
  swcMinify: false,
  compiler: {
    // This tells Next.js to use Babel
  },
  // Handle ES modules properly
  transpilePackages: ['canvas-confetti'],
  webpack: (config) => {
    // Handle ES modules
    config.resolve.extensionAlias = {
      '.js': ['.js', '.ts', '.tsx'],
      '.mjs': ['.mjs', '.js'],
    }
    return config
  },
}

export default nextConfig
