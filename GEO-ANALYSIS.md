# GEO Analysis Report -- aktuellekw.de

**Date:** 2026-03-19
**Domain:** aktuellekw.de
**Language:** German (de-DE)
**Target Market:** Germany, Austria, Switzerland (DACH)

---

## GEO Readiness Score: 78/100

| Dimension                    | Weight | Score | Weighted |
|------------------------------|--------|-------|----------|
| Citability                   | 25%    | 82    | 20.5     |
| Structural Readability       | 20%    | 85    | 17.0     |
| Multi-Modal Content          | 15%    | 40    | 6.0      |
| Authority & Brand Signals    | 20%    | 62    | 12.4     |
| Technical Accessibility      | 20%    | 88    | 17.6     |
| **Total**                    |        |       | **73.5** |

**Rounded GEO Score: 74/100** -- Good foundation, significant room for improvement in multi-modal content and authority signals.

---

## 1. AI Crawler Access Status

All major AI crawlers are **explicitly allowed** in `robots.txt`. This is best-in-class configuration.

| Crawler         | Purpose                  | Status       |
|-----------------|--------------------------|--------------|
| GPTBot          | ChatGPT training/search  | ALLOWED      |
| OAI-SearchBot   | OpenAI Search            | ALLOWED      |
| ChatGPT-User    | ChatGPT browsing         | ALLOWED      |
| ClaudeBot       | Anthropic Claude         | ALLOWED      |
| anthropic-ai    | Anthropic training       | ALLOWED      |
| PerplexityBot   | Perplexity AI            | ALLOWED      |
| Google-Extended  | Google Gemini/SGE        | ALLOWED      |
| Bytespider      | TikTok/ByteDance AI      | ALLOWED      |
| cohere-ai       | Cohere Command R         | ALLOWED      |
| CCBot (CommonCrawl) | Training datasets    | ALLOWED (implicit via wildcard) |

**Assessment:** 10/10. All AI search crawlers are explicitly permitted. The site goes beyond the standard by including OAI-SearchBot, Bytespider, and cohere-ai. No improvements needed.

---

## 2. llms.txt Status

| File            | Status   | Location         |
|-----------------|----------|------------------|
| `/llms.txt`     | PRESENT  | `public/llms.txt` |
| `/llms-full.txt`| PRESENT  | `public/llms-full.txt` |
| `/.well-known/llms.txt` | NOT FOUND (404) | -- |

### llms.txt Quality Assessment

**Strengths:**
- Well-structured with clear site description and purpose
- Lists all main page types with URLs and descriptions
- Includes explicit AI licensing: "Die Inhalte von aktuellekw.de duerfen fuer KI-Training, Zusammenfassungen (Summarization) und Retrieval-Augmented Generation (RAG) frei genutzt werden."
- Commercial AI use permitted
- `llms-full.txt` provides additional technical detail (framework, ISR settings, Schema.org types, keywords)

**Issues:**
1. **CRITICAL: llms.txt is outdated.** The site has grown from ~5 main pages to 15+ content verticals. The following pages/sections are missing from both llms.txt and llms-full.txt:
   - `/feiertage` and `/feiertage/[year]/[state]` (48 pages)
   - `/schulferien/[year]/[state]` (48 pages)
   - `/datum-heute`
   - `/schaltjahr`
   - `/sommerzeit`, `/winterzeit`, `/zeitumstellung/[year]`
   - `/tagerechner`
   - `/arbeitstage-berechnen`, `/arbeitstage/[year]`
   - `/ostern/[year]`, `/ostermontag/[year]`, `/osterferien/[year]`
   - `/welche-kalenderwoche-haben-wir`
   - `/kalender-mit-kalenderwochen`
   - `/kalenderwochen-uebersicht`
   - `/woche-jahr`
2. `/.well-known/llms.txt` returns 404. While not strictly required, some AI systems look for it at this path.
3. No RSL 1.0 (Robots Source License) formal declaration, though the free-use statement serves a similar purpose.

**Recommendation:** Update both files to reflect the current 300+ page site architecture. Consider adding a `.well-known/llms.txt` redirect.

---

## 3. Citability Analysis

### 3.1 Homepage (/)

