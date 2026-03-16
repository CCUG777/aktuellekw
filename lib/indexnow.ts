/**
 * IndexNow – Sofort-Indexierung bei Bing, Yandex, Naver u.a.
 *
 * Protokoll:  https://www.indexnow.org/
 * Key-Datei:  /public/a7b3c9d2e5f84160b8e2f3a6c4d1e9b7.txt
 * Endpoint:   https://api.indexnow.org/indexnow  (leitet an alle Partner weiter)
 *
 * Verwendung:
 *   import { submitToIndexNow } from "@/lib/indexnow";
 *   await submitToIndexNow(["https://aktuellekw.de/kw/9-2026"]);
 */

export const INDEXNOW_KEY = "a7b3c9d2e5f84160b8e2f3a6c4d1e9b7";
export const INDEXNOW_HOST = "aktuellekw.de";
export const INDEXNOW_KEY_LOCATION = `https://${INDEXNOW_HOST}/${INDEXNOW_KEY}.txt`;
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

/**
 * Meldet eine oder mehrere URLs sofort bei IndexNow-Suchmaschinen an.
 * Maximal 10.000 URLs pro Aufruf laut Protokoll-Spezifikation.
 *
 * @throws Error bei HTTP-Fehler (4xx/5xx)
 */
export async function submitToIndexNow(urls: string[]): Promise<void> {
  if (urls.length === 0) return;
  if (urls.length > 10_000) {
    throw new Error(`IndexNow: max 10.000 URLs pro Request (erhalten: ${urls.length})`);
  }

  const res = await fetch(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: INDEXNOW_HOST,
      key: INDEXNOW_KEY,
      keyLocation: INDEXNOW_KEY_LOCATION,
      urlList: urls,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`IndexNow HTTP ${res.status}: ${text}`);
  }
}

/**
 * Meldet eine einzelne URL per GET-Request an (einfachste Variante).
 * Geeignet für ISR-Revalidierungen einzelner Seiten.
 */
export async function submitSingleUrlToIndexNow(url: string): Promise<void> {
  const params = new URLSearchParams({
    url,
    key: INDEXNOW_KEY,
    keyLocation: INDEXNOW_KEY_LOCATION,
  });

  const res = await fetch(`${INDEXNOW_ENDPOINT}?${params.toString()}`, {
    method: "GET",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`IndexNow GET HTTP ${res.status}: ${text}`);
  }
}
