/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: ['via.placeholder.com', 'avatars.githubusercontent.com'],
  },
  // Force dynamic rendering to avoid indexedDB errors during build
  output: 'standalone',
  experimental: {
    esmExternals: 'loose',
  },
  webpack: (config, { isServer }) => {
    // Ignore optional peer dependencies and problematic modules
    config.externals.push({
      'porto/internal': 'commonjs porto/internal',
      'pino-pretty': 'pino-pretty',
    });
    
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }

    // Ignore specific wagmi connectors that cause issues
    config.resolve.alias = {
      ...config.resolve.alias,
      'porto/internal': false,
    };

    return config;
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