| Signal                       | Status | Detail |
|------------------------------|--------|--------|
| Direct answer in first 40 words | YES | "Aktuell ist KW 12 2026. Diese Woche laeuft vom 16.03.2026 (Montag) bis 22.03.2026 (Sonntag) nach ISO 8601." |
| Optimal passage length (134-167 words) | PARTIAL | FAQ answers are 30-60 words (too short for citation passages). Explanatory sections are well-sized. |
| Question-based headings | YES | "Welche Kalenderwoche haben wir morgen?", "Haeufige Fragen zur Kalenderwoche" |
| Statistics with source attribution | YES | "Tag 78 von 365", "21.4% von 2026", "41 von 53 Kalenderwochen verbleiben" |
| Self-contained answer blocks | YES | Each FAQ answer is extractable without external context |
| Speakable Schema | YES | `SpeakableSpecification` with CSS selectors targeting KW display, H1, H2 |

**Homepage Citability Score: 85/100**

### 3.2 FAQ Page (/faq)

| Signal                       | Status | Detail |
|------------------------------|--------|--------|
| Question-based headings | YES | All 9 questions use natural-language question format |
| Direct answer pattern | YES | Each answer starts with the direct fact before elaboration |
| FAQPage Schema | YES | 9 structured Q&A entities in JSON-LD |
| Self-contained blocks | YES | Every answer stands alone |
| Passage length | SHORT | Most answers are 20-50 words, below the 134-167 optimal range |

**FAQ Citability Score: 80/100**

### 3.3 Individual KW Pages (/kw/[slug])

| Signal                       | Status | Detail |
|------------------------------|--------|--------|
| Direct answer | YES | "KW 12 2026 laeuft vom 16.03.2026 bis 22.03.2026" |
| Speakable Schema | YES | Implemented on KW pages |
| Temporal coverage in Schema | YES | ISO date ranges in WebPage schema |
| Navigation context | YES | Breadcrumbs, prev/next week links |

**KW Page Citability Score: 82/100**

### 3.4 Informational Pages

| Page | Direct Answer | Passage Length | Schema | Score |
|------|--------------|----------------|--------|-------|
| /wie-viele-wochen-hat-ein-jahr | YES | GOOD (well-structured paragraphs) | FAQPage | 85 |
| /feiertage | YES ("9 bundeseinheitliche Feiertage") | GOOD | FAQPage | 80 |
| /datum-heute | YES ("Heute ist der 19.03.2026") | GOOD | FAQPage | 78 |
| /schaltjahr | YES | GOOD | Expected | 75 |

### Citability Gaps

1. **FAQ answers are too short** for optimal AI citation. Research shows 134-167 words is the sweet spot. Most answers are 20-50 words. Expanding them with examples, context, and related facts would improve citation probability.
2. **Missing "definitive statement" pattern** on some pages. The pattern "X is Y. This means Z. For example, W." is optimal for AI extraction.
3. **No external citations or sources** referenced in content. Adding references to ISO 8601 official documentation, DIN standards, or government sources would boost perceived authority.

---

## 4. Structural Readability

### Heading Hierarchy

| Page | H1 | H2 Count | H3 Count | Hierarchy Valid |
|------|-----|----------|----------|-----------------|
| / | "Aktuelle KW" | 6+ | Multiple | YES |
| /faq | "Haeufige Fragen zur Kalenderwoche" | 0 (uses details/summary) | 0 | PARTIAL |
| /kalenderwoche | "Kalenderwoche 2026: Alles, was Du wissen musst" | 5+ | Multiple | YES |
| /wie-viele-wochen-hat-ein-jahr | Clear H1 | 4+ | Multiple | YES |
| /kw/[slug] | "Kalenderwoche 12 2026" | 3+ | Multiple | YES |

### Content Structure Signals

| Signal | Status | Detail |
|--------|--------|--------|
| Semantic HTML | YES | Proper use of `<main>`, `<section>`, `<article>`, `<details>` |
| Tables with headers | YES | KW tables use `<th>` elements |
| Lists (ordered/unordered) | YES | Used in FAQ answers and explanatory sections |
| Breadcrumb navigation | YES | BreadcrumbList schema on all pages |
| Logical content sections | YES | Clear visual and semantic separation |
| `<details>/<summary>` for FAQ | YES | Collapsible FAQ sections on multiple pages |

**Structural Readability Score: 85/100**

Minor issues:
- FAQ page uses `<details>` without H2/H3 inside, making heading-based extraction harder for some AI parsers
- Some sections could benefit from `<article>` wrapping for better content boundary detection

