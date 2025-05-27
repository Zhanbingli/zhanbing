import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // 禁用服务端功能以支持静态导出
  experimental: {
    // 确保所有页面都是静态生成的
  },
  // 开发环境允许的跨域来源（消除警告）
  ...(process.env.NODE_ENV === 'development' && {
    allowedDevOrigins: ['172.20.10.9', '192.168.*', '10.*', '127.0.0.1', 'localhost']
  })
};

export default nextConfig;
