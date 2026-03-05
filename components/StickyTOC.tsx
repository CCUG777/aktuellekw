"use client";

import { useEffect, useState, useRef, useCallback } from "react";

interface TOCItem {
  href: string;
  label: string;
}

export default function StickyTOC({ items }: { items: TOCItem[] }) {
  const [activeId, setActiveId] = useState<string>("");
  const navRef = useRef<HTMLDivElement>(null);
  // Sperrt Observer-Updates während user-initiiertem Smooth-Scroll
  const isScrollingRef = useRef(false);

  useEffect(() => {
    const ids = items.map((i) => i.href.replace("#", ""));
    const visibleSet = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        // Während eines Klick-Scrolls: Observer ignorieren
        if (isScrollingRef.current) return;

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleSet.add(entry.target.id);
          } else {
            visibleSet.delete(entry.target.id);
          }
        });
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

  // Pill horizontal zentrieren – NUR den TOC-Container scrollen, NIE die Seite
  const scrollPillIntoView = useCallback((id: string) => {
    const nav = navRef.current;
    if (!nav) return;
    const pill = nav.querySelector(`[data-toc-id="${id}"]`) as HTMLElement | null;
    if (!pill) return;

    const navRect = nav.getBoundingClientRect();
    const pillRect = pill.getBoundingClientRect();
    // Zentriere den Pill im sichtbaren Bereich des Containers
    const scrollLeft =
      pill.offsetLeft - nav.offsetWidth / 2 + pillRect.width / 2;
    nav.scrollTo({ left: scrollLeft, behavior: "smooth" });
  }, []);

  // Wenn sich der Active-State durch normales Scrollen ändert → Pill zentrieren
  useEffect(() => {
    if (!activeId) return;
    scrollPillIntoView(activeId);
  }, [activeId, scrollPillIntoView]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href) as HTMLElement | null;
    if (!target) return;

    const clickedId = href.replace("#", "");

    // 1. Active-State sofort setzen (nicht auf Observer warten)
    setActiveId(clickedId);
    scrollPillIntoView(clickedId);

    // 2. Observer sperren, damit er während des Scrolls nicht feuert
    isScrollingRef.current = true;

    // 3. Seite scrollen mit manuellem Offset
    const OFFSET = 112; // Header ~56px + TOC ~48px + 8px Puffer
    const y = target.getBoundingClientRect().top + window.scrollY - OFFSET;
    window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });

    // 4. Observer nach Scroll-Animation wieder freigeben
    setTimeout(() => {
      isScrollingRef.current = false;
    }, 800);
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
