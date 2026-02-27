"use client";

import { useEffect, useState } from "react";

/** Sun icon – shown in dark mode (switch to light) */
function SunIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="2" x2="12" y2="5" />
      <line x1="12" y1="19" x2="12" y2="22" />
      <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" />
      <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
      <line x1="2" y1="12" x2="5" y2="12" />
      <line x1="19" y1="12" x2="22" y2="12" />
      <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" />
      <line x1="17.66" y1="6.34" x2="19.78" y2="4.22" />
    </svg>
  );
}

/** Moon icon – shown in light mode (switch to dark) */
function MoonIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
    </svg>
  );
}

export default function ThemeToggle() {
  // null = not yet mounted (prevents hydration mismatch)
  const [isDark, setIsDark] = useState<boolean | null>(null);

  useEffect(() => {
    // Read initial state from DOM (set by inline init script in layout)
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const html = document.documentElement;
    const next = !isDark;

    if (next) {
      html.classList.add("dark");
      html.classList.remove("light");
      localStorage.setItem("theme", "dark");
    } else {
      html.classList.remove("dark");
      html.classList.add("light");
      localStorage.setItem("theme", "light");
    }

    setIsDark(next);
  };

  // Don't render until mounted (avoids server/client class mismatch)
  if (isDark === null) {
    return <div className="w-8 h-8" aria-hidden />;
  }

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Zum Hellmodus wechseln" : "Zum Dunkelmodus wechseln"}
      title={isDark ? "Hellmodus" : "Dunkelmodus"}
      className="
        w-8 h-8 rounded-full flex items-center justify-center
        text-text-secondary hover:text-text-primary
        bg-transparent hover:bg-surface-tertiary
        border border-transparent hover:border-border
        transition-all duration-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent
      "
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
