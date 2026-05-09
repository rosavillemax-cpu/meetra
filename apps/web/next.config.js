/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    // Trim newlines that Vercel sometimes appends to env values
    AUTH_URL: process.env.AUTH_URL?.trim(),
  },
};

export default nextConfig;
