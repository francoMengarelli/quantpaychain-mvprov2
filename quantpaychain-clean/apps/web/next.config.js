/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  // Disable SSR to avoid indexedDB errors during build
  output: 'export',
  distDir: '.next',
  images: {
    unoptimized: true, // Required for static export
    domains: ['via.placeholder.com', 'avatars.githubusercontent.com'],
  },
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
