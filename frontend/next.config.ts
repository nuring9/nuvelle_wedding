import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    TZ: "Asia/Seoul",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.amazonaws.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
};

export default nextConfig;
