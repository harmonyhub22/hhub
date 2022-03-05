/** @type {import('next').NextConfig} */

const defaultServerUrl = 'https://harmony-hub-backend.herokuapp.com/'
const defaultFallbackUrl = 'https://harmony-hub-backend.herokuapp.com/:path*';

const nextConfig = {
  reactStrictMode: true,
  env: {
    SERVER_URL: process.env.SERVER_URL || defaultServerUrl,
    SOCKET_URL: process.env.SOCKET_URL || defaultServerUrl,
  },
  /*
  async rewrites() {
    return {
      fallback: [
        // These rewrites are checked after both pages/public files
        // and dynamic routes are checked
        {
          source: '/:path*',
          basePath: false,
          destination: process.env.FALLBACK_URL || defaultFallbackUrl
        }
      ]
    };
  }
  */
}

module.exports = nextConfig
