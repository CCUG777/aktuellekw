import type { NextConfig } from "next";

const securityHeaders = [
  // Verhindert MIME-Type Sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Verhindert Einbettung per iframe (Clickjacking-Schutz)
  { key: "X-Frame-Options", value: "DENY" },
  // Kontrolliert Referrer-Informationen bei Navigation
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Deaktiviert Browser-Features, die die Site nicht benötigt
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  // Erzwingt HTTPS für 1 Jahr (inkl. Subdomains)
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
  // Content Security Policy
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'", // Next.js benötigt inline scripts (Theme-Init)
      "style-src 'self' 'unsafe-inline'",  // Tailwind inline styles
      "font-src 'self' data:",             // next/font self-hosted
      "img-src 'self' data: blob:",        // OG-Images und Icons
      "connect-src 'self'",
      "frame-ancestors 'none'",            // Kein Einbetten erlaubt
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false, // Entfernt X-Powered-By: Next.js Header

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },

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
      {
        source: "/arbeitstage-rechner",
        destination: "/arbeitstage-berechnen",
        permanent: true, // 301 redirect
      },
    ];
  },
};

export default nextConfig;
