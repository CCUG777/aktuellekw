import { getAllKWsForYear, getCurrentKW } from "@/lib/kw";

/**
 * ICS-Download für eine Kalenderwoche.
 * GET /kw/9-2026/ics  →  text/calendar mit einem Ganztags-Event Mo–So.
 */

function parseSlug(slug: string): { weekNumber: number; year: number } | null {
  const parts = slug.split("-");
  if (parts.length === 1) {
    const kw = parseInt(parts[0], 10);
    if (isNaN(kw) || kw < 1 || kw > 53) return null;
    return { weekNumber: kw, year: getCurrentKW().year };
  }
  if (parts.length === 2) {
    const kw = parseInt(parts[0], 10);
    const yr = parseInt(parts[1], 10);
    if (isNaN(kw) || isNaN(yr) || kw < 1 || kw > 53 || yr < 2000 || yr > 2099)
      return null;
    return { weekNumber: kw, year: yr };
  }
  return null;
}

function icsDate(d: Date): string {
  return d.toISOString().slice(0, 10).replace(/-/g, "");
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
): Promise<Response> {
  const { slug } = await params;
  const parsed = parseSlug(slug);
  if (!parsed) return new Response("Not found", { status: 404 });

  const week = getAllKWsForYear(parsed.year).find(
    (w) => w.weekNumber === parsed.weekNumber
  );
  if (!week) return new Response("Not found", { status: 404 });

  // Ganztags-Event: DTEND ist exklusiv → Montag der Folgewoche
  const dtStart = icsDate(week.startDate);
  const dtEndExclusive = new Date(week.endDate);
  dtEndExclusive.setUTCDate(dtEndExclusive.getUTCDate() + 1);
  const dtEnd = icsDate(dtEndExclusive);

  const uid = `kw-${parsed.weekNumber}-${parsed.year}@aktuellekw.de`;
  const stamp = new Date().toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z";

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//aktuellekw.de//KW//DE",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${dtStart}`,
    `DTEND;VALUE=DATE:${dtEnd}`,
    `SUMMARY:KW ${parsed.weekNumber} ${parsed.year}`,
    `DESCRIPTION:Kalenderwoche ${parsed.weekNumber} ${parsed.year} nach ISO 8601 (Mo–So). https://aktuellekw.de/kw/${parsed.weekNumber}-${parsed.year}`,
    "TRANSP:TRANSPARENT",
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ].join("\r\n");

  return new Response(ics, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="kw-${parsed.weekNumber}-${parsed.year}.ics"`,
      "Cache-Control": "public, max-age=86400",
    },
  });
}
