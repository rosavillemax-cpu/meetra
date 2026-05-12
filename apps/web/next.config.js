import withNextIntl from 'next-intl/plugin'

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

export default withNextIntl(nextConfig)
