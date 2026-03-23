"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/kalenderwoche", label: "Kalenderwochen" },
  { href: "/feiertage/2026", label: "Feiertage 2026" },
  { href: "/schulferien/2026", label: "Schulferien 2026" },
  { href: "/datum-heute", label: "Datum heute" },
  { href: "/tagerechner", label: "Tagerechner" },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      {links.map(({ href, label }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`
              transition-colors relative py-1
              ${
                isActive
                  ? "text-accent font-medium"
                  : "text-text-secondary hover:text-text-primary"
              }
            `}
          >
            {label}
            {isActive && (
              <span className="absolute -bottom-[13px] left-0 right-0 h-[2px] bg-accent rounded-full" />
            )}
          </Link>
        );
      })}
    </>
  );
}
