import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production'

const nextConfig: NextConfig = {
  ...(isProd && { output: 'export' as const }),
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  experimental: {
    // Keep all pages static-export friendly
  },
  ...(process.env.NODE_ENV === 'development' && {
    allowedDevOrigins: ['172.20.10.9', '192.168.*', '10.*', '127.0.0.1', 'localhost']
  })
}

export default nextConfig;
