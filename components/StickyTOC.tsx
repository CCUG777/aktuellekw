"use client";

import { useEffect, useState, useRef } from "react";

interface TOCItem {
  href: string;
  label: string;
}

export default function StickyTOC({ items }: { items: TOCItem[] }) {
  const [activeId, setActiveId] = useState<string>("");
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ids = items.map((i) => i.href.replace("#", ""));
    const visibleSet = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        // Track all currently visible sections
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleSet.add(entry.target.id);
          } else {
            visibleSet.delete(entry.target.id);
          }
        });
        // Pick the topmost visible section (in DOM/items order)
        const topmost = ids.find((id) => visibleSet.has(id));
        if (topmost) {
          setActiveId(topmost);
        }
      },
      { rootMargin: "-80px 0px -50% 0px", threshold: 0 }
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  // Auto-scroll active pill into view on mobile
  useEffect(() => {
    if (!activeId || !navRef.current) return;
    const activeEl = navRef.current.querySelector(
      `[data-toc-id="${activeId}"]`
    );
    if (activeEl) {
      activeEl.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [activeId]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="sticky top-14 z-40 bg-surface/80 backdrop-blur-lg border-b border-border/50">
      <nav
        ref={navRef}
        className="max-w-3xl mx-auto px-4 py-3 flex gap-2 overflow-x-auto scrollbar-hide sm:flex-wrap sm:justify-center"
        aria-label="Inhaltsverzeichnis"
      >
        {items.map((item) => {
          const id = item.href.replace("#", "");
          const isActive = activeId === id;
          return (
            <a
              key={item.href}
              href={item.href}
              data-toc-id={id}
              onClick={(e) => handleClick(e, item.href)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200 border ${
                isActive
                  ? "bg-accent text-white border-accent shadow-sm"
                  : "bg-surface-secondary border-border text-text-secondary hover:text-accent hover:border-accent"
              }`}
            >
              {item.label}
            </a>
          );
        })}
      </nav>
    </div>
  );
}
