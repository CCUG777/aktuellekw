/**
 * ISO 8601 calendar week utilities.
 * Week starts on Monday. Week 1 is the week containing the first Thursday of the year.
 */

export interface KWInfo {
  weekNumber: number;
  year: number;
  startDate: Date;
  endDate: Date;
}

export function getISOWeekNumber(date: Date): number {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

export function getISOWeekYear(date: Date): number {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  return d.getUTCFullYear();
}

export function getWeekStart(date: Date): Date {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() - dayNum + 1);
  return d;
}

export function getWeekEnd(date: Date): Date {
  const start = getWeekStart(date);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 6);
  return end;
}

export function getKWInfo(date: Date): KWInfo {
  return {
    weekNumber: getISOWeekNumber(date),
    year: getISOWeekYear(date),
    startDate: getWeekStart(date),
    endDate: getWeekEnd(date),
  };
}

export function getCurrentKW(): KWInfo {
  return getKWInfo(new Date());
}

export function getAllKWsForYear(year: number): KWInfo[] {
  const weeks: KWInfo[] = [];
  const jan4 = new Date(Date.UTC(year, 0, 4));
  const firstMonday = getWeekStart(jan4);

  let current = new Date(firstMonday);
  while (getISOWeekYear(current) === year) {
    weeks.push(getKWInfo(current));
    current = new Date(current);
    current.setUTCDate(current.getUTCDate() + 7);
  }

  return weeks;
}

export function formatDateDE(date: Date): string {
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();
  return `${day}.${month}.${year}`;
}

export function getWeeksInYear(year: number): number {
  const dec28 = new Date(Date.UTC(year, 11, 28));
  return getISOWeekNumber(dec28);
}

export function getDayOfYear(date: Date): number {
  const start = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const now = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );
  return Math.floor((now.getTime() - start.getTime()) / 86_400_000) + 1;
}

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function getDayNameDE(date: Date): string {
  const days = [
    "Sonntag",
    "Montag",
    "Dienstag",
    "Mittwoch",
    "Donnerstag",
    "Freitag",
    "Samstag",
  ];
  return days[date.getUTCDay()];
}
