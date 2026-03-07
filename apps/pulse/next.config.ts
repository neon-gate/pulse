import type { NextConfig } from 'next'
import path from 'node:path'

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      '@lib': path.resolve(__dirname, 'lib'),
      '@styles': path.resolve(__dirname, 'styles')
    }
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@lib': path.resolve(__dirname, 'lib'),
      '@styles': path.resolve(__dirname, 'styles')
    }

    return config
  }
}

export default nextConfig
