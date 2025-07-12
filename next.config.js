/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  compress: true,
  poweredByHeader: false,
  swcMinify: true,
  // Force environment variables to be available
  env: {
    OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
  },
  
  // Enhanced image optimization
  images: {
    domains: ['ivcaccounting.co.uk'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ivcaccounting.co.uk',
        port: '',
        pathname: '/images/**',
      },
    ],
  },
  
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Enable ISR for better performance
  experimental: {
    optimizeCss: true,
    // Skip API routes during build to prevent Pinecone initialization errors
    outputFileTracingExcludes: {
      '/api/ai/*': ['@pinecone-database/pinecone', 'openai'],
    },
    // Add experimental flag for better env handling
    serverComponentsExternalPackages: ['@supabase/auth-helpers-nextjs'],
  },
  
  // Ensure env vars are loaded during build
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Log during build to verify
    if (isServer && !dev) {
      console.log('=== BUILD TIME ENV CHECK ===');
      console.log('OPENROUTER_API_KEY exists:', !!process.env.OPENROUTER_API_KEY);
      console.log('NODE_ENV:', process.env.NODE_ENV);
    }
    return config;
  },
  
  // Security and performance headers
  async headers() {
    return [
      {
        source: '/admin/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, must-revalidate',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ],
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          }
        ],
      },
    ]
  },
};

module.exports = nextConfig; 