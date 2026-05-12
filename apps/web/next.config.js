const withNextIntl = require('next-intl/plugin').default

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL?.trim(),
    AUTH_URL: process.env.AUTH_URL?.trim(),
  },
  async redirects() {
    return [
      {
        source: '/api',
        destination: '/',
        permanent: false,
      },
    ]
  },
}

module.exports = withNextIntl(nextConfig)
