/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
  experimental: {
    staticGenerationMinPagesPerWorker: 25,
  },
}

export default nextConfig
