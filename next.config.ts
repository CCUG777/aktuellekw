import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/tage-berechnen",
        destination: "/tagerechner",
        permanent: true, // 301 redirect
      },
    ];
  },
};

export default nextConfig;