---

## 5. Multi-Modal Content

| Content Type | Present | Detail |
|--------------|---------|--------|
| Text content | YES | Comprehensive across all pages |
| Tables/Data | YES | KW tables, holiday tables, comparison tables |
| Images | MINIMAL | Only OG images (1x1px placeholders!) |
| Videos | NO | No video content |
| Infographics | NO | No visual explainers |
| Interactive tools | YES | KW-Rechner (date-to-KW calculator), Tagerechner |
| Charts/Graphs | NO | Progress bar only (CSS, not extractable) |
| Audio | NO | No audio content |
| PDF downloads | NO | No downloadable resources |

**Multi-Modal Score: 40/100**

This is the weakest dimension. AI engines increasingly prefer multi-modal content for citations. Key gaps:

1. **OG images are still 1x1px placeholders** -- this directly impacts social sharing and AI visual citation
2. **No YouTube presence** -- YouTube mentions have the strongest correlation (0.737) with AI citations
3. **No infographics or visual explanations** of ISO 8601, KW calculation, or year comparisons
4. **No video content** explaining calendar week concepts

---

## 6. Authority & Brand Signals

### E-E-A-T Assessment

| Signal | Status | Detail |
|--------|--------|--------|
| Named authors | NO | No individual authorship on any page |
| Organization identity | PARTIAL | "Common Consulting UG" in Impressum, minimal on About page |
| Expertise credentials | NO | No certifications, qualifications, or expert bios |
| Publication dates | YES | `dateModified` in Schema.org, `lastmod` in sitemap |
| External citations | NO | References ISO 8601 by name but no links to official sources |
| Privacy/Legal pages | YES | Impressum, Datenschutz present |
| HTTPS/HSTS | YES | Full HSTS with preload |

### Brand Mention Analysis

| Platform | Presence | Impact on AI Citation |
|----------|----------|----------------------|
| Wikipedia | NOT FOUND | HIGH impact -- no entity page or external links |
| Reddit | UNKNOWN | HIGH impact -- could not verify presence |
| YouTube | NOT FOUND | HIGHEST impact (0.737 correlation) -- no channel |
| LinkedIn | NOT FOUND | Medium impact -- no company page |
| GitHub | PRESENT | Low impact -- @CCUG777 referenced in schema |
| Stack Overflow | NOT FOUND | Low impact for this topic |
| Google Knowledge Panel | UNKNOWN | Would need manual verification |

### Domain Authority Indicators

| Signal | Status |
|--------|--------|
| Domain age | Relatively new |
| Backlink profile | Unknown (would need Ahrefs/Moz data) |
| Brand searches | Growing (target keyword cluster ~500k+/month volume) |
| sameAs in Schema | Only GitHub linked |

**Authority Score: 62/100**

Major gaps:
- No named authors or expert attribution
- Zero presence on high-correlation platforms (YouTube, Wikipedia, Reddit)
- `sameAs` in Organization schema only lists GitHub -- should include all social profiles
- No `author` schema on content pages

---

## 7. Technical Accessibility for AI Crawlers

### Server-Side Rendering

| Check | Status | Detail |
|-------|--------|--------|
| SSR/SSG | YES | `x-nextjs-prerender: 1` confirms static pre-rendering |
| Full HTML in initial response | YES | 176KB HTML with all content server-rendered |
| Content in `<noscript>` | N/A | Not needed -- content is in initial HTML |
| JavaScript dependency for content | MINIMAL | Only LiveDate and KWRechner require JS |
| Text-to-HTML ratio | 67% | 119KB text / 177KB total -- excellent density |
| Response time | FAST | Served from Vercel CDN with cache HIT |

### Caching & Freshness

| Signal | Status |
|--------|--------|
| ISR revalidation | 3600s (homepage, KW pages), 86400s (year pages) |
| Cache headers | `public, max-age=0, must-revalidate` |
| ETag | Present |
| Vercel CDN | Cache HIT confirmed |
| `dateModified` in Schema | Dynamically updated (2026-03-19) |

### Content Accessibility

| Signal | Status |
|--------|--------|
| Canonical URLs | YES -- all pages |
| hreflang | NO -- single language, acceptable |
| Sitemap | YES -- ~300+ URLs with priorities |
| robots.txt | YES -- comprehensive AI crawler allowance |
| llms.txt | YES -- present but outdated |
| Content-Security-Policy | YES -- restrictive but appropriate |
| Structured data | YES -- JSON-LD @graph format on all pages |
| HTTP/2 | YES |
| HSTS Preload | YES |

