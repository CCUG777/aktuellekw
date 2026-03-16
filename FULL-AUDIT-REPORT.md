# Full SEO Audit Report: aktuellekw.de

**Audit Date:** 2026-03-16
**Domain:** aktuellekw.de
**Tech Stack:** Next.js 16 (App Router), TypeScript, Tailwind CSS v4
**Business Type:** German calendar week reference/utility site
**Pages Analyzed:** ~291 URLs across 30+ route patterns

---

## Executive Summary

### Overall SEO Health Score: 82 / 100

| Category | Weight | Score | Weighted |
|----------|--------|-------|----------|
| Technical SEO | 25% | 85 | 21.25 |
| Content Quality | 25% | 72 | 18.00 |
| On-Page SEO | 20% | 85 | 17.00 |
| Schema / Structured Data | 10% | 90 | 9.00 |
| Performance (CWV) | 10% | 95 | 9.50 |
| Images | 5% | 70 | 3.50 |
| AI Search Readiness | 5% | 78 | 3.90 |
| **TOTAL** | **100%** | | **82.15** |

### Top 5 Critical Issues

1. **No security headers configured** in `next.config.ts` (X-Frame-Options, CSP, etc.)
2. **Thin content on `/kalenderwochen/[year]`** pages (~150 words, no editorial depth)
3. **No "About Us" page** -- major E-E-A-T gap (no author, no credentials, no expertise signals)
4. **Duplicate FAQ questions** on `/faq` -- 3 near-identical "welche KW" + 4 near-identical "wie viele Wochen" questions
5. **noindex pages (`/impressum`, `/datenschutz`) listed in sitemap** -- conflicting signals

### Top 5 Quick Wins

1. **Add `OAI-SearchBot` to robots.txt** (5 min, improves ChatGPT search visibility)
2. **Fix "Saturationsjahr" terminology** to "langes Jahr" (5 min, factual accuracy)
3. **Remove noindex pages from sitemap** (10 min, resolves conflicting signals)
4. **Change `follow: false` to `follow: true`** on Impressum/Datenschutz (5 min, preserves link equity)
5. **Standardize Du/Sie register** across all pages (30 min, consistency)

---

## 1. Technical SEO (Score: 85/100)

### 1.1 Crawlability -- PASS (95/100)

**robots.txt:** Correctly configured via Next.js `MetadataRoute`. All standard crawlers allowed via wildcard `*`. Six AI crawlers explicitly listed (GPTBot, ChatGPT-User, PerplexityBot, Google-Extended, ClaudeBot, anthropic-ai). Sitemap URL referenced.

| Issue | Severity | Detail |
|-------|----------|--------|
| Missing OAI-SearchBot | Medium | OpenAI's dedicated search crawler not explicitly listed |
| Missing Bytespider | Low | TikTok's crawler not listed |

**Sitemap:** ~291 URLs programmatically generated. All filesystem routes covered with no duplicates or orphans.

| Issue | Severity | Detail |
|-------|----------|--------|
| lastmod inflation | Medium | ~15 static pages use `now` as lastmod but content doesn't change daily. Degrades Google's trust in the lastmod signal. |
| Year-hardcoded URLs | Medium | `/arbeitstage-2026` and `/zeitumstellung-2026` will become stale in 2027 |
| noindex pages in sitemap | Medium | `/impressum` and `/datenschutz` have `noindex` but appear in sitemap |

### 1.2 Indexability -- PASS (90/100)

**Canonical tags:** Correctly set on all pages via `alternates.canonical`.

**Title tags & meta descriptions:** All pages use `generateMetadata()` with dynamic values. Template: `%s | aktuellekw.de`.

| Issue | Severity | Detail |
|-------|----------|--------|
| Hardcoded "2026" in layout default title | Medium | `app/layout.tsx` line 17 -- will become stale |
| Potential keyword cannibalization | Medium | 5 pages target similar "KW overview" keywords |
| `follow: false` on legal pages | Medium | Blocks link equity flow from Impressum/Datenschutz |

### 1.3 Security -- NEEDS ACTION (70/100)

| Issue | Severity | Detail |
|-------|----------|--------|
| No security headers in next.config.ts | High | Missing X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy |

**Recommended fix:**
```typescript
// next.config.ts
async headers() {
  return [{
    source: "/(.*)",
    headers: [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    ],
  }];
}
```

### 1.4 URL Structure -- PASS (92/100)

Clean, hierarchical URLs. Consistent lowercase, no trailing slashes, no query parameters. German-language slugs match audience expectations. 301 redirects properly configured for URL migrations.

### 1.5 Mobile -- PASS (93/100)

