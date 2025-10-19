'use client';

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

export type FeaturedShowcaseItem = {
  slug: string;
  title: string;
  cover?: string;
  summary?: string;
  accent?: string;
};

export default function FeaturedShowcase({ items }: { items: FeaturedShowcaseItem[] }) {
  const list = useMemo(() => items.slice(0, 8), [items]);
  const [index, setIndex] = useState(0);
  const hoverPauseRef = useRef(false);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<Window | Element | null>(null);

  const next = useCallback(() => setIndex((i) => (i + 1) % list.length), [list.length]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + list.length) % list.length), [list.length]);

  // Scroll-driven indexing: section stays while scrolling determines active project
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    // Find the nearest scrollable ancestor; fall back to window
    const isScrollable = (node: Element) => {
      const style = window.getComputedStyle(node);
      return /(auto|scroll)/.test(style.overflowY);
    };
    let parent: Element | null = el.parentElement;
    while (parent && !isScrollable(parent)) parent = parent.parentElement;
    const container: Window | Element = parent || window;
    scrollContainerRef.current = container;

    const calcIndex = () => {
      const itemsCount = Math.max(1, list.length);
      if (container === window) {
        const rect = el.getBoundingClientRect();
        const viewport = window.innerHeight;
        const scrollable = Math.max(1, el.offsetHeight - viewport);
        const progressed = Math.min(scrollable, Math.max(0, -rect.top));
        const segment = Math.max(1, scrollable / itemsCount);
        const idx = Math.min(itemsCount - 1, Math.floor(progressed / segment));
        setIndex(idx);
      } else {
        const c = container as Element;
        const viewport = c.clientHeight;
        const scrollable = Math.max(1, el.offsetHeight - viewport);
        // absolute offsetTop of el relative to container
        let base = 0;
        let node: HTMLElement | null = el;
        while (node && node !== c) {
          base += node.offsetTop || 0;
          node = node.offsetParent as HTMLElement | null;
        }
        const progressed = Math.min(scrollable, Math.max(0, (c as HTMLElement).scrollTop - base));
        const segment = Math.max(1, scrollable / itemsCount);
        const idx = Math.min(itemsCount - 1, Math.floor(progressed / segment));
        setIndex(idx);
      }
    };

    const onScroll = () => calcIndex();
    const onResize = () => calcIndex();

    if (container === window) {
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onResize);
    } else {
      (container as Element).addEventListener('scroll', onScroll, { passive: true } as AddEventListenerOptions);
      window.addEventListener('resize', onResize);
    }
    calcIndex();
    return () => {
      if (container === window) {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onResize);
      } else {
        (container as Element).removeEventListener('scroll', onScroll as EventListener);
        window.removeEventListener('resize', onResize);
      }
    };
  }, [list.length]);

  // keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev]);

  const active = list[index];
  const accent = active?.accent || '#111111';
  const posterRef = useRef<HTMLDivElement>(null);
  const [posterStep, setPosterStep] = useState(0);

  // Measure one poster's rendered height to compute translate step
  useEffect(() => {
    const measure = () => {
      const el = posterRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      // mb-4 is 1rem -> 16px spacing between posters
      setPosterStep(rect.height + 16);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  return (
    <section className="w-full select-none" onMouseEnter={() => (hoverPauseRef.current = true)} onMouseLeave={() => (hoverPauseRef.current = false)}>
      {/* Outer scroller creates vertical space; sticky child pins the split layout */}
      <div ref={scrollerRef} style={{ height: `${Math.max(2, list.length) * 100}dvh` }}>
        <div
          className="sticky z-0"
          style={{
            top: "var(--header-h)",
            height: "calc(100dvh - var(--header-h))",
            // set CSS custom property for accent color
            ["--accent" as unknown as string]: accent,
          }}
        >
          <div className="site-grid items-stretch h-full">
        {/* Left: Typography & index */}
        <div className="col-span-12 md:col-span-6 flex flex-col justify-between py-6 md:py-10 overflow-hidden md:pr-[var(--gutter)]">
          <div>
            <motion.h2
              className="font-black uppercase tracking-[-0.04em] leading-[0.9] text-[14vw] md:text-[8rem]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10% 0% -10% 0%' }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <span className="block">Featured</span>
              <span className="block">Projects</span>
            </motion.h2>
            <div className="mt-8 grid grid-cols-12 gap-[var(--gutter)] text-xs md:text-sm uppercase tracking-widest">
              <div className="col-span-6 text-black/70">[{String(list.length).padStart(2, '0')}] Featured</div>
              <div className="col-span-6">Name:</div>
            </div>
            <ul className="mt-3 md:mt-4 text-sm md:text-base leading-relaxed">
              {list.map((it, i) => {
                const isActive = i === index;
                return (
                  <li key={it.slug}>
                    <button
                      className={`group inline-flex items-center gap-2 py-1 transition-opacity ${isActive ? 'opacity-100' : 'opacity-50 hover:opacity-80'}`}
                      onClick={() => setIndex(i)}
                      aria-current={isActive ? 'true' : 'false'}
                      data-hover
                    >
                      <span
                        className="relative"
                        style={{ color: isActive ? 'var(--foreground)' : undefined }}
                        data-underline
                      >
                        {it.title}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="flex items-center gap-4 text-xs md:text-sm uppercase tracking-widest">
            <Link href={`/projects/${active.slug}`} className="inline-flex items-center gap-2" data-hover>
              <span>Learn More</span>
              <span aria-hidden>→</span>
            </Link>
            <div className="ml-auto flex items-center gap-3">
              <button aria-label="Previous" onClick={prev}>←</button>
              <button aria-label="Next" onClick={next}>→</button>
            </div>
          </div>
        </div>

        {/* Right: Vertical movie-poster column synced with active index */}
        <div className="col-span-12 md:col-span-6 order-first md:order-none">
          <div className="relative h-[45vh] md:h-full overflow-hidden">
            {/* Accent background behind image column */}
            <motion.div
              key={`bg-${index}`}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              style={{ background: 'var(--accent)' }}
            />

            {/* Synced track that slides one poster height per active index */}
            <div className="absolute inset-0 overflow-hidden">
              <div
                className="h-full flex flex-col"
                style={{
                  transform: `translateY(-${index * posterStep}px)`,
                  transition: 'transform 600ms cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              >
                {list.map((it, i) => (
                  <Link href={`/projects/${it.slug}`} key={`poster-${it.slug}`} className="block">
                    <div
                      ref={i === 0 ? posterRef : undefined}
                      className="relative w-full aspect-[3/4] mb-4 bg-white shadow-sm"
                    >
                      {it.cover ? (
                        <Image
                          src={it.cover}
                          alt={it.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover"
                          priority={i === index}
                        />
                      ) : null}
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Subtle accent stripe */}
            <div className="absolute left-0 top-0 h-full w-[6px] md:w-[10px]" style={{ background: 'var(--accent)', opacity: 0.7 }} />
          </div>
        </div>
          </div>
        </div>
      </div>
    </section>
  );
}