**Technical Accessibility Score: 88/100**

Minor deductions:
- No `.well-known/llms.txt`
- `llms.txt` not referenced in robots.txt (optional but helpful)
- No `X-Robots-Tag` HTTP header for fine-grained control

---

## 8. Schema.org Markup for AI Discoverability

### Schema Types Implemented

| Schema Type | Pages | AI Relevance |
|-------------|-------|--------------|
| WebSite | All (via layout) | HIGH -- establishes entity identity |
| Organization | All (via layout) | HIGH -- publisher attribution |
| WebApplication | Homepage | MEDIUM -- tool classification |
| FAQPage | /, /faq, /wie-viele-wochen, /feiertage, /datum-heute | HIGH -- direct Q&A extraction |
| Dataset | /kalenderwoche, /kalenderwochen/[year] | MEDIUM -- data classification |
| WebPage | /kw/[slug] | MEDIUM -- temporal content |
| BreadcrumbList | All pages | MEDIUM -- hierarchical context |
| SpeakableSpecification | Homepage, /kw/[slug] | HIGH -- voice search optimization |

### Schema Quality

**Strengths:**
- Uses `@graph` format for linked entities
- `@id` references connect Organization, WebSite, and page-level schemas
- Dynamic `dateModified` keeps freshness signals current
- FAQPage schema contains real, detailed answers (not stubs)
- Speakable schema implemented with CSS selectors
- `inLanguage: "de-DE"` properly set

**Gaps:**
- No `author` property on content pages (articles, guides)
- `sameAs` only contains GitHub -- should include all brand profiles
- No `citation` or `isBasedOn` properties linking to ISO 8601 documentation
- No `ReviewAction` or `InteractionCounter` for social proof
- Missing `potentialAction` with `SearchAction` for sitelinks search box

---

## 9. Platform-Specific Optimization Scores

### Google AI Overviews (AIO)

| Factor | Score | Notes |
|--------|-------|-------|
| FAQPage Schema | 9/10 | 12 questions on homepage, 9 on /faq -- well above threshold |
| Direct answer format | 8/10 | First sentences answer the query directly |
| Content freshness | 9/10 | Dynamic dateModified, ISR keeps content current |
| Structured tables | 8/10 | KW tables, holiday tables, comparison tables |
| E-E-A-T signals | 5/10 | Missing author attribution, no expert credentials |
| **Platform Score** | **78/100** | |

### ChatGPT / SearchGPT

| Factor | Score | Notes |
|--------|-------|-------|
| GPTBot + OAI-SearchBot access | 10/10 | Both explicitly allowed |
| llms.txt | 8/10 | Present but outdated |
| Citability passages | 7/10 | Good but answers too short for optimal citation |
| Brand recognition | 4/10 | No YouTube, Reddit, Wikipedia presence |
| Content depth | 8/10 | Comprehensive coverage of KW topics |
| **Platform Score** | **74/100** | |

### Perplexity AI

| Factor | Score | Notes |
|--------|-------|-------|
| PerplexityBot access | 10/10 | Explicitly allowed |
| Source attribution signals | 6/10 | No external citations to boost credibility |
| Passage extractability | 8/10 | Self-contained answer blocks |
| Factual precision | 9/10 | ISO 8601 compliance, exact dates |
| Structured data | 8/10 | Comprehensive schema markup |
| **Platform Score** | **82/100** | |

### Bing Copilot

| Factor | Score | Notes |
|--------|-------|-------|
| Bing crawler access | 10/10 | Wildcard allow |
| Schema.org markup | 8/10 | Comprehensive |
| Content structure | 8/10 | Clean heading hierarchy |
| Microsoft ecosystem | 3/10 | No LinkedIn presence, no Bing Webmaster integration visible |
| **Platform Score** | **72/100** | |

---

## 10. Top 10 Highest-Impact Recommendations

### Priority 1 -- CRITICAL (do first)

#### 1. Update llms.txt and llms-full.txt to reflect current site architecture
- **Impact:** HIGH -- AI crawlers use llms.txt to understand site scope
- **Effort:** 1-2 hours
- **Detail:** Add all new page categories: /feiertage, /schulferien, /datum-heute, /schaltjahr, /sommerzeit, /winterzeit, /tagerechner, /arbeitstage-berechnen, /ostern, /zeitumstellung, /welche-kalenderwoche-haben-wir, and the various keyword-optimized URLs. The current llms.txt describes a 5-page site when it is actually 300+ pages.