Tailwind CSS v4 responsive breakpoints. Hamburger menu with portal-based drawer. Touch targets adequate. `skip-to-content` link, semantic HTML landmarks, `prefers-reduced-motion` support.

### 1.6 JavaScript Rendering -- PASS (96/100)

Server Components by default. Only 6 small client components (~12-15 KB total). All SEO-relevant content in initial HTML. No JS required for content visibility.

### 1.7 IndexNow -- NOT IMPLEMENTED (0/100)

No IndexNow protocol detected. Would enable instant indexing on Bing, Yandex, and Naver.

---

## 2. Content Quality (Score: 72/100)

### 2.1 E-E-A-T Assessment

| Dimension | Score | Key Gap |
|-----------|-------|---------|
| Experience | 48/100 | No author byline, no real-world examples, no editorial voice |
| Expertise | 62/100 | Accurate ISO 8601 content but no credentials, no external citations |
| Authoritativeness | 45/100 | Generic company, free email (GMX), no social presence |
| Trustworthiness | 68/100 | Full Impressum/Datenschutz, but free email undermines credibility |
| **E-E-A-T Weighted** | **57/100** | |

### 2.2 Page-by-Page Content Depth

| Page | Est. Words | Min. Target | Assessment |
|------|-----------|-------------|------------|
| `/` (homepage) | ~2,000 | 500 | PASS -- comprehensive, well-structured |
| `/kalenderwoche` | ~900 | 800 | PASS -- comparison table adds value |
| `/faq` | ~600 | 800 | MARGINAL -- thin, duplicate questions |
| `/kw/[slug]` (x157) | ~230 | 300 | MARGINAL -- template-based, no unique editorial |
| `/kalenderwochen/[year]` | ~150 | 500 | THIN -- needs substantial editorial content |

### 2.3 Content Issues

| Issue | Severity | Detail |
|-------|----------|--------|
| No "About Us" page | High | Biggest E-E-A-T gap -- no author, no team, no expertise signals |
| Incorrect terminology "Saturationsjahr" | High | Should be "langes Jahr" -- factual error, AI hallucination artifact |
| Duplicate FAQ questions | High | 3 near-identical "welche KW" + 4 near-identical "wie viele Wochen" questions |
| Du/Sie inconsistency | Medium | Homepage uses "Du", FAQ uses "Sie" -- jarring, signals lack of editorial review |
| Thin `/kalenderwochen/[year]` pages | Medium | ~150 words, essentially stripped-down duplicate of `/kalenderwoche` |
| No external citations | Medium | References ISO 8601/DIN 1355 but never links to authoritative sources |
| Free email address | Medium | `commonconsulting@gmx.de` instead of domain email |
| Template-based KW pages | Low | 157 pages with near-identical explanatory text |

### 2.4 Readability

German target audience, education level 10-12 (Gymnasium). Sentence length appropriate (15-25 words average). Technical terms explained when introduced.

---

## 3. On-Page SEO (Score: 85/100)

### 3.1 Heading Structure

Homepage: 1 H1 + 13 H2s -- within acceptable range for a comprehensive reference page. Question-based H2s excellent for AI extraction.

### 3.2 Internal Linking -- STRONG

| Link Pattern | Status |
|-------------|--------|
| Homepage -> all major sections | PASS |
| KWTable cells -> `/kw/[n]-[year]` | PASS |
| Prev/next KW navigation | PASS (with year rollover) |
| Breadcrumbs on all pages | PASS |
| Footer link grid | PASS (~35 links) |
| FAQ -> homepage, /kalenderwoche | PASS |

### 3.3 Open Graph & Social -- PASS

Dynamic OG images generated via `opengraph-image.tsx` on 17+ routes (1200x630 PNG). Twitter Card `summary_large_image` on all pages. Full OG tags (16 per page).

---

## 4. Schema / Structured Data (Score: 90/100)

### 4.1 Implementation Matrix

| Page | WebSite | BreadcrumbList | FAQPage | WebApplication | Dataset | WebPage | Speakable |
|------|:-------:|:--------------:|:-------:|:--------------:|:-------:|:-------:|:---------:|
| Layout (global) | YES | -- | -- | -- | -- | -- | -- |
| `/` | -- | YES (1 level) | YES (12 Q) | YES | -- | -- | YES |
| `/faq` | -- | YES (2 levels) | YES (13 Q) | -- | -- | -- | YES |
| `/kalenderwoche` | -- | YES (2 levels) | YES (4 Q) | -- | YES | -- | -- |
| `/kw/[slug]` | -- | YES (3 levels) | -- | -- | -- | YES | YES |
| `/kalenderwochen/[year]` | -- | YES (2 levels) | -- | -- | YES | -- | -- |

