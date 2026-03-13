import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
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
            // Added *.sentry.io and *.ingest.sentry.io for Sentry error reporting
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://widget.cloudinary.com https://upload-widget.cloudinary.com https://res.cloudinary.com https://va.vercel-scripts.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://res.cloudinary.com https://ui-avatars.com; connect-src 'self' https://api.cloudinary.com https://res.cloudinary.com https://upload-widget.cloudinary.com https://widget.cloudinary.com https://*.sentry.io https://*.ingest.sentry.io https://va.vercel-scripts.com https://vitals.vercel-insights.com; frame-src 'self' https://widget.cloudinary.com https://upload-widget.cloudinary.com; font-src 'self' data:; object-src 'none'; base-uri 'self'; frame-ancestors 'self';",
          },
        ],
      },
    ]
  },
};

export default withSentryConfig(nextConfig, {
  // Your Sentry org and project slugs (set via SENTRY_ORG and SENTRY_PROJECT env vars)
  // These are only needed for sourcemap uploads during `next build`
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,

  // Suppresses Sentry CLI output during builds
  silent: !process.env.CI,

  // Upload sourcemaps only in production builds
  sourcemaps: {
    disable: process.env.NODE_ENV !== "production",
  },

  // Tunnel Sentry requests through your own server to avoid ad-blocker interference
  // This adds a /monitoring/sentry-tunnel route automatically
  tunnelRoute: "/monitoring/sentry-tunnel",
});
