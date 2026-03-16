#!/usr/bin/env node
/**
 * submit-indexnow.mjs
 * ─────────────────────────────────────────────────────────────────
 * Sendet alle URLs aus der Sitemap von aktuellekw.de an das
 * IndexNow-Protokoll (Bing, Yandex, Naver, Seznam, …).
 *
 * Verwendung:
 *   npm run indexnow             ← alle URLs aus der Live-Sitemap
 *   npm run indexnow -- --dry-run  ← Ausgabe ohne API-Call
 *   npm run indexnow -- --url https://aktuellekw.de/kw/9-2026
 *                                 ← einzelne URL sofort melden
 *
 * Node.js ≥ 18 erforderlich (nativer fetch).
 */

const KEY = "a7b3c9d2e5f84160b8e2f3a6c4d1e9b7";
const HOST = "aktuellekw.de";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const SITEMAP_URL = `https://${HOST}/sitemap.xml`;
const ENDPOINT = "https://api.indexnow.org/indexnow";
const BATCH_SIZE = 500; // Max 10.000 laut Spec; 500 für sichere Batches

/* ── Argumente ──────────────────────────────────────────────── */
const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const SINGLE_URL_IDX = args.indexOf("--url");
const SINGLE_URL = SINGLE_URL_IDX !== -1 ? args[SINGLE_URL_IDX + 1] : null;

/* ── Farb-Hilfsfunktionen (ohne externe Deps) ───────────────── */
const green = (s) => `\x1b[32m${s}\x1b[0m`;
const red = (s) => `\x1b[31m${s}\x1b[0m`;
const gray = (s) => `\x1b[90m${s}\x1b[0m`;
const bold = (s) => `\x1b[1m${s}\x1b[0m`;

/* ── Sitemap holen und URLs extrahieren ─────────────────────── */
async function fetchSitemapUrls(sitemapUrl) {
  console.log(gray(`  Lade Sitemap: ${sitemapUrl}`));
  const res = await fetch(sitemapUrl, {
    headers: { "User-Agent": "IndexNow-Submitter/1.0 (aktuellekw.de)" },
  });
  if (!res.ok) {
    throw new Error(`Sitemap-Fehler HTTP ${res.status}: ${sitemapUrl}`);
  }
  const xml = await res.text();

  // Sitemap-Index: enthält <sitemap>-Einträge → rekursiv laden
  if (xml.includes("<sitemapindex")) {
    const subUrls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1].trim());
    console.log(gray(`  Sitemap-Index mit ${subUrls.length} Sub-Sitemaps gefunden`));
    const nested = await Promise.all(subUrls.map(fetchSitemapUrls));
    return nested.flat();
  }

  // Standard-Sitemap: enthält <url>-Einträge
  const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1].trim());
  return urls;
}

/* ── IndexNow POST-Batch senden ─────────────────────────────── */
async function submitBatch(urls, batchNum, totalBatches) {
  const label = `Batch ${batchNum}/${totalBatches} (${urls.length} URLs)`;

  if (DRY_RUN) {
    console.log(gray(`  [dry-run] ${label} – würde senden`));
    urls.slice(0, 3).forEach((u) => console.log(gray(`    ${u}`)));
    if (urls.length > 3) console.log(gray(`    … und ${urls.length - 3} weitere`));
    return { ok: true, status: 0 };
  }

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: HOST,
      key: KEY,
      keyLocation: KEY_LOCATION,
      urlList: urls,
    }),
  });

  return { ok: res.ok, status: res.status, statusText: res.statusText };
}

/* ── IndexNow GET (einzelne URL) ────────────────────────────── */
async function submitSingle(url) {
  if (DRY_RUN) {
    console.log(gray(`  [dry-run] GET ${url}`));
    return;
  }
  const params = new URLSearchParams({ url, key: KEY, keyLocation: KEY_LOCATION });
  const res = await fetch(`${ENDPOINT}?${params}`, { method: "GET" });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
}

/* ── Hauptprogramm ──────────────────────────────────────────── */
async function main() {
  console.log(bold("\n  IndexNow Submission – aktuellekw.de\n"));
  if (DRY_RUN) console.log(gray("  ⚠ Dry-Run aktiv – kein echter API-Call\n"));

  /* Einzelne URL */
  if (SINGLE_URL) {
    console.log(`  Sende einzelne URL: ${SINGLE_URL}`);
    await submitSingle(SINGLE_URL);
    console.log(green("  ✓ Erfolgreich gemeldet"));
    return;
  }

  /* Alle Sitemap-URLs */
  console.log("  Schritt 1: Sitemap laden …");
  const urls = await fetchSitemapUrls(SITEMAP_URL);
  console.log(green(`  ✓ ${urls.length} URLs gefunden\n`));

  console.log("  Schritt 2: URLs in Batches an IndexNow senden …");
  const totalBatches = Math.ceil(urls.length / BATCH_SIZE);
  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < urls.length; i += BATCH_SIZE) {
    const batch = urls.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const result = await submitBatch(batch, batchNum, totalBatches);

    if (result.ok || DRY_RUN) {
      const statusLabel = DRY_RUN ? "dry-run" : `HTTP ${result.status}`;
      console.log(green(`  ✓ Batch ${batchNum}/${totalBatches} → ${statusLabel}`));
      successCount += batch.length;
    } else {
      console.log(red(`  ✗ Batch ${batchNum}/${totalBatches} → HTTP ${result.status} ${result.statusText}`));
      errorCount += batch.length;
    }

    // Kleine Pause zwischen Batches (Rate-Limiting vermeiden)
    if (i + BATCH_SIZE < urls.length) {
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  /* Ergebnis */
  console.log(`\n  ${bold("Ergebnis:")}`);
  console.log(green(`    ✓ ${successCount} URLs erfolgreich gemeldet`));
  if (errorCount > 0) {
    console.log(red(`    ✗ ${errorCount} URLs fehlgeschlagen`));
    process.exit(1);
  }
  console.log();
}

main().catch((err) => {
  console.error(red(`\n  Fehler: ${err.message}\n`));
  process.exit(1);
});
