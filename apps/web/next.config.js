/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    // Trim newlines that Vercel sometimes appends to env values
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
