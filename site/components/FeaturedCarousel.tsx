"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type FeaturedItem = {
  slug: string;
  title: string;
  cover?: string;
  summary?: string;
};

export default function FeaturedCarousel({ items }: { items: FeaturedItem[] }) {
  const list = useMemo(() => items.slice(0, 8), [items]);
  const [idx, setIdx] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const next = useCallback(() => {
    setIdx((i) => (i + 1) % list.length);
  }, [list.length]);
  const prev = useCallback(() => {
    setIdx((i) => (i - 1 + list.length) % list.length);
  }, [list.length]);

  // autoplay
  useEffect(() => {
    const id = window.setInterval(() => setIdx((i) => (i + 1) % list.length), 4000);
    return () => window.clearInterval(id);
  }, [list.length]);

  // swipe handlers (basic)
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
  }, [next, prev]);

  return (
    <section className="h-full flex flex-col overflow-hidden">
      <div className="flex items-center justify-between py-3">
        <h2 className="text-2xl md:text-3xl font-semibold">Featured</h2>
        <div className="flex gap-2">
          <button className="border px-3 py-1" onClick={prev} aria-label="Previous">←</button>
          <button className="border px-3 py-1" onClick={next} aria-label="Next">→</button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden min-h-0" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <div
          ref={trackRef}
          className="flex transition-transform duration-500 h-full"
          style={{ transform: `translateX(-${idx * 100}%)`, width: `${list.length * 100}%` }}
        >
          {list.map((it) => (
            <div key={it.slug} className="w-full shrink-0 h-full min-h-0">
              <div className="grid md:grid-cols-2 gap-8 items-center h-full min-h-0">
                <div className="order-2 md:order-1">
                  <h3 className="text-3xl md:text-5xl font-bold tracking-tight">{it.title}</h3>
                  {it.summary ? (
                    <p className="mt-4 text-zinc-600 dark:text-zinc-400 max-w-prose">{it.summary}</p>
                  ) : null}
                  <div className="mt-6">
                    <Link href={`/projects/${it.slug}`} className="inline-block border px-4 py-2 text-sm">View project</Link>
                  </div>
                </div>
                <Link href={`/projects/${it.slug}`} className="order-1 md:order-2 block">
                  <div className="relative h-[45vh] md:h-[55vh] border overflow-hidden bg-white">
                    {it.cover ? (
                      <Image src={it.cover} alt={it.title} fill className="object-cover" />
                    ) : null}
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


