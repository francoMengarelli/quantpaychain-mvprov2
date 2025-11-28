/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: ['via.placeholder.com', 'avatars.githubusercontent.com'],
  },
  experimental: {
    esmExternals: 'loose',
  },
  // Prevent indexedDB access during build by disabling problematic modules on server
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Prevent Supabase and Web3 from running during build
      config.externals.push({
        '@supabase/supabase-js': 'commonjs @supabase/supabase-js',
        '@rainbow-me/rainbowkit': 'commonjs @rainbow-me/rainbowkit',
        'wagmi': 'commonjs wagmi',
      });
    }
    return config;
  },
  webpack_old: (config, { isServer }) => {
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
