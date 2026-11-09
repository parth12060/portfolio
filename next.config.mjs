/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Keep production audits separate from the running development server.
  distDir: process.env.NEXT_DIST_DIR || ".next",
};
export default nextConfig;
