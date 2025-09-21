import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Cloud Run
  output: "standalone",
  
  // Optimize for production
  compress: true,
  
  // Enable experimental features for better performance
  experimental: {
    optimizeCss: true,
  },
  
  // Image optimization
  images: {
    unoptimized: false,
    domains: [],
  },
  
  // Headers for PWA and security
  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
        ],
      },
      {
        source: "/manifest.json",
        headers: [
          {
            key: "Content-Type",
            value: "application/manifest+json",
          },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
  
  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
};

export default nextConfig;
