/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL?.trim(),
    AUTH_URL: process.env.AUTH_URL?.trim(),
  },
  async redirects() {
    return [
      // Prevent /api being caught by [handle] dynamic route
      {
        source: '/api',
        destination: '/',
        permanent: false,
      },
    ]
  },
};

export default nextConfig;
