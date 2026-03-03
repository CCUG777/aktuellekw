"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface ActiveNavLinkProps {
  href: string;
  label: string;
}

export default function ActiveNavLink({ href, label }: ActiveNavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
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
}
