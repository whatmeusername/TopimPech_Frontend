/** @type {import('next').NextConfig} */

const path = require('path');

const PROXY_URL = 'http://172.20.10.3:8000/';

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  webpack(config) {
    config.module.rules.forEach((rule) => {
      const { oneOf } = rule;
      if (oneOf) {
        oneOf.forEach((one) => {
          if (!`${one.issuer?.and}`.includes('_app')) return;
          one.issuer.and = [path.resolve(__dirname)];
        });
      }
    })
    config.module.rules.push({
      test: /\.svg$/i,
      use: ['@svgr/webpack'],
    })
    return config
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: PROXY_URL + ':path*' // Proxy to Backend
      }
    ]
  }
}

module.exports = nextConfig, PROXY_URL
