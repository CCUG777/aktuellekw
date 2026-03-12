"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Startseite" },
  { href: "/kalenderwoche", label: "Kalenderwochen" },
  { href: "/kalender-mit-kalenderwochen", label: "KW-Kalender" },
  { href: "/kalenderwochen-uebersicht", label: "KW-Übersicht" },
  { href: "/faq", label: "FAQ" },
];

const moreLinks = [
  { href: "/datum-heute", label: "Datum heute" },
  { href: "/feiertage/2026", label: "Feiertage 2026" },
  { href: "/welche-kalenderwoche-haben-wir", label: "Welche KW haben wir?" },
  { href: "/wie-viele-wochen-hat-ein-jahr", label: "Wochen im Jahr" },
  { href: `/schulferien/${new Date().getFullYear()}`, label: `Schulferien ${new Date().getFullYear()}` },
];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  // Ensure portal only renders on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const drawer = (
    <>
      {/* Overlay */}
      <div
        className={`
          fixed inset-0 z-[100] bg-black/60 backdrop-blur-md
          transition-opacity duration-300
          md:hidden
          ${open ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
        onClick={() => setOpen(false)}
        aria-hidden
      />

      {/* Drawer */}
      <nav
        aria-label="Mobile Navigation"
        className={`
          fixed inset-y-0 right-0 z-[101] w-72
          bg-surface border-l border-border
          shadow-2xl overflow-y-auto
          transition-transform duration-300 ease-out
          md:hidden
          ${open ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border/40">
          <span className="text-sm font-semibold text-text-primary">Navigation</span>
          <button
            onClick={() => setOpen(false)}
            aria-label="Menü schließen"
            className="
              w-8 h-8 rounded-full flex items-center justify-center
              text-text-secondary hover:text-text-primary
              hover:bg-surface-tertiary
              transition-all
            "
          >
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
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Links */}
        <div className="px-3 pt-3 pb-2 flex flex-col gap-0.5">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  px-3 py-[7px] rounded-lg text-[15px] font-medium
                  transition-all duration-150
                  ${
                    isActive
                      ? "bg-accent/10 text-accent"
                      : "text-text-primary hover:bg-surface-tertiary"
                  }
                `}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Weitere Seiten */}
        <div className="mx-3 border-t border-border/30" />
        <div className="px-3 pt-4 pb-3 flex flex-col gap-0.5">
          <span className="px-3 pb-1 text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Ratgeber
          </span>
          {moreLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  px-3 py-[7px] rounded-lg text-[15px] font-medium
                  transition-all duration-150
                  ${
                    isActive
                      ? "bg-accent/10 text-accent"
                      : "text-text-primary hover:bg-surface-tertiary"
                  }
                `}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );

  return (
    <>
      {/* Hamburger Button – only visible on small screens */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Menü öffnen"
        className="
          md:hidden w-8 h-8 rounded-full flex items-center justify-center
          text-text-secondary hover:text-text-primary
          transition-colors
        "
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* Portal: Overlay + Drawer rendern außerhalb des Headers,
          damit backdrop-filter des Headers den fixed-Drawer nicht einschränkt */}
      {mounted && createPortal(drawer, document.body)}
    </>
  );
}
