import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/tage-berechnen",
        destination: "/tagerechner",
        permanent: true, // 301 redirect
      },
      {
        source: "/sommerzeit-2026",
        destination: "/sommerzeit",
        permanent: true, // 301 redirect
      },
      {
        source: "/winterzeit-2026",
        destination: "/winterzeit",
        permanent: true, // 301 redirect
      },
    ];
  },
};

export default nextConfig;
