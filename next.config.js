/** @type {import('next').NextConfig} */
const nextConfig = {
  // Basic Next.js configuration for PWA
  webpack: (config, { isServer }) => {
    // Ignore fs module in browser (for any future Node.js dependencies)
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
    };

    // WatermelonDB configuration
    if (!isServer) {
      // Exclude WatermelonDB native modules from browser bundle
      config.externals = config.externals || [];
      config.externals.push({
        'react-native-sqlite-storage': 'react-native-sqlite-storage',
        'better-sqlite3': 'better-sqlite3',
      });
    }

    return config;
  },

  // Enable experimental features for WatermelonDB
  experimental: {
    esmExternals: 'loose',
  },
};

module.exports = nextConfig;
