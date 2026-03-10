import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      new URL('https://i.scdn.co/image/**'),
      new URL('https://upload.wikimedia.org/wikipedia/**')
    ]
  }
}

export default nextConfig
