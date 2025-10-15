"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type GalleryItem = { src: string; alt?: string; width?: number; height?: number };

export default function ProjectGallery({ items }: { items: GalleryItem[] }) {
  const list = useMemo(() => (items.length > 0 ? items : []), [items]);
  const [idx, setIdx] = useState(0);

  const trackRef = useRef<HTMLDivElement>(null);

  const goTo = useCallback((i: number) => {
    if (!trackRef.current) return;
    const next = ((i % list.length) + list.length) % list.length;
    setIdx(next);
    const container = trackRef.current;
    const target = container.children[next] as HTMLElement | undefined;
    if (target) target.scrollIntoView({ behavior: "smooth", inline: "start" });
  }, [list.length]);

  const prev = useCallback(() => goTo(idx - 1), [goTo, idx]);
  const next = useCallback(() => goTo(idx + 1), [goTo, idx]);

  // keyboard navigation
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next]);

  // basic swipe
  const startX = useRef<number | null>(null);
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
  }, []);
  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    if (startX.current == null) return;
    const dx = e.changedTouches[0].clientX - startX.current;
    if (dx > 40) prev();
    else if (dx < -40) next();
    startX.current = null;
  }, [prev, next]);

  if (list.length === 0) return null;

  return (
    <div className="w-full">
      <div
        ref={trackRef}
        className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        aria-roledescription="carousel"
        aria-label="Project images"
      >
        {list.map((it, i) => (
          <div key={i} className="min-w-full snap-start relative h-[55vh] md:h-[75vh] border bg-white">
            <Image src={it.src} alt={it.alt ?? ""} fill className="object-cover" sizes="(max-width: 768px) 100vw, 60vw" />
          </div>
        ))}
      </div>
      {/* controls */}
      <div className="mt-2 flex items-center justify-between">
        <div className="flex gap-2">
          <button type="button" onClick={prev} className="border px-2 py-1 text-xs" aria-label="Previous image">Prev</button>
          <button type="button" onClick={next} className="border px-2 py-1 text-xs" aria-label="Next image">Next</button>
        </div>
        <div className="flex gap-1">
          {list.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              className={"h-2 w-2 rounded-full border " + (i === idx ? "bg-zinc-900 dark:bg-zinc-100" : "bg-transparent")}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === idx}
            />
          ))}
        </div>
      </div>

      {/* thumbnails (md+) */}
      {list.length > 1 ? (
        <div className="mt-3 hidden md:flex gap-2 overflow-x-auto">
          {list.map((it, i) => (
            <button key={i} type="button" onClick={() => goTo(i)} className={"relative h-16 w-24 border overflow-hidden " + (i === idx ? "ring-2 ring-zinc-900 dark:ring-zinc-100" : "")}
            >
              <Image src={it.src} alt={it.alt ?? ""} fill className="object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

