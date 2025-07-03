/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['ivcaccounting.co.uk'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ivcaccounting.co.uk',
        port: '',
        pathname: '/images/**',
      },
    ],
  },
  // Ensure CSS modules work in production
  webpack: (config) => {
    config.module.rules.push({
      test: /\.css$/,
      use: ['style-loader', 'css-loader', 'postcss-loader'],
    });
    return config;
  },
};

module.exports = nextConfig; 