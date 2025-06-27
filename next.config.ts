/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/strands-game',
  assetPrefix: '/strands-game',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
}

module.exports = nextConfig
