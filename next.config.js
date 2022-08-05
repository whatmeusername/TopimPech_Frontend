
/** @type {import('next').NextConfig} */


const PROXY_URL = 'http://192.168.0.105:8000/'


const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  webpack(config) {
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

module.exports = nextConfig
