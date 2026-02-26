"use client";

import { useEffect, useState } from "react";

interface DateInfo {
  day: string;
  formatted: string;
}

function getClientDateInfo(): DateInfo {
  const d = new Date();
  const days = [
    "Sonntag",
    "Montag",
    "Dienstag",
    "Mittwoch",
    "Donnerstag",
    "Freitag",
    "Samstag",
  ];
  return {
    day: days[d.getDay()],
    formatted: `${String(d.getDate()).padStart(2, "0")}.${String(
      d.getMonth() + 1
    ).padStart(2, "0")}.${d.getFullYear()}`,
  };
}

interface LiveDateProps {
  /** Server-rendered fallback values (from ISR cache) */
  fallbackDay: string;
  fallbackDate: string;
}

/**
 * Client component – renders the current date live in the browser.
 * Falls back to server-rendered values until hydration.
 */
export default function LiveDate({ fallbackDay, fallbackDate }: LiveDateProps) {
  const [info, setInfo] = useState<DateInfo>({
    day: fallbackDay,
    formatted: fallbackDate,
  });

  useEffect(() => {
    const update = () => setInfo(getClientDateInfo());
    update(); // Immediately correct any ISR staleness
    const id = setInterval(update, 60_000); // Refresh every minute
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col gap-0.5 mt-1">
      <span
        suppressHydrationWarning
        className="text-xl font-bold text-text-primary"
      >
        {info.day}
      </span>
      <span
        suppressHydrationWarning
        className="text-text-secondary text-sm"
      >
        {info.formatted}
      </span>
    </div>
  );
}
