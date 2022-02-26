/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    SERVER_URL: 'http://localhost:5000/api/',
  },
}

module.exports = nextConfig
