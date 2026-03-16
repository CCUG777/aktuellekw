# SEO Action Plan: aktuellekw.de

**Generated:** 2026-03-16
**Current Score:** 82/100
**Target Score:** 90+/100

---

## CRITICAL -- Fix Immediately

### 1. Add Security Headers
**Impact:** Security + trust signals | **Time:** 15 min
**File:** `next.config.ts`

```typescript
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

### 2. Fix "Saturationsjahr" Terminology
**Impact:** Factual accuracy | **Time:** 5 min
**File:** `app/page.tsx` line 507
**Action:** Replace "Saturationsjahr" with "langes Jahr" (established German terminology for 53-week years)

---

## HIGH -- Fix Within 1 Week

### 3. Remove noindex Pages from Sitemap
**File:** `app/sitemap.ts` -- Remove `/impressum` and `/datenschutz` entries

### 4. Fix robots Directive on Legal Pages
**Files:** `app/impressum/page.tsx`, `app/datenschutz/page.tsx`
**Action:** Change `{ index: false, follow: false }` to `{ index: false, follow: true }`

### 5. Add OAI-SearchBot to robots.txt
**File:** `app/robots.ts`
**Action:** Add `{ userAgent: "OAI-SearchBot", allow: "/" }` block

### 6. Consolidate Duplicate FAQ Questions
**File:** `app/faq/page.tsx`
**Action:** Merge 3 "welche KW" questions into 1, merge 4 "wie viele Wochen" into 2 distinct questions

### 7. Add Content to `/kalenderwochen/[year]` Pages
**File:** `app/kalenderwochen/[year]/page.tsx`
**Action:** Add 300+ words of editorial content (year-specific holidays, notable KW transitions, working day stats)

### 8. Create "Ueber uns" Page
**New file:** `app/ueber-uns/page.tsx`
**Action:** Establish E-E-A-T with team background, expertise, methodology

### 9. Standardize Du/Sie Register
**Files:** All content pages
**Action:** Use "Du" consistently (matches homepage tone)

### 10. Standardize JSON-LD to @graph Format
**Files:** `app/faq/page.tsx`, `app/kw/[slug]/page.tsx`, `app/kalenderwochen/[year]/page.tsx`, `app/kalenderwoche/page.tsx`
**Action:** Wrap multi-schema pages in `{"@context": "https://schema.org", "@graph": [...]}`

---

## MEDIUM -- Fix Within 1 Month

### 11-22. See FULL-AUDIT-REPORT.md for complete details

Key items:
- Fix lastmod inflation in sitemap
- Make layout title dynamic
- Add contextual data to KW detail pages
- Add external citations
- Add RSL license to llms.txt
- Add visible freshness timestamps
- Use domain email
- Implement IndexNow
- Plan year-parameterized URL migration

---

## LOW -- Backlog

### 23-30. See FULL-AUDIT-REPORT.md for complete details

Key items:
- Add @id linking across schemas
- Remove keywords meta tag
- Build external brand presence (YouTube, Reddit, LinkedIn)
- Add Organization schema with sameAs
