import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Standard-Crawlers: alles erlaubt
      {
        userAgent: "*",
        allow: "/",
      },
      // KI-Suchmaschinen explizit erlauben (für ChatGPT, Google SGE, Perplexity)
      {
        userAgent: "GPTBot",
        allow: "/",
      },
      {
        userAgent: "ChatGPT-User",
        allow: "/",
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
      },
      {
        userAgent: "Google-Extended",
        allow: "/",
      },
      {
        userAgent: "ClaudeBot",
        allow: "/",
      },
      {
        userAgent: "anthropic-ai",
        allow: "/",
      },
      // OAI-SearchBot: OpenAIs dedizierter Such-Crawler (verschieden von GPTBot)
      {
        userAgent: "OAI-SearchBot",
        allow: "/",
      },
    ],
    sitemap: "https://aktuellekw.de/sitemap.xml",
  };
}

/*
 * SEO Audit Checklist – app/robots.ts
 * ──────────────────────────────────────────────────────────────
 * [x] Alle Standard-Crawler: allow "/"
 * [x] GPTBot (ChatGPT): explizit allow "/" (KI-Suche Optimierung)
 * [x] ChatGPT-User: explizit allow "/"
 * [x] PerplexityBot: explizit allow "/" (Perplexity AI)
 * [x] Google-Extended: explizit allow "/" (Google SGE / Gemini)
 * [x] ClaudeBot + anthropic-ai: explizit allow "/"
 * [x] OAI-SearchBot: explizit allow "/" (OpenAI Search, verschieden von GPTBot)
 * [x] Sitemap-URL korrekt verlinkt
 * [x] llms.txt + llms-full.txt: /public/ (selbstentdeckbar per Konvention, kein robots.txt-Eintrag nötig)
 * [ ] TODO: Beim Aufbau von /admin oder /api-Routen: disallow ergänzen
 */