### 4.2 Validation Results

- All 12 schema blocks: Valid `@context`, valid `@type`, correct data types
- All URLs absolute, all dates ISO 8601
- No placeholder text in schema output
- No deprecated schema types

### 4.3 Issues

| Issue | Severity | Detail |
|-------|----------|--------|
| Inconsistent JSON-LD format | High | Homepage uses `@graph` (best practice), other pages use JSON arrays. Standardize on `@graph`. |
| Missing `@id` linking | Low | No `@id` properties for cross-page entity connection |
| Missing `license` on Dataset | Medium | Google Dataset Search recommends `license` property |
| Documentation mismatch | Low | CLAUDE.md says `Event` for KW pages, code uses `WebPage` |
| Duplicate Dataset schemas | Low | `/kalenderwoche` and `/kalenderwochen/2026` define same Dataset |

---

## 5. Performance / Core Web Vitals (Score: 95/100)

### 5.1 Estimated Lighthouse Score: 92-98/100

| Metric | Estimated Value | Status |
|--------|----------------|--------|
| LCP | 0.8-1.5s | GOOD (target: <2.5s) |
| INP | 30-80ms | GOOD (target: <200ms) |
| CLS | 0.01-0.03 | GOOD (target: <0.1) |
| TTFB | 50-150ms (CDN edge) | GOOD (target: <200ms) |
| Total Blocking Time | <100ms | GOOD |
| Client JS Size | ~75-85 KB gzipped | Minimal for Next.js |
| CSS Size | ~4-6 KB gzipped | Excellent |
| Third-party Scripts | 0 | None |

### 5.2 Architecture Strengths

- Server Components by default (minimal client JS)
- Zero runtime dependencies beyond React 19 / Next.js 16
- ISR with appropriate revalidation (3600s / 86400s)
- Font loading: Inter with `display: "swap"`, self-hosted via `next/font`
- CSS-only animations honoring `prefers-reduced-motion`
- No third-party scripts, analytics, or ad frameworks

### 5.3 Performance Issues

| Issue | Severity | Detail |
|-------|----------|--------|
| MobileMenu renders full DOM when closed | Medium | Use conditional rendering to reduce initial DOM by ~30 elements |
| `blur-[100px]` on KWDisplay glow | Low | GPU-intensive on low-end mobile devices |
| No `poweredByHeader: false` in config | Low | Unnecessary header sent |
| BackToTop uses scroll listener | Low | Could use IntersectionObserver instead |

---

## 6. Images (Score: 70/100)

No visible images on any page (text-only site). OG images dynamically generated via `opengraph-image.tsx` (1200x630 PNG). No images to optimize, but also no visual/multi-modal content for AI engines to reference.

---

## 7. AI Search Readiness / GEO (Score: 78/100)

### 7.1 Platform Scores

| Platform | Score | Key Strength | Key Gap |
|----------|-------|-------------|---------|
| Google AI Overviews | 82/100 | Speakable, max-snippet -1, SSG | E-E-A-T gaps |
| ChatGPT Search | 75/100 | llms.txt, GPTBot allowed | No OAI-SearchBot, no brand signals |
| Perplexity | 80/100 | Direct answers, tables | Authority limitations |
| Bing Copilot | 72/100 | Clean HTML, structured data | No IndexNow, no LinkedIn entity |

### 7.2 GEO Strengths

- Both `llms.txt` and `llms-full.txt` present and well-structured
- 6 AI crawlers explicitly allowed in robots.txt
- FAQPage schema with 29+ Q&A pairs for AI extraction
- Speakable schema on 4/5 page types
- Direct-answer patterns ("Die kurze Antwort lautet:...")
- `max-snippet: -1` and `max-image-preview: large`

### 7.3 GEO Issues

| Issue | Severity | Detail |
|-------|----------|--------|
| Missing OAI-SearchBot | Medium | OpenAI's search crawler not explicitly listed |
| No RSL license in llms.txt | Medium | No explicit AI citation permission |
| No external brand signals | High (long-term) | No YouTube, Reddit, LinkedIn presence |
| Multi-modal content gap | Medium | No images, video, or infographics |
| No visible freshness timestamps | Medium | No "Zuletzt aktualisiert" on content pages |

---

## Prioritized Action Plan

### CRITICAL (fix immediately)

| # | Issue | File(s) | Est. Time |
|---|-------|---------|-----------|
| 1 | Add security headers to next.config.ts | `next.config.ts` | 15 min |
| 2 | Fix "Saturationsjahr" to "langes Jahr" | `app/page.tsx` line 507 | 5 min |

