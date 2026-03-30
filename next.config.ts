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
  trailingSlash: false,   // Verhindert doppelte URLs mit/ohne Trailing Slash
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
      // ── Phase 1.1: Synonym-Seiten → Zielseite (301) ──────────
      // Kalenderwochen-Synonyme → /kalenderwoche
      {
        source: "/kalender-mit-kalenderwochen",
        destination: "/kalenderwoche",
        permanent: true,
      },
      {
        source: "/kalenderwochen-uebersicht",
        destination: "/kalenderwoche",
        permanent: true,
      },
      {
        source: "/kalender-mit-wochen",
        destination: "/kalenderwoche",
        permanent: true,
      },
      {
        source: "/kalender-wochenuebersicht",
        destination: "/kalenderwoche",
        permanent: true,
      },
      // "Welche KW haben wir?" → Startseite (identische Frage)
      {
        source: "/welche-kalenderwoche-haben-wir",
        destination: "/",
        permanent: true,
      },
      // Woche/Jahr → Ratgeber-Seite
      {
        source: "/woche-jahr",
        destination: "/wie-viele-wochen-hat-ein-jahr",
        permanent: true,
      },
      // Sommerzeit/Winterzeit → Zeitumstellung (zusammenführen)
      {
        source: "/sommerzeit",
        destination: "/zeitumstellung/2026",
        permanent: true,
      },
      {
        source: "/winterzeit",
        destination: "/zeitumstellung/2026",
        permanent: true,
      },
      // ── Legacy-Redirects ──────────────────────────────────────
      {
        source: "/tage-berechnen",
        destination: "/tagerechner",
        permanent: true,
      },
      {
        source: "/sommerzeit-2026",
        destination: "/zeitumstellung/2026",
        permanent: true,
      },
      {
        source: "/winterzeit-2026",
        destination: "/zeitumstellung/2026",
        permanent: true,
      },
      {
        source: "/arbeitstage-rechner",
        destination: "/arbeitstage-berechnen",
        permanent: true,
      },
      {
        source: "/arbeitstage-2026",
        destination: "/arbeitstage/2026",
        permanent: true,
      },
      {
        source: "/zeitumstellung-2026",
        destination: "/zeitumstellung/2026",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
