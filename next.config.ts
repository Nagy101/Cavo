import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
    deviceSizes: [640, 750, 828, 1080, 1200, 1600, 1920],
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  async headers() {
    return [
      {
        source: "/media/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
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
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/en",
        permanent: false,
      },
      {
        source: "/yacht",
        destination: "/en/experiences/private-yacht",
        permanent: true,
      },
      {
        source: "/visit",
        destination: "/en/contact",
        permanent: true,
      },
      {
        source: "/:locale(en|ar)/visit",
        destination: "/:locale/contact",
        permanent: true,
      },
      {
        source: "/experiences",
        destination: "/en/experiences",
        permanent: false,
      },
      {
        source: "/experiences/:slug",
        destination: "/en/experiences/:slug",
        permanent: false,
      },
      {
        source: "/menu",
        destination: "/en/menu",
        permanent: false,
      },
      {
        source: "/book",
        destination: "/en/book",
        permanent: false,
      },
      {
        source: "/private-events",
        destination: "/en/private-events",
        permanent: false,
      },
      {
        source: "/gallery",
        destination: "/en/gallery",
        permanent: false,
      },
      {
        source: "/contact",
        destination: "/en/contact",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/api/bookings",
        destination: "/api/concierge?kind=booking",
      },
      {
        source: "/api/events",
        destination: "/api/concierge?kind=event",
      },
    ];
  },
};

export default nextConfig;