### HIGH (fix within 1 week)

| # | Issue | File(s) | Est. Time |
|---|-------|---------|-----------|
| 3 | Remove noindex pages from sitemap | `app/sitemap.ts` | 10 min |
| 4 | Change `follow: false` to `follow: true` on legal pages | `app/impressum/page.tsx`, `app/datenschutz/page.tsx` | 5 min |
| 5 | Add OAI-SearchBot to robots.txt | `app/robots.ts` | 5 min |
| 6 | Consolidate duplicate FAQ questions | `app/faq/page.tsx` | 1 hour |
| 7 | Add editorial content to `/kalenderwochen/[year]` | `app/kalenderwochen/[year]/page.tsx` | 2 hours |
| 8 | Create "Ueber uns" / About page | New file | 2 hours |
| 9 | Standardize Du/Sie register across all pages | Multiple files | 1 hour |
| 10 | Standardize JSON-LD to `@graph` format on all pages | `app/faq/page.tsx`, `app/kw/[slug]/page.tsx`, etc. | 1 hour |

### MEDIUM (fix within 1 month)

| # | Issue | File(s) | Est. Time |
|---|-------|---------|-----------|
| 11 | Fix lastmod inflation (static pages using `now`) | `app/sitemap.ts` | 30 min |
| 12 | Make layout default title dynamic (remove hardcoded "2026") | `app/layout.tsx` | 10 min |
| 13 | Add contextual data to `/kw/[slug]` pages (holidays, seasons) | `app/kw/[slug]/page.tsx` | 4 hours |
| 14 | Add external citations to ISO 8601 / DIN 1355 | Multiple files | 30 min |
| 15 | Add RSL license and cross-reference to llms.txt | `public/llms.txt` | 15 min |
| 16 | Add visible "Zuletzt aktualisiert" timestamps | Multiple files | 1 hour |
| 17 | Use domain email instead of GMX | Impressum | 30 min |
| 18 | Add `license` to Dataset schemas | `app/kalenderwoche/page.tsx`, `app/kalenderwochen/[year]/page.tsx` | 15 min |
| 19 | Conditional rendering for MobileMenu | `components/MobileMenu.tsx` | 30 min |
| 20 | Plan migration: `/arbeitstage-2026` -> `/arbeitstage/[year]` | Multiple files | 3 hours |
| 21 | Plan migration: `/zeitumstellung-2026` -> `/zeitumstellung/[year]` | Multiple files | 3 hours |
| 22 | Implement IndexNow protocol | New file + API integration | 2 hours |

### LOW (backlog)

| # | Issue | File(s) | Est. Time |
|---|-------|---------|-----------|
| 23 | Add `@id` linking across schemas | All page files | 1 hour |
| 24 | Remove `keywords` meta tag (ignored by Google) | `app/layout.tsx` | 5 min |
| 25 | Add `datePublished`/`dateModified` to schemas | All page files | 1 hour |
| 26 | Increase footer link gap for mobile touch targets | `components/Footer.tsx` | 10 min |
| 27 | Add Bytespider + cohere-ai to robots.txt | `app/robots.ts` | 5 min |
| 28 | Build YouTube, Reddit, LinkedIn brand presence | External platforms | Ongoing |
| 29 | Add Organization schema with `sameAs` | `app/layout.tsx` | 30 min |
| 30 | Update CLAUDE.md (Event -> WebPage for KW pages) | `CLAUDE.md` | 5 min |

---

## Appendix: Scoring Methodology

**Technical SEO (25%):** robots.txt, sitemap, canonicals, security headers, URL structure, mobile-friendliness, JS rendering, IndexNow. Source: Technical SEO specialist agent.

**Content Quality (25%):** E-E-A-T assessment per Google September 2025 Quality Rater Guidelines, readability, thin content detection, keyword optimization, content freshness. Source: Content quality agent.

**On-Page SEO (20%):** Title tags, meta descriptions, heading structure, internal linking, Open Graph. Derived from technical + content findings.

**Schema/Structured Data (10%):** JSON-LD detection, validation, coverage, missing opportunities. Source: Schema markup agent.

**Performance/CWV (10%):** LCP, INP, CLS estimates, resource optimization, server response times. Source: Performance agent.

**Images (5%):** Alt text, file sizes, formats, lazy loading, CLS prevention. Minimal for this text-only site.

**AI Search Readiness (5%):** AI crawler access, llms.txt, citability, structured data for AI extraction, platform-specific optimization. Source: GEO agent.

---

*Report generated by SEO Audit System -- 6 specialist agents running in parallel*
*Analysis based on full source code inspection + live URL fetching*