#### 2. Expand FAQ answer lengths to 134-167 words
- **Impact:** HIGH -- research shows this is the optimal passage length for AI citation
- **Effort:** 3-4 hours
- **Detail:** Current FAQ answers average 30-50 words. Expand each with: (a) the direct answer, (b) an explanation of why/how, (c) a practical example, (d) a related fact. Target 150 words per answer. This applies to both the homepage FAQ (12 questions) and the /faq page (9 questions).

#### 3. Create real OG images (replace 1x1px placeholders)
- **Impact:** HIGH -- affects social sharing CTR and visual AI citations
- **Effort:** 2-3 hours
- **Detail:** 6 images needed at 1200x630px. Use brand colors (#000000 background, #0a84ff accent). Include KW number, dates, and site branding. Tools: Figma, Canva, or Next.js OG image generation API.

### Priority 2 -- HIGH (do this week)

#### 4. Establish YouTube presence
- **Impact:** HIGH -- YouTube mentions have 0.737 correlation with AI citations (strongest signal)
- **Effort:** 4-8 hours initial, ongoing
- **Detail:** Create a YouTube channel with short explainer videos: "Was ist eine Kalenderwoche?", "Wie funktioniert ISO 8601?", "Kalenderwochen 2026 im Ueberblick". Even 3-5 short videos (60-90 seconds) would establish presence. Embed on relevant pages and add YouTube URL to Organization `sameAs`.

#### 5. Add author attribution and expand Organization schema
- **Impact:** MEDIUM-HIGH -- directly affects E-E-A-T scores across all AI platforms
- **Effort:** 2-3 hours
- **Detail:**
  - Add `author` property to content pages (articles, guides) with name, URL, and description
  - Expand `sameAs` in Organization schema beyond GitHub
  - Add `foundingDate`, `founders`, `areaServed` to Organization
  - Consider adding a team/author page with bios

#### 6. Add external citations and source attribution
- **Impact:** MEDIUM-HIGH -- boosts perceived authority for AI citation
- **Effort:** 2 hours
- **Detail:** Link to and cite:
  - ISO 8601 official standard (iso.org)
  - DIN EN 28601 (German adoption of ISO 8601)
  - German federal law references for public holidays
  - Wikipedia articles on ISO week date, calendar week
  - Add `citation` or `isBasedOn` properties in Schema.org

### Priority 3 -- MEDIUM (do this month)

#### 7. Add SearchAction schema for sitelinks search box
- **Impact:** MEDIUM -- enables search box in Google results and AI-powered search
- **Effort:** 30 minutes
- **Detail:** Add `potentialAction` with `SearchAction` to WebSite schema. Target query: KW lookup by number/date.

#### 8. Create visual content (infographics, diagrams)
- **Impact:** MEDIUM -- improves multi-modal score and content shareability
- **Effort:** 4-6 hours
- **Detail:** Create SVG/PNG infographics for:
  - "How ISO 8601 week numbering works" (visual explainer)
  - "52 vs 53 weeks: when does a 53rd week occur?" (timeline)
  - "KW calendar 2026" (downloadable visual)
  - Embed with proper `alt` text and `<figure>/<figcaption>` elements

#### 9. Establish Reddit and Wikipedia presence
- **Impact:** MEDIUM -- both platforms have high correlation with AI citation selection
- **Effort:** Ongoing
- **Detail:**
  - Reddit: Participate in relevant German subreddits (r/de, r/FragReddit) when calendar week questions arise. Create helpful posts linking to the site naturally.
  - Wikipedia: Contribute to German Wikipedia articles on Kalenderwoche, ISO 8601. Add aktuellekw.de as an external link where appropriate and policy-compliant.

#### 10. Add `.well-known/llms.txt` and reference in robots.txt
- **Impact:** LOW-MEDIUM -- some AI systems check this path
- **Effort:** 30 minutes
- **Detail:** Create a Next.js route at `app/.well-known/llms.txt/route.ts` that serves the same content as `/llms.txt`. Optionally add a comment in robots.txt pointing to llms.txt location.

---

## 11. Detailed Dimension Analysis

### 11.1 Citability Deep Dive

**What works well:**
- Homepage opens with "Aktuell ist KW 12 2026" -- perfect direct-answer pattern
- FAQ questions use natural language matching real user queries
- Each KW page provides a self-contained factual statement with dates
- Statistics are specific and verifiable ("Tag 78 von 365")
- ISO 8601 is consistently referenced as the authoritative standard

**What needs improvement:**
- FAQ answers average 35 words -- well below the 134-167 word citation sweet spot
- No "According to..." or "Based on..." attribution patterns that AI engines prefer
- Missing comparison/context statements ("Unlike the American system, which...")
- No numbered/ordered lists within answers (AI engines cite list content at higher rates)

### 11.2 Structural Readability Deep Dive

**What works well:**
- Clean heading hierarchy with H1 > H2 > H3 progression
- Semantic HTML with `<main>`, `<section>`, `<details>`
- Tables use proper `<thead>`, `<th>`, `<tbody>` structure
- BreadcrumbList schema provides navigational context

**What needs improvement:**
- FAQ `<details>` elements could additionally contain H3 headings for better parser compatibility
- Some long pages could benefit from `<article>` wrapping for content boundary detection
- Consider adding `id` attributes to sections for deep linking (enables AI to cite specific sections)

### 11.3 Technical Accessibility Deep Dive

**What works well:**
- Server-side rendering confirmed (`x-nextjs-prerender: 1`)
- 67% text-to-HTML ratio (excellent for content extraction)
- Only 2 client components -- minimal JS dependency
- Vercel CDN with cache HIT for fast global delivery
- HSTS with preload enabled
- Comprehensive sitemap with ~300+ URLs and proper priorities
- Full HTTP/2 support

**What needs improvement:**
- Content-Security-Policy is restrictive but may block some AI preview tools
- No `X-Robots-Tag` header for page-level control
- Consider adding `Link: </llms.txt>; rel="ai-manifest"` HTTP header (emerging convention)

---

## 12. Competitive Position

aktuellekw.de is well-positioned for GEO in the German "Kalenderwoche" niche. The technical foundation is strong. The main competitive disadvantages are:

1. **Brand recognition gap:** Established competitors (aktuelle-kalenderwoche.org, finanz-tools.de, kwheute.de) likely have more backlinks, Wikipedia mentions, and social presence
2. **Content depth gap:** FAQ answers need expansion to compete for AI citation
3. **Multi-modal gap:** No video, limited visual content
4. **Authority gap:** No named experts, no institutional backing visible

**Note on citation exclusivity:** Research shows only 11% of domains are cited by both ChatGPT and Google AI Overviews. Platform-specific optimization is essential. aktuellekw.de should prioritize:
- **Google AIO:** Continue FAQPage schema optimization, expand structured data
- **ChatGPT:** Leverage llms.txt advantage (most competitors lack this), expand answer depth
- **Perplexity:** Focus on factual precision and source attribution

---

## 13. Quick Wins (implementable in < 1 hour each)

| Action | Time | Impact |
|--------|------|--------|
| Add `sameAs` URLs to Organization schema (even just Impressum URL) | 15 min | Low-Medium |
| Add `id` attributes to all H2 sections for deep linking | 30 min | Low |
| Add `SearchAction` to WebSite schema | 30 min | Medium |
| Reference llms.txt in robots.txt as a comment | 5 min | Low |
| Add `datePublished` to all content pages in Schema | 30 min | Medium |
| Add `inLanguage: "de-DE"` to page-level schemas (not just WebSite) | 20 min | Low |

---

## Summary

aktuellekw.de has a **strong technical GEO foundation** (score 74/100). The site excels at:
- AI crawler accessibility (all major bots explicitly allowed)
- llms.txt implementation (one of few German sites to have this)
- Server-side rendering with excellent text-to-HTML ratio
- Comprehensive Schema.org markup with FAQPage and Speakable
- Clean content structure with direct-answer patterns

The three biggest opportunities for improvement are:
1. **Multi-modal content** (40/100) -- YouTube channel, infographics, real OG images
2. **Authority signals** (62/100) -- brand presence on YouTube/Reddit/Wikipedia, author attribution
3. **Answer depth** -- expanding FAQ answers from ~35 words to 134-167 words for optimal citation

Implementing the top 5 recommendations would likely raise the GEO score from 74 to approximately 85-88.
