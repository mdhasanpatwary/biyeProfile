import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://widget.cloudinary.com https://upload-widget.cloudinary.com https://res.cloudinary.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://res.cloudinary.com https://ui-avatars.com; connect-src 'self' https://api.cloudinary.com https://res.cloudinary.com https://upload-widget.cloudinary.com https://widget.cloudinary.com; frame-src 'self' https://widget.cloudinary.com https://upload-widget.cloudinary.com; font-src 'self' data:; object-src 'none'; base-uri 'self'; frame-ancestors 'self';",
          },
        ],
      },
    ]
  },
};

export default nextConfig;
