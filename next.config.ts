import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // Sanity CDN images (served through a custom loader in CmsImage).
    remotePatterns: [new URL("https://cdn.sanity.io/**")],
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // Keep the Studio from being embedded elsewhere (clickjacking).
      { source: "/studio/:path*", headers: [{ key: "X-Frame-Options", value: "DENY" }] },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
