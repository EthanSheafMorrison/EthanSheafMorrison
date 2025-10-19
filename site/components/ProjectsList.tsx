"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export type ProjectItem = {
  slug: string;
  title: string;
  summary?: string;
  date?: string | Date;
  tags?: string[];
  cover?: string;
};

function formatDate(d?: string | Date) {
  if (!d) return "";
  const dt = d instanceof Date ? d : new Date(d);
  if (Number.isNaN(dt.getTime())) return "";
  const dd = String(dt.getDate()).padStart(2, "0");
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const yy = String(dt.getFullYear()).slice(2);
  return `${dd}.${mm}.${yy}`;
}

export default function ProjectsList({ projects }: { projects: ProjectItem[] }) {
  const allTags = useMemo(() => {
    const s = new Set<string>();
    projects.forEach((p) => (p.tags ?? []).forEach((t) => s.add(t.toLowerCase())));
    return Array.from(s).sort();
  }, [projects]);

  const [active, setActive] = useState<Set<string>>(new Set());

  function toggleTag(tag: string) {
    const next = new Set(active);
    if (next.has(tag)) next.delete(tag);
    else next.add(tag);
    setActive(next);
  }

  const filtered = useMemo(() => {
    if (active.size === 0) return projects;
    return projects.filter((p) => (p.tags ?? []).some((t) => active.has(t.toLowerCase())));
  }, [projects, active]);

  const grouped = useMemo(() => {
    const map = new Map<string, ProjectItem[]>();
    for (const p of filtered) {
      const d = p.date ? new Date(p.date) : undefined;
      const y = d && !Number.isNaN(d.getTime()) ? String(d.getFullYear()) : "Unknown";
      if (!map.has(y)) map.set(y, []);
      map.get(y)!.push(p);
    }
    return Array.from(map.entries()).sort((a, b) => Number(b[0]) - Number(a[0]));
  }, [filtered]);

  // Hover background crossfade (desktop)
  const [activeIsA, setActiveIsA] = useState(true);
  const [bgA, setBgA] = useState<string | null>(null);
  const [bgB, setBgB] = useState<string | null>(null);
  const [showA, setShowA] = useState(false);
  const [showB, setShowB] = useState(false);

  function onHover(url?: string | null) {
    if (!url) return;
    if (activeIsA) {
      setBgB(url);
      setShowB(true);
      setShowA(false);
    } else {
      setBgA(url);
      setShowA(true);
      setShowB(false);
    }
    setActiveIsA(!activeIsA);
  }

  function onLeave() {
    setShowA(false);
    setShowB(false);
  }

  return (
    <div className="site-grid">
      {/* Fixed hover background for desktop */}
      <div className="hidden md:block fixed inset-0 -z-10 pointer-events-none">
        <div
          aria-hidden
          className={"absolute inset-0 bg-cover bg-center transition-opacity duration-500 " + (showA ? "opacity-20" : "opacity-0")}
          style={{ backgroundImage: bgA ? `url(${bgA})` : undefined }}
        />
        <div
          aria-hidden
          className={"absolute inset-0 bg-cover bg-center transition-opacity duration-500 " + (showB ? "opacity-20" : "opacity-0")}
          style={{ backgroundImage: bgB ? `url(${bgB})` : undefined }}
        />
      </div>
      {allTags.length > 0 ? (
        <div className="col-span-12 flex flex-wrap items-center gap-2">
          {allTags.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => toggleTag(t)}
              aria-pressed={active.has(t)}
              className={"border px-2 py-1 text-xs uppercase tracking-wide " + (active.has(t) ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black" : "")}
            >
              {t}
            </button>
          ))}
          {active.size > 0 ? (
            <button
              type="button"
              onClick={() => setActive(new Set())}
              className="ml-1 text-xs underline"
            >
              Clear
            </button>
          ) : null}
        </div>
      ) : null}

      <div className="col-span-12 mt-6 space-y-10">
        {grouped.map(([year, items]) => (
          <section key={year} className="site-grid">
            <div className="col-span-12 text-right text-4xl md:text-6xl font-bold text-zinc-200 dark:text-zinc-800 select-none">
              {year}
            </div>
            <ul className="col-span-12 mt-2 divide-y" onMouseLeave={onLeave}>
              {items.map((p, idx) => (
                <li key={p.slug} onMouseEnter={() => onHover(p.cover)}>
                  <Link href={`/projects/${p.slug}`} className="block py-5 hover:opacity-80">
                    <div className="flex items-baseline justify-between gap-4">
                      <div className="flex items-baseline gap-3">
                        <span className="text-sm text-zinc-500 tabular-nums">{String(idx + 1).padStart(2, "0")}</span>
                        <span className="text-sm text-zinc-500 tabular-nums">{formatDate(p.date)}</span>
                      </div>
                      <h2 className="text-lg md:text-2xl font-semibold flex-1 text-right md:text-left">{p.title}</h2>
                    </div>
                    {p.summary ? (
                      <p className="mt-1 text-zinc-600 dark:text-zinc-400">{p.summary}</p>
                    ) : null}
                    {(p.tags?.length ?? 0) > 0 ? (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {p.tags!.map((t) => (
                          <span key={t} className="text-xs uppercase tracking-wide text-zinc-500">
                            {t}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}


