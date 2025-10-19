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
  // Optional richer metadata used by the filter panel variant
  type?: string;
  topics?: string[];
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

export default function ProjectsList({ projects, variant = "chips" }: { projects: ProjectItem[]; variant?: "chips" | "panel" }) {
  const allTags = useMemo(() => {
    const s = new Set<string>();
    projects.forEach((p) => (p.tags ?? []).forEach((t) => s.add(t.toLowerCase())));
    return Array.from(s).sort();
  }, [projects]);

  // Legacy chip filter state (home page usage)
  const [active, setActive] = useState<Set<string>>(new Set());

  function toggleTag(tag: string) {
    const next = new Set(active);
    if (next.has(tag)) next.delete(tag);
    else next.add(tag);
    setActive(next);
  }

  // Panel filter state (AND across groups, OR within each group)
  const [selTypes, setSelTypes] = useState<Set<string>>(new Set());
  const [selTopics, setSelTopics] = useState<Set<string>>(new Set());

  // Build option lists and counts from dataset
  const options = useMemo(() => {
    const typeCounts = new Map<string, number>();
    const topicCounts = new Map<string, number>();
    for (const p of projects) {
      const t = (p.type ?? "").toLowerCase().trim();
      if (t) typeCounts.set(t, (typeCounts.get(t) ?? 0) + 1);
      for (const tp of p.topics ?? []) {
        const k = (tp ?? "").toLowerCase().trim();
        if (k) topicCounts.set(k, (topicCounts.get(k) ?? 0) + 1);
      }
    }
    return {
      types: Array.from(typeCounts.entries()).sort((a, b) => a[0].localeCompare(b[0])),
      topics: Array.from(topicCounts.entries()).sort((a, b) => a[0].localeCompare(b[0])),
    };
  }, [projects]);

  const filtered = useMemo(() => {
    if (variant === "chips") {
      if (active.size === 0) return projects;
      return projects.filter((p) => (p.tags ?? []).some((t) => active.has(t.toLowerCase())));
    }
    // panel logic
    const hasTypeFilter = selTypes.size > 0;
    const hasTopicFilter = selTopics.size > 0;
    if (!hasTypeFilter && !hasTopicFilter) return projects;
    return projects.filter((p) => {
      const typeOk = !hasTypeFilter || (!!p.type && selTypes.has(p.type.toLowerCase()));
      const topicOk = !hasTopicFilter || (p.topics ?? []).some((t) => selTopics.has(t.toLowerCase()));
      return typeOk && topicOk;
    });
  }, [projects, active, selTypes, selTopics, variant]);

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
      <div className="hidden md:block fixed inset-0 z-0 pointer-events-none">
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
      {variant === "chips" ? (
        allTags.length > 0 ? (
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
        ) : null
      ) : (
        <aside className="col-span-12 md:col-span-4 md:sticky md:top-24 md:self-start z-10">
          <div className="text-sm tracking-widest font-extrabold uppercase text-zinc-700 dark:text-zinc-300">Filter</div>

          {/* Tree container */}
          <div className="mt-4 relative pl-5">
            {/* Vertical guide line */}
            <div aria-hidden className="absolute left-1 top-0 bottom-0 border-l-2 border-zinc-300 dark:border-zinc-700" />

            {/* TYPE node */}
            <details open className="group">
              <summary className="flex items-center gap-2 cursor-pointer select-none">
                <span aria-hidden className="text-xl leading-none">└</span>
                <span className="uppercase tracking-wider font-bold">Type</span>
              </summary>
              <ul className="mt-3 ml-6 space-y-2">
                {options.types.map(([name, count]) => {
                  const key = name.toLowerCase();
                  const checked = selTypes.has(key);
                  return (
                    <li key={key} className="flex items-center gap-3">
                      <input
                        id={`type-${key}`}
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => {
                          const next = new Set(selTypes);
                          if (e.target.checked) next.add(key); else next.delete(key);
                          setSelTypes(next);
                        }}
                        className="appearance-none w-4 h-4 border-2 border-zinc-900 dark:border-zinc-100 rounded-none checked:bg-zinc-900 dark:checked:bg-zinc-100 checked:border-zinc-900 dark:checked:border-zinc-100"
                      />
                      <label htmlFor={`type-${key}`} className="cursor-pointer text-sm md:text-base">
                        {name.charAt(0).toUpperCase() + name.slice(1)} <span className="text-zinc-500">({count})</span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </details>

            {/* TOPIC node */}
            <details open className="group mt-6">
              <summary className="flex items-center gap-2 cursor-pointer select-none">
                <span aria-hidden className="text-xl leading-none">└</span>
                <span className="uppercase tracking-wider font-bold">Topic</span>
              </summary>
              <ul className="mt-3 ml-6 space-y-2">
                {options.topics.map(([name, count]) => {
                  const key = name.toLowerCase();
                  const checked = selTopics.has(key);
                  return (
                    <li key={key} className="flex items-center gap-3">
                      <input
                        id={`topic-${key}`}
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => {
                          const next = new Set(selTopics);
                          if (e.target.checked) next.add(key); else next.delete(key);
                          setSelTopics(next);
                        }}
                        className="appearance-none w-4 h-4 border-2 border-zinc-900 dark:border-zinc-100 rounded-none checked:bg-zinc-900 dark:checked:bg-zinc-100 checked:border-zinc-900 dark:checked:border-zinc-100"
                      />
                      <label htmlFor={`topic-${key}`} className="cursor-pointer text-sm md:text-base">
                        {name.charAt(0).toUpperCase() + name.slice(1)} <span className="text-zinc-500">({count})</span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </details>

            {(selTypes.size > 0 || selTopics.size > 0) ? (
              <button
                type="button"
                onClick={() => { setSelTypes(new Set()); setSelTopics(new Set()); }}
                className="block mt-8 uppercase tracking-widest font-bold text-left"
              >
                Clear Filters
              </button>
            ) : null}
          </div>
        </aside>
      )}

      <div className={"col-span-12 " + (variant === "panel" ? "md:col-span-8" : "") + " mt-6 space-y-10"}>
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


